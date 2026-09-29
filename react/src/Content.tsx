import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import { cx } from "./utils";

type HeadingLevel = 2 | 3 | 4 | 5 | 6;

/** Small uppercase mono label above a heading or value. */
export function Eyebrow({ className, ...rest }: ComponentPropsWithRef<"p">) {
  return <p {...rest} className={cx("tp-eyebrow", className)} />;
}

export interface CardProps extends Omit<ComponentPropsWithRef<"article">, "title"> {
  title: ReactNode;
  eyebrow?: ReactNode;
  /** Makes the whole card clickable. Only the title is the link, so its name stays short. */
  href?: string;
  /** Render the title link with a router link (e.g. Next.js Link). */
  linkComponent?: ElementType;
  /** Actions or pills at the bottom. Don't put buttons in a clickable card. */
  footer?: ReactNode;
  headingLevel?: HeadingLevel;
}

export function Card({ title, eyebrow, href, linkComponent: Link = "a", footer, headingLevel = 3, className, children, ...rest }: CardProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <article {...rest} className={cx("tp-card", className)}>
      {eyebrow && <p className="tp-eyebrow">{eyebrow}</p>}
      <Heading className="tp-card__title">
        {href ? (
          <Link className="tp-card__link" href={href}>
            {title}
          </Link>
        ) : (
          title
        )}
      </Heading>
      {children && <div className="tp-card__body">{children}</div>}
      {footer && <div className="tp-card__footer">{footer}</div>}
    </article>
  );
}

export type PillTone = "accent" | "info" | "success" | "warning" | "danger";

export interface PillProps extends ComponentPropsWithRef<"span"> {
  /** Colors the dot. The text must still say the status. */
  tone?: PillTone;
  /** Show the status dot. Defaults to true when a tone is set. */
  dot?: boolean;
}

export function Pill({ tone, dot = tone !== undefined, className, children, ...rest }: PillProps) {
  return (
    <span {...rest} className={cx("tp-pill", tone && tone !== "accent" && `tp-pill--${tone}`, className)}>
      {dot && <span className="tp-pill__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}

/** A group of Stat cells separated by 1px rules. Renders a <dl>. */
export function Stats({ className, ...rest }: ComponentPropsWithRef<"dl">) {
  return <dl {...rest} className={cx("tp-stats", className)} />;
}

export interface StatProps extends ComponentPropsWithRef<"div"> {
  label: ReactNode;
  value: ReactNode;
  unit?: ReactNode;
  note?: ReactNode;
  /** Puts the value in amber. At most one per group. */
  highlight?: boolean;
}

export function Stat({ label, value, unit, note, highlight, className, ...rest }: StatProps) {
  return (
    <div {...rest} className={cx("tp-stat", highlight && "tp-stat--highlight", className)}>
      <dt className="tp-stat__key">{label}</dt>
      <dd className="tp-stat__value">
        {value}
        {unit && <span className="tp-stat__unit">{unit}</span>}
      </dd>
      {note && <dd className="tp-stat__note">{note}</dd>}
    </div>
  );
}

export interface EmptyStateProps extends Omit<ComponentPropsWithRef<"div">, "title"> {
  title: ReactNode;
  /** A decorative icon (rendered with aria-hidden styling by the caller). */
  icon?: ReactNode;
  /** One primary action, plus at most one secondary. */
  actions?: ReactNode;
  /** Smaller padding, for panels and "no results". */
  compact?: boolean;
  headingLevel?: HeadingLevel;
}

export function EmptyState({ title, icon, actions, compact, headingLevel = 2, className, children, ...rest }: EmptyStateProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <div {...rest} className={cx("tp-empty", compact && "tp-empty--compact", className)}>
      {icon && (
        <span className="tp-empty__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <Heading className="tp-empty__title">{title}</Heading>
      {children && <div className="tp-empty__body">{children}</div>}
      {actions && <div className="tp-empty__actions">{actions}</div>}
    </div>
  );
}
