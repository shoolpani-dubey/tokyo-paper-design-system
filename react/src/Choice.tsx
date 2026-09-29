import { useEffect, useId, useRef } from "react";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { cx, describedBy, mergeRefs, safeId } from "./utils";

interface ChoiceOwnProps {
  label: ReactNode;
  /** Optional description under the label. */
  hint?: ReactNode;
  /** Class for the wrapping .tp-choice row. className goes on the input. */
  wrapperClassName?: string;
}

type InputProps = Omit<ComponentPropsWithRef<"input">, "type" | "children">;

function Choice({
  type,
  control,
  role,
  label,
  hint,
  wrapperClassName,
  id,
  className,
  labelExtra,
  ...rest
}: InputProps &
  ChoiceOwnProps & { type: "checkbox" | "radio"; control: string; labelExtra?: ReactNode }) {
  const auto = safeId(useId());
  const inputId = id ?? `tp-choice-${auto}`;
  const hintId = `${inputId}-hint`;
  return (
    <div className={cx("tp-choice", wrapperClassName)}>
      <input
        {...rest}
        type={type}
        role={role}
        id={inputId}
        className={cx(control, className)}
        aria-describedby={describedBy(hint ? hintId : false, rest["aria-describedby"])}
      />
      <label className="tp-choice__label" htmlFor={inputId}>
        {label}
        {labelExtra}
      </label>
      {hint && (
        <p className="tp-choice__hint" id={hintId}>
          {hint}
        </p>
      )}
    </div>
  );
}

export interface CheckboxProps extends InputProps, ChoiceOwnProps {
  /** Shows a dash: some, but not all, of a group is selected. */
  indeterminate?: boolean;
}

export function Checkbox({ indeterminate = false, ref, ...rest }: CheckboxProps) {
  const inner = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inner.current) inner.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return <Choice {...rest} ref={mergeRefs(inner, ref)} type="checkbox" control="tp-checkbox" />;
}

export interface RadioProps extends InputProps, ChoiceOwnProps {}

/** Use several with the same name inside a Fieldset. */
export function Radio(props: RadioProps) {
  return <Choice {...props} type="radio" control="tp-radio" />;
}

export interface SwitchProps extends InputProps, ChoiceOwnProps {}

/** For settings that apply immediately. Shows "On"/"Off" next to the label. */
export function Switch(props: SwitchProps) {
  return (
    <Choice
      {...props}
      type="checkbox"
      role="switch"
      control="tp-switch"
      labelExtra={
        <>
          {" "}
          <span className="tp-switch__state" aria-hidden="true" />
        </>
      }
    />
  );
}
