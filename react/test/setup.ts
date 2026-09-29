import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(cleanup);

// jsdom lacks <dialog> modality and the popover API. These stand-ins model
// the parts the components rely on: open state, events and popovertarget clicks.

const dialog = HTMLDialogElement.prototype;
if (!dialog.showModal) {
  dialog.showModal = function (this: HTMLDialogElement) {
    this.setAttribute("open", "");
  };
  dialog.close = function (this: HTMLDialogElement) {
    if (!this.hasAttribute("open")) return;
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
}

// jsdom's own stylesheet hides every [popover]; show the ones we open.
const style = document.createElement("style");
style.textContent = "[popover][data-test-popover-open] { display: block !important; }";
document.head.append(style);

const open = new WeakSet<HTMLElement>();
const toggle = (el: HTMLElement, newState: "open" | "closed") => {
  if (newState === "open") open.add(el);
  else open.delete(el);
  el.toggleAttribute("data-test-popover-open", newState === "open");
  el.dispatchEvent(Object.assign(new Event("toggle"), { newState, oldState: newState === "open" ? "closed" : "open" }));
};

HTMLElement.prototype.showPopover = function (this: HTMLElement) {
  if (!open.has(this)) toggle(this, "open");
};
HTMLElement.prototype.hidePopover = function (this: HTMLElement) {
  if (open.has(this)) toggle(this, "closed");
};
HTMLElement.prototype.togglePopover = function (this: HTMLElement) {
  if (open.has(this)) this.hidePopover();
  else this.showPopover();
  return open.has(this);
};

// :popover-open is not a selector jsdom knows.
const matches = Element.prototype.matches;
Element.prototype.matches = function (this: Element, selector: string) {
  if (selector === ":popover-open") return open.has(this as HTMLElement);
  return matches.call(this, selector);
} as typeof matches;

document.addEventListener("click", (event) => {
  const invoker = (event.target as Element).closest?.("[popovertarget]");
  const target = invoker && document.getElementById(invoker.getAttribute("popovertarget")!);
  target?.togglePopover();
});
