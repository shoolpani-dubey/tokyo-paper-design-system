import { useId, useRef } from "react";
import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import { cx, isPopoverOpen, safeId } from "./utils";

export interface NavLink {
  label: ReactNode;
  href: string;
  /** Marks the current page (aria-current="page" and an accent bar). */
  current?: boolean;
}

export interface NavProps extends ComponentPropsWithRef<"header"> {
  brand: ReactNode;
  brandHref?: string;
  /** Up to about six primary sections. */
  links: NavLink[];
  /** Icon buttons on the right, e.g. search or theme. */
  actions?: ReactNode;
  /** Accessible name of the <nav>. */
  label?: string;
  /** Text of the button that opens the links below 900px. */
  menuLabel?: string;
  /** Render links with a router link (e.g. Next.js Link). */
  linkComponent?: ElementType;
}

/**
 * Sticky top bar. From 900px the links show inline; below that they move
 * into a sheet opened by the "Menu" button (a popover: no script needed).
 */
export function Nav({
  brand,
  brandHref = "/",
  links,
  actions,
  label = "Main",
  menuLabel = "Menu",
  linkComponent: Link = "a",
  className,
  ...rest
}: NavProps) {
  const id = `tp-nav-${safeId(useId())}`;
  const sheet = useRef<HTMLElement>(null);
  // Client-side navigation doesn't reload the page, so close the sheet ourselves.
  const closeSheet = () => {
    if (isPopoverOpen(sheet.current)) sheet.current?.hidePopover();
  };

  return (
    <header {...rest} className={cx("tp-nav", className)}>
      <div className="tp-nav__inner">
        <Link className="tp-nav__brand" href={brandHref}>
          <span className="tp-nav__mark" aria-hidden="true" />
          {brand}
        </Link>
        <nav ref={sheet} className="tp-nav__menu" id={id} popover="auto" aria-label={label}>
          <ul className="tp-nav__list">
            {links.map((link) => (
              <li key={link.href}>
                <Link className="tp-nav__link" href={link.href} aria-current={link.current ? "page" : undefined} onClick={closeSheet}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {actions && <div className="tp-nav__actions">{actions}</div>}
        <button className="tp-button tp-button--quiet tp-nav__toggle" type="button" popoverTarget={id}>
          {menuLabel}
        </button>
      </div>
    </header>
  );
}

export interface SkipLinkProps extends ComponentPropsWithRef<"a"> {
  /** The id of the main content, with #. Give that element tabIndex={-1}. */
  href?: string;
}

/** Hidden until focused. Make it the first focusable element on the page. */
export function SkipLink({ href = "#main", children = "Skip to content", className, ...rest }: SkipLinkProps) {
  return (
    <a {...rest} href={href} className={cx("tp-button tp-button--primary tp-skip-link", className)}>
      {children}
    </a>
  );
}
