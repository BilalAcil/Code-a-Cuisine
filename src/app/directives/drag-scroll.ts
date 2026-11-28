import { Directive, ElementRef, inject } from '@angular/core';

/** Mouse movement (px) from which a press counts as a drag and not as a click. */
const DRAG_THRESHOLD = 5;

/** Share of the speed that is left after 16 ms of rolling. Smaller values stop the wheel sooner. */
const FRICTION = 0.95;

/** Speed (px per ms) below which the rolling stops. */
const MIN_SPEED = 0.02;

/**
 * Lets the user scroll a horizontally scrollable element by pressing the mouse on it and dragging
 * sideways. After the release the element keeps rolling for a moment and slows down, like a
 * wheel of fortune. Touch screens scroll natively (with their own momentum), so only the mouse
 * is handled here. A drag does not trigger a click on the links inside.
 */
@Directive({
  selector: '[appDragScroll]',
  host: {
    '[style.cursor]': 'dragging ? "grabbing" : null',
    '(pointerdown)': 'start($event)',
    '(pointermove)': 'move($event)',
    '(pointerup)': 'end($event)',
    '(pointercancel)': 'end($event)',
    '(click)': 'blockClickAfterDrag($event)',
    '(dragstart)': '$event.preventDefault()',
  },
})
export class DragScroll {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  /** True while the mouse button is pressed on the element. */
  private pressed = false;

  /** True after the mouse moved far enough to count as a drag. */
  protected dragging = false;

  private startX = 0;
  private startScroll = 0;

  /** Scroll speed in px per ms (positive = scrolls to the right), measured while dragging. */
  private speed = 0;
  private lastTime = 0;
  private lastScroll = 0;
  private frame = 0;

  /** Starts a possible drag when the main mouse button is pressed. */
  protected start(event: PointerEvent): void {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    cancelAnimationFrame(this.frame); // a new press stops the rolling
    this.pressed = true;
    this.dragging = false;
    this.speed = 0;
    this.startX = event.clientX;
    this.startScroll = this.element.scrollLeft;
    this.lastTime = event.timeStamp;
    this.lastScroll = this.startScroll;
  }

  /** Scrolls the element while the mouse is dragged. */
  protected move(event: PointerEvent): void {
    if (!this.pressed) return;
    const distance = event.clientX - this.startX;
    if (!this.dragging && Math.abs(distance) > DRAG_THRESHOLD) {
      this.dragging = true;
      this.element.setPointerCapture(event.pointerId);
    }
    if (this.dragging) {
      this.element.scrollLeft = this.startScroll - distance;
      this.measureSpeed(event.timeStamp);
    }
  }

  /** Measures how fast the element is scrolled, smoothed over the last moves. */
  private measureSpeed(time: number): void {
    const elapsed = time - this.lastTime;
    if (elapsed <= 0) return;
    const current = (this.element.scrollLeft - this.lastScroll) / elapsed;
    this.speed = 0.8 * current + 0.2 * this.speed;
    this.lastTime = time;
    this.lastScroll = this.element.scrollLeft;
  }

  /** Ends the drag. The flag stays set until the click that follows the release was blocked. */
  protected end(event: PointerEvent): void {
    const wasPressed = this.pressed;
    this.pressed = false;
    if (wasPressed && this.dragging && event.timeStamp - this.lastTime < 100) {
      this.roll();
    }
    if (this.element.hasPointerCapture(event.pointerId)) {
      this.element.releasePointerCapture(event.pointerId);
    }
    setTimeout(() => (this.dragging = false));
  }

  /** Keeps scrolling with the speed of the release and slows down until it stops. */
  private roll(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let previous = performance.now();
    const step = (now: number): void => {
      const elapsed = now - previous;
      previous = now;
      const before = this.element.scrollLeft;
      this.element.scrollLeft += this.speed * elapsed;
      this.speed *= Math.pow(FRICTION, elapsed / 16);
      const stuckAtEdge = this.element.scrollLeft === before;
      if (Math.abs(this.speed) > MIN_SPEED && !stuckAtEdge) {
        this.frame = requestAnimationFrame(step);
      }
    };
    this.frame = requestAnimationFrame(step);
  }

  /** Stops the click that follows a drag, so a dragged card is not opened. */
  protected blockClickAfterDrag(event: MouseEvent): void {
    if (this.dragging) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
