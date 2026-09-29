import { useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { cx, safeId } from "./utils";

export interface TabItem {
  value: string;
  label: ReactNode;
  content: ReactNode;
}

export interface TabsProps {
  /** Accessible name of the tab list. */
  label: string;
  items: TabItem[];
  /** Controlled selected value. */
  value?: string;
  /** Initial value when uncontrolled. Defaults to the first tab. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

/**
 * Tabs with the standard keyboard behavior: Arrow Left/Right and Home/End move
 * and select; only the selected tab is in the Tab order.
 */
export function Tabs({ label, items, value, defaultValue, onValueChange, className }: TabsProps) {
  const base = `tp-tabs-${safeId(useId())}`;
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.value);
  const selected = value ?? internal;
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  const select = (next: string) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const index = items.findIndex((item) => item.value === selected);
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    let next: number | undefined;
    if (event.key === (rtl ? "ArrowLeft" : "ArrowRight")) next = (index + 1) % items.length;
    else if (event.key === (rtl ? "ArrowRight" : "ArrowLeft")) next = (index - 1 + items.length) % items.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    tabs.current[next]?.focus();
    select(items[next]!.value);
  };

  const ids = (item: TabItem) => {
    const key = safeId(item.value);
    return { tab: `${base}-tab-${key}`, panel: `${base}-panel-${key}` };
  };

  return (
    <div className={cx("tp-tabs", className)}>
      <div className="tp-tabs__list" role="tablist" aria-label={label} onKeyDown={onKeyDown}>
        {items.map((item, i) => {
          const isSelected = item.value === selected;
          return (
            <button
              key={item.value}
              ref={(node) => {
                tabs.current[i] = node;
              }}
              type="button"
              role="tab"
              id={ids(item).tab}
              className="tp-tab"
              aria-selected={isSelected}
              aria-controls={ids(item).panel}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => select(item.value)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item) => (
        <div
          key={item.value}
          role="tabpanel"
          id={ids(item).panel}
          className="tp-tabs__panel"
          aria-labelledby={ids(item).tab}
          tabIndex={0}
          hidden={item.value !== selected}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
