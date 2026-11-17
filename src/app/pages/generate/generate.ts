import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { INGREDIENT_SUGGESTIONS, UNIT_OPTIONS } from '../../data/ingredient-suggestions';
import { IngredientInput, Unit } from '../../models/recipe.models';
import { RecipeFormService } from '../../services/recipe-form';

/** Amount that is preselected for every new ingredient. */
const DEFAULT_AMOUNT = 100;

/** Step 1 of the generator: the user enters the ingredients they have. */
@Component({
  selector: 'app-generate',
  imports: [RouterLink, FormsModule],
  templateUrl: './generate.html',
  styleUrl: './generate.scss',
})
export class Generate {
  protected readonly recipeForm = inject(RecipeFormService);
  protected readonly suggestions = INGREDIENT_SUGGESTIONS;
  protected readonly unitOptions = UNIT_OPTIONS;

  protected readonly name = signal('');
  protected readonly amount = signal<number | null>(DEFAULT_AMOUNT);
  protected readonly unit = signal<Unit>('g');

  /** True when the current input is a valid ingredient (name 1-60 chars, amount 0-100000). */
  protected readonly canAdd = computed(() => {
    const amount = this.amount();
    const name = this.name().trim();
    return name.length > 0 && name.length <= 60 && amount !== null && amount > 0 && amount <= 100000;
  });

  /** True while the unit list is open. */
  protected readonly unitOpen = signal(false);

  /** Label of the selected unit, shown on the dropdown button. */
  protected readonly unitLabel = computed(
    () => this.unitOptions.find((option) => option.value === this.unit())?.label ?? '',
  );

  /** True while the ingredient input has focus. */
  protected readonly focused = signal(false);

  /** Up to 3 suggestions that start with the typed text (case-insensitive), excluding exact matches. */
  protected readonly matches = computed(() => {
    const query = this.name().trim().toLowerCase();
    if (!query) return [];
    return this.suggestions
      .filter((s) => s.toLowerCase().startsWith(query) && s.toLowerCase() !== query)
      .slice(0, 3);
  });

  /** The rest of the best match that follows the typed text, shown as grey ghost text. */
  protected readonly completion = computed(() => {
    const name = this.name();
    const best = this.matches()[0];
    return best && name === name.trim() ? best.slice(name.length) : '';
  });

  /** True when the suggestion list should be visible. */
  protected readonly showSuggestions = computed(() => this.focused() && this.matches().length > 0);

  /**
   * Accepts the ghost text (Tab or Right Arrow). Without ghost text the key keeps its normal behavior.
   * @param event The keyboard event.
   */
  protected acceptCompletion(event: Event): void {
    if (!this.completion()) return;
    event.preventDefault();
    this.name.set(this.matches()[0]);
  }

  /**
   * Fills the input with the chosen suggestion.
   * @param suggestion The chosen ingredient name.
   */
  protected selectSuggestion(suggestion: string): void {
    this.name.set(suggestion);
  }

  /** Opens or closes the unit list. */
  protected toggleUnits(): void {
    this.unitOpen.update((open) => !open);
  }

  /** Closes the unit list. */
  protected closeUnits(): void {
    this.unitOpen.set(false);
  }

  /**
   * Selects a unit and closes the list.
   * @param unit The chosen unit.
   */
  protected selectUnit(unit: Unit): void {
    this.unit.set(unit);
    this.unitOpen.set(false);
  }

  /**
   * Blocks characters that the number input would accept but that are not valid amounts (e, +, -).
   * @param event The keyboard event.
   */
  protected blockInvalidKeys(event: KeyboardEvent): void {
    if (['e', 'E', '+', '-'].includes(event.key)) event.preventDefault();
  }

  /** Adds the entered ingredient to the list and clears the input fields. */
  protected addIngredient(): void {
    if (!this.canAdd()) return;
    this.recipeForm.addIngredient({
      name: this.name().trim(),
      amount: this.amount() as number,
      unit: this.unit(),
    });
    this.name.set('');
    this.amount.set(DEFAULT_AMOUNT);
  }

  /**
   * Formats the amount of an ingredient for the list, e.g. "100g" or "1" for pieces.
   * @param item The ingredient to format.
   * @returns The amount with its unit; pieces are shown without a unit.
   */
  protected formatAmount(item: IngredientInput): string {
    return item.unit === 'pcs' ? `${item.amount}` : `${item.amount}${item.unit}`;
  }

  /** Position of the list entry that is being edited, or null. */
  protected readonly editingIndex = signal<number | null>(null);

  /** Amount in the edit fields of the list entry that is being edited. */
  protected readonly editAmount = signal<number | null>(null);

  /** Unit in the edit fields of the list entry that is being edited. */
  protected readonly editUnit = signal<Unit>('g');

  /** True while the unit list of the edited entry is open. */
  protected readonly editUnitOpen = signal(false);

  /** Label of the unit selected for the edited entry. */
  protected readonly editUnitLabel = computed(
    () => this.unitOptions.find((option) => option.value === this.editUnit())?.label ?? '',
  );

  /** True when the edited amount is valid (0-100000). */
  protected readonly canSaveEdit = computed(() => {
    const amount = this.editAmount();
    return amount !== null && amount > 0 && amount <= 100000;
  });

  /**
   * Switches a list entry to edit mode and copies its amount and unit into the edit fields.
   * @param index Position of the ingredient in the list.
   */
  protected startEditing(index: number): void {
    const item = this.recipeForm.ingredients()[index];
    this.editAmount.set(item.amount);
    this.editUnit.set(item.unit);
    this.editUnitOpen.set(false);
    this.editingIndex.set(index);
  }

  /** Opens or closes the unit list of the edited entry. */
  protected toggleEditUnits(): void {
    this.editUnitOpen.update((open) => !open);
  }

  /** Closes the unit list of the edited entry. */
  protected closeEditUnits(): void {
    this.editUnitOpen.set(false);
  }

  /**
   * Selects a unit for the edited entry and closes the list.
   * @param unit The chosen unit.
   */
  protected selectEditUnit(unit: Unit): void {
    this.editUnit.set(unit);
    this.editUnitOpen.set(false);
  }

  /** Saves the edited amount and unit and leaves edit mode. */
  protected saveEdit(): void {
    const index = this.editingIndex();
    if (index === null || !this.canSaveEdit()) return;
    const item = this.recipeForm.ingredients()[index];
    this.recipeForm.updateIngredient(index, {
      ...item,
      amount: this.editAmount() as number,
      unit: this.editUnit(),
    });
    this.cancelEdit();
  }

  /** Leaves edit mode without saving. */
  protected cancelEdit(): void {
    this.editingIndex.set(null);
    this.editUnitOpen.set(false);
  }

  /**
   * Keyboard handling in the edit amount field: Enter saves, Escape cancels, invalid characters are blocked.
   * @param event The keyboard event.
   */
  protected onEditKeydown(event: KeyboardEvent): void {
    this.blockInvalidKeys(event);
    if (event.key === 'Enter') {
      event.preventDefault();
      this.saveEdit();
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }

  /**
   * Removes an ingredient from the list.
   * @param index Position of the ingredient in the list.
   */
  protected removeIngredient(index: number): void {
    this.cancelEdit();
    this.recipeForm.removeIngredient(index);
  }
}
