import { useId } from "react";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { DangerIcon } from "./icons";
import { cx, describedBy, safeId } from "./utils";

interface FieldOwnProps {
  /** Always visible, above the control. */
  label: ReactNode;
  /** Format help, shown before any error, e.g. "DD/MM/YYYY". */
  hint?: ReactNode;
  /** Set after validation (on blur or submit). Say how to fix it. */
  error?: ReactNode;
  /** Adds "(optional)" to the label. */
  optional?: boolean;
  /** Class for the wrapping .tp-field. className goes on the control itself. */
  wrapperClassName?: string;
}

function useFieldIds(id?: string) {
  const auto = safeId(useId());
  const base = id ?? `tp-field-${auto}`;
  return { control: base, hint: `${base}-hint`, error: `${base}-error` };
}

function FieldShell({
  ids,
  label,
  hint,
  error,
  optional,
  wrapperClassName,
  children,
}: FieldOwnProps & { ids: ReturnType<typeof useFieldIds>; children: ReactNode }) {
  return (
    <div className={cx("tp-field", wrapperClassName)}>
      <label className="tp-field__label" htmlFor={ids.control}>
        {label}
        {optional && (
          <>
            {" "}
            <span className="tp-field__optional">(optional)</span>
          </>
        )}
      </label>
      {hint && (
        <p className="tp-field__hint" id={ids.hint}>
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p className="tp-field__error" id={ids.error}>
          <DangerIcon />
          {error}
        </p>
      )}
    </div>
  );
}

function controlProps(ids: ReturnType<typeof useFieldIds>, hint: ReactNode, error: ReactNode, ariaDescribedBy?: string) {
  return {
    id: ids.control,
    "aria-describedby": describedBy(hint ? ids.hint : false, error ? ids.error : false, ariaDescribedBy),
    "aria-invalid": error ? (true as const) : undefined,
  };
}

export interface TextFieldProps extends Omit<ComponentPropsWithRef<"input">, "children">, FieldOwnProps {}

export function TextField({ label, hint, error, optional, wrapperClassName, id, className, ...rest }: TextFieldProps) {
  const ids = useFieldIds(id);
  return (
    <FieldShell {...{ ids, label, hint, error, optional, wrapperClassName }}>
      <input type="text" {...rest} {...controlProps(ids, hint, error, rest["aria-describedby"])} className={cx("tp-input", className)} />
    </FieldShell>
  );
}

export interface TextAreaProps extends Omit<ComponentPropsWithRef<"textarea">, "children">, FieldOwnProps {}

export function TextArea({ label, hint, error, optional, wrapperClassName, id, className, rows = 4, ...rest }: TextAreaProps) {
  const ids = useFieldIds(id);
  return (
    <FieldShell {...{ ids, label, hint, error, optional, wrapperClassName }}>
      <textarea rows={rows} {...rest} {...controlProps(ids, hint, error, rest["aria-describedby"])} className={cx("tp-input", className)} />
    </FieldShell>
  );
}

export interface SelectProps extends ComponentPropsWithRef<"select">, FieldOwnProps {}

export function Select({ label, hint, error, optional, wrapperClassName, id, className, children, ...rest }: SelectProps) {
  const ids = useFieldIds(id);
  return (
    <FieldShell {...{ ids, label, hint, error, optional, wrapperClassName }}>
      <select {...rest} {...controlProps(ids, hint, error, rest["aria-describedby"])} className={cx("tp-select", className)}>
        {children}
      </select>
    </FieldShell>
  );
}

export interface FieldsetProps extends ComponentPropsWithRef<"fieldset"> {
  legend: ReactNode;
}

/** Groups related controls, e.g. a set of checkboxes or radios. */
export function Fieldset({ legend, className, children, ...rest }: FieldsetProps) {
  return (
    <fieldset {...rest} className={cx("tp-fieldset", className)}>
      <legend className="tp-field__label">{legend}</legend>
      {children}
    </fieldset>
  );
}

/** Stacks fields with the standard gap. Renders a <form>. */
export function Form({ className, ...rest }: ComponentPropsWithRef<"form">) {
  return <form {...rest} className={cx("tp-form", className)} />;
}
