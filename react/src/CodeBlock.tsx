import { useEffect, useRef, useState } from "react";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { cx } from "./utils";

export interface CodeBlockProps extends Omit<ComponentPropsWithRef<"figure">, "title"> {
  /** Plain code. Or pass already-highlighted children (tp-syntax-*, Prism or highlight.js classes). */
  code?: string;
  /** File name or language, shown in the header. */
  title?: string;
  /** Show a Copy button. Default true. */
  copyable?: boolean;
  /** Wrap long lines instead of scrolling sideways. */
  wrap?: boolean;
}

type CopyState = "idle" | "copied" | "failed";
const copyLabels: Record<CopyState, string> = { idle: "Copy", copied: "Copied ✓", failed: "Copy failed" };

export function CodeBlock({ code, title, copyable = true, wrap, className, children, ...rest }: CodeBlockProps) {
  const pre = useRef<HTMLPreElement>(null);
  const [state, setState] = useState<CopyState>("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timer = setTimeout(() => setState("idle"), 2000);
    return () => clearTimeout(timer);
  }, [state]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code ?? pre.current?.innerText ?? "");
      setState("copied");
    } catch {
      setState("failed");
    }
  };

  return (
    <figure {...rest} className={cx("tp-code", wrap && "tp-code--wrap", className)}>
      {(title || copyable) && (
        <figcaption className="tp-code__header">
          <span className="tp-code__title">{title}</span>
          {copyable && (
            <button className="tp-button tp-button--quiet tp-code__copy" type="button" onClick={copy}>
              {copyLabels[state]}
            </button>
          )}
        </figcaption>
      )}
      <pre ref={pre} className="tp-code__body" tabIndex={0} aria-label={title ? `${title} code` : "Code"}>
        <code>{(children as ReactNode) ?? code}</code>
      </pre>
    </figure>
  );
}
