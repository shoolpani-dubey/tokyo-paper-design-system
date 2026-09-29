import type { Ref, RefCallback } from "react";

/** Joins class names, skipping falsy values. */
export function cx(...names: Array<string | false | null | undefined>): string {
  return names.filter(Boolean).join(" ");
}

/** Combines an internal ref with the ref a caller passed in. */
export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>): RefCallback<T> {
  return (node) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    }
  };
}

/** Turns a React useId() value into something safe for ids and CSS dashed idents. */
export function safeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_-]/g, "");
}

/** Joins aria-describedby ids, skipping empty ones. */
export function describedBy(...ids: Array<string | false | null | undefined>): string | undefined {
  return ids.filter(Boolean).join(" ") || undefined;
}

/** Whether a popover is open. Guarded for environments without :popover-open. */
export function isPopoverOpen(element: HTMLElement | null): boolean {
  if (!element) return false;
  try {
    return element.matches(":popover-open");
  } catch {
    return false;
  }
}
