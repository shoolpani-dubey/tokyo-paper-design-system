import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import { cx } from "./utils";

export type ButtonVariant = "ghost" | "primary" | "quiet";

interface ButtonLookProps {
  /** ghost (default): strong line; primary: amber fill, one per view; quiet: text only. */
  variant?: ButtonVariant;
  /** Square, icon-only button. Give it an aria-label. */
  iconOnly?: boolean;
  /** Adds a trailing → that nudges on hover. */
  trailingArrow?: boolean;
}

function buttonClass({ variant = "ghost", iconOnly }: ButtonLookProps, className?: string) {
  return cx("tp-button", variant !== "ghost" && `tp-button--${variant}`, iconOnly && "tp-button--icon", className);
}

const Arrow = () => (
  <span className="tp-button__arrow" aria-hidden="true">
    →
  </span>
);

export interface ButtonProps extends ComponentPropsWithRef<"button">, ButtonLookProps {
  /** Shows a spinner and ignores clicks, but stays focusable. Pair with a label like "Saving…". */
  busy?: boolean;
  /** Label to show while busy. Defaults to the normal label. */
  busyLabel?: ReactNode;
}

export function Button({
  variant,
  iconOnly,
  trailingArrow,
  busy = false,
  busyLabel,
  type = "button",
  className,
  children,
  onClick,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      className={buttonClass({ variant, iconOnly }, className)}
      aria-disabled={busy || rest["aria-disabled"] || undefined}
      data-state={busy ? "busy" : undefined}
      onClick={(event) => {
        if (busy) {
          event.preventDefault(); // also stops a submit button from submitting again
          return;
        }
        onClick?.(event);
      }}
    >
      {busy && <span className="tp-button__spinner" aria-hidden="true" />}
      {busy && busyLabel !== undefined ? busyLabel : children}
      {trailingArrow && !busy && <Arrow />}
    </button>
  );
}

export interface ButtonLinkProps extends ComponentPropsWithRef<"a">, ButtonLookProps {
  /** Render with a router link (e.g. Next.js Link) instead of <a>. */
  linkComponent?: ElementType;
}

/** A link that looks like a button. Use it for navigation; use Button for actions. */
export function ButtonLink({ variant, iconOnly, trailingArrow, linkComponent: Link = "a", className, children, ...rest }: ButtonLinkProps) {
  return (
    <Link {...rest} className={buttonClass({ variant, iconOnly }, className)}>
      {children}
      {trailingArrow && <Arrow />}
    </Link>
  );
}
