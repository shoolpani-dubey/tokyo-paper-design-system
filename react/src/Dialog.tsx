import { useEffect, useId, useRef } from "react";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { Button } from "./Button";
import { CloseIcon } from "./icons";
import { cx, mergeRefs, safeId } from "./utils";

export interface DialogProps extends Omit<ComponentPropsWithRef<"dialog">, "title" | "open" | "onClose"> {
  open: boolean;
  /** Called on Esc, the close button, or when the dialog closes any other way. */
  onClose: () => void;
  title: ReactNode;
  /**
   * Buttons. Put the primary action last. To choose what gets focus on open,
   * mark it with data-autofocus (React's autoFocus runs before the dialog opens,
   * so the browser would override it). Without it, focus goes to the first
   * focusable element: the close button, or for alert dialogs the first footer button.
   */
  footer?: ReactNode;
  /** A destructive confirmation: role="alertdialog" and no close button. */
  alert?: boolean;
  closeLabel?: string;
}

/**
 * A modal dialog built on native <dialog> and showModal(): the browser traps
 * focus, closes on Esc, makes the page inert and returns focus on close.
 * Becomes a bottom sheet on phones.
 */
export function Dialog({ open, onClose, title, footer, alert, closeLabel = "Close", className, children, ref, ...rest }: DialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = `tp-dialog-${safeId(useId())}-title`;
  const openRef = useRef(open);
  openRef.current = open;

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (open && !node.open) {
      node.showModal();
      node.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    }
    else if (!open && node.open) node.close();
  }, [open]);

  return (
    <dialog
      {...rest}
      ref={mergeRefs(dialog, ref)}
      className={cx("tp-dialog", className)}
      role={alert ? "alertdialog" : rest.role}
      aria-labelledby={titleId}
      onClose={() => {
        if (openRef.current) onClose(); // skip when the close came from open={false}
      }}
    >
      <header className="tp-dialog__header">
        <h2 className="tp-dialog__title" id={titleId}>
          {title}
        </h2>
        {!alert && (
          <Button variant="quiet" iconOnly className="tp-dialog__close" aria-label={closeLabel} onClick={onClose}>
            <CloseIcon />
          </Button>
        )}
      </header>
      <div className="tp-dialog__body">{children}</div>
      {footer && <div className="tp-dialog__footer">{footer}</div>}
    </dialog>
  );
}
