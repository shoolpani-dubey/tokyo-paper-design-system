import type { ComponentPropsWithRef, ReactNode } from "react";
import { Button } from "./Button";
import { CloseIcon, toneIcons, type Tone } from "./icons";
import { cx } from "./utils";

export interface AlertProps extends Omit<ComponentPropsWithRef<"div">, "title"> {
  /** Each tone has its own icon, so color is never the only signal. */
  tone?: Tone;
  title: ReactNode;
  /** Buttons below the message. */
  actions?: ReactNode;
  /** Shows a dismiss button. */
  onDismiss?: () => void;
  dismissLabel?: string;
  /** Full-width variant for page- or app-wide status. */
  banner?: boolean;
}

/**
 * An inline message next to what it is about, or a banner.
 * Pass role="alert" only for urgent messages added after page load,
 * role="status" for non-urgent ones; static alerts need no role.
 */
export function Alert({ tone = "info", title, actions, onDismiss, dismissLabel = "Dismiss", banner, className, children, ...rest }: AlertProps) {
  const Icon = toneIcons[tone];
  return (
    <div {...rest} className={cx("tp-alert", tone !== "info" && `tp-alert--${tone}`, banner && "tp-alert--banner", className)}>
      <Icon className="tp-alert__icon" />
      <div className="tp-alert__content">
        <p className="tp-alert__title">{title}</p>
        {children && <div className="tp-alert__body">{children}</div>}
        {actions && <div className="tp-alert__actions">{actions}</div>}
      </div>
      {onDismiss && (
        <Button variant="quiet" iconOnly className="tp-alert__dismiss" aria-label={dismissLabel} onClick={onDismiss}>
          <CloseIcon />
        </Button>
      )}
    </div>
  );
}
