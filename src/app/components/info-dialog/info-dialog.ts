import { Component, ElementRef, effect, input, output, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Pop-up with a heading, a short message and one action. It is used for messages such as
 * "Ups! Not quite enough..." or "Ups! Different units...".
 *
 * It uses the native <dialog> element: it is shown in the middle of the screen with a dark
 * background, closes with Escape, with the X, or with a click outside of the pop-up.
 */
@Component({
  selector: 'app-info-dialog',
  imports: [RouterLink],
  templateUrl: './info-dialog.html',
  styleUrl: './info-dialog.scss',
})
export class InfoDialog {
  /** Whether the pop-up is shown. */
  readonly open = input(false);

  /** Heading of the pop-up. */
  readonly heading = input.required<string>();

  /** Message below the heading. */
  readonly message = input.required<string>();

  /** Text of the action at the bottom. */
  readonly actionLabel = input.required<string>();

  /** Route the action leads to. Without a route the action only closes the pop-up. */
  readonly actionLink = input<string>();

  /** Emitted after the pop-up was closed (by any way), so the parent can reset its state. */
  readonly closed = output<void>();

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    effect(() => {
      const element = this.dialog().nativeElement;
      if (this.open() && !element.open) {
        element.showModal();
      } else if (!this.open() && element.open) {
        element.close();
      }
    });
  }

  /** Called when the dialog was closed (Escape, X button, action or click outside). */
  protected onClose(): void {
    this.closed.emit();
  }

  /** Closes the pop-up when the click hit the dark background and not the pop-up itself. */
  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  /** Closes the pop-up. */
  protected close(): void {
    this.dialog().nativeElement.close();
  }
}
