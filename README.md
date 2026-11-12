# Code-a-Cuisine

A smart web app that turns the ingredients you already have into three matching recipes.
It helps hobby cooks and shared flats reduce food waste while cooking varied and healthy meals.
Every generated recipe is saved to a public library that anyone can browse.

> Status: work in progress.

## Features

- Ingredient input with amounts and units (autocomplete)
- Portions (1-12), time category, cooking style, diet and number of cooking helpers (1-3)
- Exactly 3 AI-generated recipe suggestions using at least 70% of your ingredients
- Chronological step-by-step instructions with parallel steps and a to-do list per helper
- Nutrition analysis (calories and macros, per portion and total)
- IP-based daily quota (3 recipes per IP, 12 system-wide) with clear error messages
- Public recipe library with filtering by cooking style and pagination
- Responsive, touch-friendly design

## Tech stack

| Part | Technology |
|---|---|
| Frontend | Angular 21, SCSS |
| Automation | n8n Cloud |
| AI | Google Gemini |
| Database | Supabase (PostgreSQL) |

## Architecture

```
Angular  --POST /generate-recipes-->  n8n  -->  Gemini
   |                                   |
   |                                   +--> Supabase (save recipes, track quota)
   |
   +--select (read-only)-------------> Supabase (recipe library)
```

The JSON exchanged between Angular and n8n is documented in
[docs/api-contract.md](docs/api-contract.md).

## Getting started

### Prerequisites

- Node.js 22 (>= 22.12) and npm
- Angular CLI 21

### Installation

```bash
git clone https://github.com/BilalAcil/Code-a-Cuisine.git
cd Code-a-Cuisine
npm install --legacy-peer-deps
```

### Configuration

Environment values (n8n webhook URL, Supabase URL and anon key) are set in
`src/environments/`. Never commit secrets: the Supabase service key and the Gemini API key
belong only in n8n credentials.

### Run

```bash
ng serve
```

Open http://localhost:4200.

### Build

```bash
ng build
```

## Project structure

```
src/app/models/   TypeScript models for the API contract
docs/             Documentation (API contract)
n8n/              Exported n8n workflows (planned)
```

## License

Educational project created as part of the Developer Akademie program.
