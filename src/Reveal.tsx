import type { CSSProperties, ReactNode } from "react";
import { useInView } from "./hooks/useInView";

export function Reveal({
  children,
  className = "",
  delayMs = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  as?: "div" | "li";
}) {
  const { ref, inView } = useInView<HTMLElement>();

  const style = { "--reveal-delay": `${delayMs}ms` } as CSSProperties;

  return (
    <Tag ref={ref as never} className={`reveal-motion ${inView ? "reveal-motion--in" : "reveal-motion--out"} ${className}`} style={style}>
      {children}
    </Tag>
  );
}
