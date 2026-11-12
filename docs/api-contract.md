# API Contract: Angular <-> n8n

Single source of truth for the JSON exchanged between the Angular frontend and the n8n workflow.
TypeScript counterparts live in `src/app/models/`.

## Overview

| Direction | Endpoint | Purpose |
|---|---|---|
| Angular -> n8n | `POST {N8N_WEBHOOK_URL}/generate-recipes` | Generate 3 recipes |
| Angular -> n8n | `GET  {N8N_WEBHOOK_URL}/quota` | Read remaining quota for the caller's IP |
| Angular -> Supabase | `select` on `recipes` (anon key, read-only via RLS) | Recipe library |
| n8n -> Supabase | `insert` on `recipes`, `upsert` on `quota_usage` (service key) | Persistence |

The client IP is **never sent by the frontend**. n8n reads it from the webhook request headers
(`x-forwarded-for`, falling back to the socket address). IPv4 and IPv6 are both supported.

## Generate request

`POST /generate-recipes`

```json
{
  "ingredients": [
    { "name": "Tomato", "amount": 400, "unit": "g" },
    { "name": "Egg", "amount": 4, "unit": "pcs" }
  ],
  "portions": 2,
  "timeCategory": "quick",
  "cuisine": "italian",
  "diet": "none",
  "helpers": 1
}
```

| Field | Type | Rules |
|---|---|---|
| `ingredients` | array | 1 to 30 items |
| `ingredients[].name` | string | 1 to 60 chars, trimmed |
| `ingredients[].amount` | number | > 0 and <= 100000 |
| `ingredients[].unit` | enum | `g`, `kg`, `ml`, `l`, `pcs`, `tbsp`, `tsp`, `pinch` |
| `portions` | integer | 1 to 12, default 2 |
| `timeCategory` | enum | `quick` (up to 20 min), `medium` (20-45 min), `elaborate` (45+ min) |
| `cuisine` | enum | `german`, `italian`, `japanese`, `indian`, `gourmet`, `fusion` |
| `diet` | enum | `none`, `vegetarian`, `vegan`, `keto` |
| `helpers` | integer | 1 to 3 |

The frontend validates first; n8n validates the same rules again and rejects anything invalid
with `VALIDATION_ERROR`.

## Generate response (success)

HTTP 200

```json
{
  "status": "ok",
  "quota": { "remainingForIp": 2, "remainingGlobal": 9, "resetsAt": "2026-11-13T00:00:00Z" },
  "recipes": [ /* exactly 3 Recipe objects */ ]
}
```

### Recipe object

```json
{
  "id": "uuid",
  "title": "Quick Shakshuka",
  "description": "Eggs poached in a spiced tomato sauce.",
  "cuisine": "italian",
  "diet": "none",
  "timeCategory": "quick",
  "totalMinutes": 18,
  "portions": 2,
  "helpers": 1,
  "ingredients": [
    { "name": "Tomato", "amount": 400, "unit": "g", "missing": false },
    { "name": "Olive oil", "amount": 2, "unit": "tbsp", "missing": true }
  ],
  "steps": [
    {
      "order": 1,
      "text": "Dice the tomatoes.",
      "durationMinutes": 3,
      "helper": 1,
      "parallelGroup": null,
      "isWaiting": false
    }
  ],
  "nutrition": {
    "perPortion": { "calories": 320, "proteinG": 18, "carbsG": 22, "fatG": 17, "proteinPct": 22, "carbsPct": 28, "fatPct": 50 },
    "total":      { "calories": 640, "proteinG": 36, "carbsG": 44, "fatG": 34, "proteinPct": 22, "carbsPct": 28, "fatPct": 50 }
  },
  "createdAt": "2026-11-12T09:30:00Z"
}
```

Recipe rules (enforced in the AI prompt and re-checked in n8n):

- Exactly 3 recipes that differ in preparation method or flavor profile.
- Each recipe uses at least 70% of the user's ingredients.
- At most 3 ingredients with `missing: true`, and only basic pantry items.
- `steps` are chronological. `helper` is `1..helpers`; every helper gets at least one step.
- `parallelGroup` is a shared label (e.g. `"A"`) for steps that run at the same time, otherwise `null`.
- `isWaiting` marks passive time (oven, simmering) that other steps can overlap.
- Macro percentages sum to 100 (+/- 1 for rounding).

## Quota request

`GET /quota` returns:

```json
{ "status": "ok", "quota": { "remainingForIp": 3, "remainingGlobal": 12, "resetsAt": "2026-11-13T00:00:00Z" } }
```

Limits: 3 recipe generations per IP per day, 12 system-wide per day (UTC date).
Shared IPs (office network) share the 3 generations.

## Errors

Every error uses the same shape. HTTP status is shown in the table.

```json
{ "status": "error", "code": "IP_QUOTA_EXCEEDED", "message": "You have used all 3 recipe generations for today. Try again tomorrow.", "quota": { "remainingForIp": 0, "remainingGlobal": 7, "resetsAt": "2026-11-13T00:00:00Z" } }
```

| Code | HTTP | Meaning |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Request body failed validation (`details` lists the fields) |
| `IP_QUOTA_EXCEEDED` | 429 | Daily limit for this IP reached |
| `GLOBAL_QUOTA_EXCEEDED` | 429 | System-wide daily limit reached |
| `RATE_LIMITED` | 429 | Too many requests in a short time (throttling cost airbag) |
| `AI_ERROR` | 502 | Gemini failed or returned an invalid recipe structure |
| `INTERNAL_ERROR` | 500 | Anything else; also triggers the n8n error email |

## Supabase tables (planned)

- `recipes`: one row per generated recipe. Columns for filtering (`cuisine`, `total_minutes`,
  `created_at`) plus the full Recipe object in a `data jsonb` column.
- `quota_usage`: `(ip text, usage_date date, count int)` with primary key `(ip, usage_date)`.
  System-wide usage is the sum of `count` for the date.

Row Level Security: anonymous users may only `select` from `recipes`. `quota_usage` is not
exposed to the anon key. Inserts happen exclusively from n8n using the service key.
