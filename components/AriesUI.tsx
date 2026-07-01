"use client";

import {
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type InputHTMLAttributes,
} from "react";

/** Button that merges a `hover` style patch over `base` while hovered (skipped when disabled). */
export function HoverButton({
  base,
  hover,
  style,
  onMouseEnter,
  onMouseLeave,
  disabled,
  ...rest
}: { base: CSSProperties; hover?: CSSProperties } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const [h, setH] = useState(false);
  return (
    <button
      {...rest}
      disabled={disabled}
      onMouseEnter={(e) => {
        setH(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setH(false);
        onMouseLeave?.(e);
      }}
      style={{ ...base, ...(h && hover && !disabled ? hover : null), ...style }}
    />
  );
}

/** Anchor variant of HoverButton. */
export function HoverLink({
  base,
  hover,
  style,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: { base: CSSProperties; hover?: CSSProperties } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const [h, setH] = useState(false);
  return (
    <a
      {...rest}
      onMouseEnter={(e) => {
        setH(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setH(false);
        onMouseLeave?.(e);
      }}
      style={{ ...base, ...(h && hover ? hover : null), ...style }}
    />
  );
}

/**
 * Input that switches its border colour on focus (magenta by default).
 * Applies the full `border` shorthand on focus so it never mixes shorthand +
 * longhand for the same property (which React warns about). All app inputs use a
 * 1.5px solid border, matching the design.
 */
export function FocusInput({
  base,
  focusBorder = "#BF1B76",
  style,
  onFocus,
  onBlur,
  ...rest
}: { base: CSSProperties; focusBorder?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const [f, setF] = useState(false);
  return (
    <input
      {...rest}
      onFocus={(e) => {
        setF(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setF(false);
        onBlur?.(e);
      }}
      style={{ ...base, ...(f ? { border: `1.5px solid ${focusBorder}` } : null), ...style }}
    />
  );
}
