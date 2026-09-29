import { useId } from "react";
import type { ComponentPropsWithRef, CSSProperties, ReactNode } from "react";
import { cx, safeId } from "./utils";

export interface TableProps extends ComponentPropsWithRef<"table"> {
  /** Required: names the table and its scroll region. */
  caption: ReactNode;
  /** Tighter rows. */
  compact?: boolean;
  /** Limit the height to make the header row sticky, e.g. "20rem". */
  maxHeight?: CSSProperties["maxHeight"];
  wrapperClassName?: string;
}

/**
 * A table inside a focusable, labelled scroll region, so wide tables scroll
 * sideways on small screens and keyboard users can scroll them too.
 * Write <thead> and <tbody> yourself; use numeric for number columns.
 */
export function Table({ caption, compact, maxHeight, wrapperClassName, className, children, ...rest }: TableProps) {
  const captionId = `tp-table-${safeId(useId())}-caption`;
  return (
    <div
      className={cx("tp-table-wrap", wrapperClassName)}
      role="region"
      aria-labelledby={captionId}
      tabIndex={0}
      data-density={compact ? "compact" : undefined}
      style={maxHeight ? { maxHeight } : undefined}
    >
      <table {...rest} className={cx("tp-table", className)}>
        <caption id={captionId}>{caption}</caption>
        {children}
      </table>
    </div>
  );
}

export type SortDirection = "ascending" | "descending";

/** The next direction when a sort header is clicked. */
export function nextSort(current: SortDirection | undefined): SortDirection {
  return current === "ascending" ? "descending" : "ascending";
}

export interface SortHeaderProps extends ComponentPropsWithRef<"th"> {
  /** Set on the one sorted column; leave undefined on the others. */
  sort?: SortDirection;
  onSort: () => void;
  /** Right-align for number columns. */
  numeric?: boolean;
}

/** A sortable column header. Sorting the rows is up to you (see nextSort). */
export function SortHeader({ sort, onSort, numeric, className, children, ...rest }: SortHeaderProps) {
  return (
    <th {...rest} scope="col" aria-sort={sort} className={cx(numeric && "tp-table__num", className)}>
      <button className="tp-table__sort" type="button" onClick={onSort}>
        {children}
      </button>
    </th>
  );
}
