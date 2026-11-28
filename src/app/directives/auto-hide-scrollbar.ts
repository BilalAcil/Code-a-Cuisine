import { DestroyRef, Directive, inject, signal } from '@angular/core';

/** How long the scrollbar stays visible after the last mouse move or scroll (ms). */
const VISIBLE_MS = 2000;

/**
 * Shows the scrollbar of a scrollable element only while the mouse moves over it or while it is
 * scrolled, and hides it again after a short time. The element gets the class `scrollbar-visible`
 * (the scrollbar styles are in the component that uses the directive).
 */
@Directive({
  selector: '[appAutoHideScrollbar]',
  host: {
    '[class.scrollbar-visible]': 'visible()',
    '(mouseenter)': 'show()',
    '(mousemove)': 'show()',
    '(scroll)': 'show()',
  },
})
export class AutoHideScrollbar {
  /** Whether the scrollbar is visible. */
  protected readonly visible = signal(false);

  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  /** Shows the scrollbar and starts the timer that hides it again. */
  protected show(): void {
    this.visible.set(true);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.visible.set(false), VISIBLE_MS);
  }
}
