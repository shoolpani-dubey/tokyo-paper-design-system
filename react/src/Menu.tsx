import { cloneElement, createContext, useContext, useEffect, useId, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, ReactElement, ReactNode } from "react";
import { cx, safeId } from "./utils";

const MenuContext = createContext<{ close: () => void } | null>(null);

export interface MenuProps {
  /** Accessible name of the menu, usually the trigger's text. */
  label: string;
  /** The button that opens the menu, e.g. <Button>Options</Button>. */
  trigger: ReactElement<{ style?: CSSProperties }>;
  children: ReactNode;
  className?: string;
}

const itemSelector = ".tp-menu__item:not(:disabled, [aria-disabled='true'])";

/**
 * A menu built on the popover attribute: opens and closes without script,
 * closes on Esc or outside click. Anchored under its trigger where CSS anchor
 * positioning is supported. Adds the keyboard behavior: focus the first item
 * on open, arrows / Home / End / typeahead to move, Tab to close, and focus
 * back to the trigger on close.
 */
export function Menu({ label, trigger, children, className }: MenuProps) {
  const id = `tp-menu-${safeId(useId())}`;
  const anchor = `--${id}`;
  const menu = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const items = () => [...(menu.current?.querySelectorAll<HTMLElement>(itemSelector) ?? [])];
  const triggerElement = () => document.querySelector<HTMLElement>(`[popovertarget="${id}"]`);

  useEffect(() => {
    const node = menu.current;
    if (!node) return;
    const onToggle = (event: Event) => {
      const isOpen = (event as ToggleEvent).newState === "open";
      setOpen(isOpen);
      if (isOpen) items()[0]?.focus();
      else if (node.contains(document.activeElement) || document.activeElement === document.body) triggerElement()?.focus();
    };
    node.addEventListener("toggle", onToggle);
    return () => node.removeEventListener("toggle", onToggle);
  }, []);

  const close = () => menu.current?.hidePopover();

  const onKeyDown = (event: KeyboardEvent) => {
    const list = items();
    const index = list.indexOf(document.activeElement as HTMLElement);
    let next: HTMLElement | undefined;
    if (event.key === "ArrowDown") next = list[(index + 1) % list.length];
    else if (event.key === "ArrowUp") next = list[(index - 1 + list.length) % list.length];
    else if (event.key === "Home") next = list[0];
    else if (event.key === "End") next = list.at(-1);
    else if (event.key === "Tab") return close();
    else if (event.key.length === 1 && /\S/.test(event.key)) {
      const key = event.key.toLowerCase();
      const rotated = [...list.slice(index + 1), ...list.slice(0, index + 1)];
      next = rotated.find((item) => item.textContent?.trim().toLowerCase().startsWith(key));
    }
    if (next) {
      event.preventDefault();
      next.focus();
    }
  };

  return (
    <>
      {cloneElement(trigger, {
        popoverTarget: id,
        "aria-haspopup": "menu",
        "aria-expanded": open,
        style: { ...trigger.props.style, anchorName: anchor } as CSSProperties,
      } as object)}
      <div
        ref={menu}
        id={id}
        popover="auto"
        role="menu"
        aria-label={label}
        className={cx("tp-menu", className)}
        style={{ positionAnchor: anchor } as CSSProperties}
        onKeyDown={onKeyDown}
      >
        <MenuContext value={{ close }}>{children}</MenuContext>
      </div>
    </>
  );
}

interface ItemContentProps {
  children: ReactNode;
  /** A decorative icon before the label. */
  icon?: ReactNode;
  /** Shown as a keycap, e.g. "Ctrl D". Bind the shortcut yourself. */
  shortcut?: string;
  disabled?: boolean;
}

function useMenu() {
  const menu = useContext(MenuContext);
  if (!menu) throw new Error("Menu items must be used inside <Menu>.");
  return menu;
}

export interface MenuItemProps extends ItemContentProps {
  onSelect?: () => void;
  /** For destructive actions, e.g. "Delete…". */
  danger?: boolean;
}

export function MenuItem({ children, icon, shortcut, disabled, onSelect, danger }: MenuItemProps) {
  const { close } = useMenu();
  return (
    <button
      type="button"
      role="menuitem"
      tabIndex={-1}
      className={cx("tp-menu__item", danger && "tp-menu__item--danger")}
      aria-disabled={disabled || undefined}
      onClick={() => {
        if (disabled) return;
        onSelect?.();
        close();
      }}
    >
      {icon}
      {children}
      {shortcut && <kbd>{shortcut}</kbd>}
    </button>
  );
}

export interface MenuCheckboxItemProps extends ItemContentProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

/** A toggle inside a menu. The menu stays open so several can be changed. */
export function MenuCheckboxItem({ children, icon, shortcut, disabled, checked, onCheckedChange }: MenuCheckboxItemProps) {
  useMenu();
  return (
    <button
      type="button"
      role="menuitemcheckbox"
      tabIndex={-1}
      className="tp-menu__item"
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      onClick={() => !disabled && onCheckedChange(!checked)}
    >
      {icon}
      {children}
      {shortcut && <kbd>{shortcut}</kbd>}
    </button>
  );
}

export function MenuSeparator() {
  return <hr className="tp-menu__separator" />;
}

/** A small uppercase heading for a group of items. */
export function MenuLabel({ children }: { children: ReactNode }) {
  return <p className="tp-menu__label">{children}</p>;
}
