// Line icons used inside components: 1.5px stroke, square caps, 20px grid.
// Always decorative (aria-hidden); the surrounding text or label names the action.

import type { SVGProps } from "react";

function Icon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
      {...props}
    />
  );
}

export const InfoIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}><circle cx="10" cy="10" r="7.5" /><path d="M10 9v5M10 6v.5" /></Icon>
);

export const SuccessIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}><circle cx="10" cy="10" r="7.5" /><path d="m6.5 10 2.5 2.5 4.5-5" /></Icon>
);

export const WarningIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}><path d="M10 2.5 18 17H2z" /><path d="M10 8v4M10 14.5v.5" /></Icon>
);

export const DangerIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}><circle cx="10" cy="10" r="7.5" /><path d="M10 6v5M10 13.5v.5" /></Icon>
);

export const CloseIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}><path d="m5.5 5.5 9 9M14.5 5.5l-9 9" /></Icon>
);

export type Tone = "info" | "success" | "warning" | "danger";

export const toneIcons: Record<Tone, (props: SVGProps<SVGSVGElement>) => React.JSX.Element> = {
  info: InfoIcon,
  success: SuccessIcon,
  warning: WarningIcon,
  danger: DangerIcon,
};
