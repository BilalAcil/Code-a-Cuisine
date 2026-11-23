import { computed, Directive, signal } from '@angular/core';

/**
 * Makes the arrow image inside a link blink: it disappears for a moment and fades back in, both when
 * the pointer enters the link and when it leaves. The animation itself is defined in styles.scss
 * (`[data-arrow-blink]`). Two animations with different names are used alternately, so the browser
 * restarts the animation on every change.
 */
@Directive({
  selector: '[appArrowBlink]',
  host: {
    '(mouseenter)': 'blink()',
    '(mouseleave)': 'blink()',
    '[attr.data-arrow-blink]': 'state()',
  },
})
export class ArrowBlink {
  private readonly count = signal(0);

  /** Which of the two animations is active: 'odd', 'even', or null before the first change. */
  protected readonly state = computed(() => {
    const count = this.count();
    return count === 0 ? null : count % 2 === 1 ? 'odd' : 'even';
  });

  /** Restarts the animation. */
  protected blink(): void {
    this.count.update((count) => count + 1);
  }
}
