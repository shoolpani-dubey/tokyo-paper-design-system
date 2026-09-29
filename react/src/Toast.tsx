import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Button } from "./Button";
import { CloseIcon, toneIcons, type Tone } from "./icons";

export interface ToastOptions {
  message: ReactNode;
  /** success (default), info, warning or danger. Danger toasts never auto-dismiss. */
  tone?: Tone;
  /** e.g. { label: "Undo", onClick: restore } */
  action?: { label: string; onClick: () => void };
  /** Milliseconds before auto-dismiss. Never less than 6000. */
  duration?: number;
}

const MIN_DURATION = 6000;
const ToastContext = createContext<((toast: ToastOptions) => void) | null>(null);

/**
 * Renders the live region toasts are announced in, and shows one toast at a
 * time (the rest queue). Put it once near the root of the app.
 */
export function ToastProvider({ children, dismissLabel = "Dismiss" }: { children: ReactNode; dismissLabel?: string }) {
  const [queue, setQueue] = useState<Array<ToastOptions & { id: number }>>([]);
  const nextId = useRef(0);

  const show = useCallback((toast: ToastOptions) => {
    setQueue((q) => [...q, { ...toast, id: nextId.current++ }]);
  }, []);
  const dismiss = useCallback(() => setQueue((q) => q.slice(1)), []);
  const current = queue[0];

  return (
    <ToastContext value={show}>
      {children}
      <div className="tp-toast-region" role="status" aria-live="polite">
        {current && <ToastItem key={current.id} {...current} dismissLabel={dismissLabel} onDismiss={dismiss} />}
      </div>
    </ToastContext>
  );
}

/** Returns a function that shows a toast. Must be used inside <ToastProvider>. */
export function useToast() {
  const show = useContext(ToastContext);
  if (!show) throw new Error("useToast must be used inside <ToastProvider>.");
  return show;
}

function ToastItem({
  message,
  tone = "success",
  action,
  duration,
  dismissLabel,
  onDismiss,
}: ToastOptions & { dismissLabel: string; onDismiss: () => void }) {
  const Icon = toneIcons[tone];
  // The timer only runs while nothing (pointer or focus) is holding the toast open.
  const remaining = useRef(tone === "danger" ? Infinity : Math.max(MIN_DURATION, duration ?? MIN_DURATION));
  const started = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const holds = useRef(new Set<string>());

  const start = useCallback(() => {
    if (!Number.isFinite(remaining.current)) return;
    started.current = Date.now();
    timer.current = setTimeout(onDismiss, remaining.current);
  }, [onDismiss]);

  const hold = (reason: string) => {
    if (holds.current.size === 0) {
      clearTimeout(timer.current);
      remaining.current -= Date.now() - started.current;
    }
    holds.current.add(reason);
  };

  const release = (reason: string) => {
    holds.current.delete(reason);
    if (holds.current.size === 0) start();
  };

  useEffect(() => {
    start();
    return () => clearTimeout(timer.current);
  }, [start]);

  return (
    <div
      className={`tp-toast${tone === "success" ? "" : ` tp-toast--${tone}`}`}
      onPointerEnter={() => hold("pointer")}
      onPointerLeave={() => release("pointer")}
      onFocus={() => hold("focus")}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) release("focus");
      }}
    >
      <Icon className="tp-toast__icon" />
      <p className="tp-toast__message">{message}</p>
      {action && (
        <Button
          variant="quiet"
          onClick={() => {
            action.onClick();
            onDismiss();
          }}
        >
          {action.label}
        </Button>
      )}
      <Button variant="quiet" iconOnly aria-label={dismissLabel} onClick={onDismiss}>
        <CloseIcon />
      </Button>
    </div>
  );
}
