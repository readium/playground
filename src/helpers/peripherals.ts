// Peripherals based on XBReader

import debounce from "debounce";
import { isInteractiveElement } from "./isInteractiveElement";

export interface PCallbacks {
  moveTo: (direction: "left" | "right") => void;
  goProgression: (shiftKey?: boolean) => void;
  resize: () => void;
}

export default class Peripherals {
  private readonly observers = ["keyup", "keydown", "resize", "orientationchange"];
  private targets: EventTarget[] = [];
  private readonly callbacks: PCallbacks;

  constructor(callbacks: PCallbacks) {
    this.observers.forEach((method) => {
      (this as any)["on" + method] = (this as any)["on" + method].bind(this);
    });
    this.callbacks = callbacks;
  }

  destroy() {
    this.targets.forEach((t) => this.unobserve(t));
  }

  unobserve(item: EventTarget) {
    if (!item) return;
    this.observers.forEach((EventName) => {
      item.removeEventListener(
        EventName,
        (this as any)["on" + EventName],
        false
      );
    });
    this.targets = this.targets.filter((t) => t !== item);
  }

  observe(item: EventTarget) {
    if (!item) return;
    if (this.targets.includes(item)) return;
    this.observers.forEach((EventName) => {
      if (EventName === "resize") {
        item.addEventListener(EventName, debounce((this as any)["on" + EventName], 250, { immediate: true }), false);
      } else {
        item.addEventListener(EventName, (this as any)["on" + EventName], false);
      }
    });
    this.targets.push(item);
  }

  onkeyup(e: KeyboardEvent) {
    if (e.code === "Space" && !isInteractiveElement(document.activeElement)) this.callbacks.goProgression(e.shiftKey);
  }

  onkeydown(e: KeyboardEvent) {
    if (e.code === "ArrowRight") this.callbacks.moveTo("right");
    else if (e.code === "ArrowLeft") this.callbacks.moveTo("left");
  }

  onresize() {
    this.callbacks.resize();
  }

  onorientationchange() {
    this.callbacks.resize();
  }
}