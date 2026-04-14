import type { CSSProperties, ReactNode } from "react";
import { useInView } from "./hooks/useInView";

export function Reveal({ children, className = "", delayMs = 0 }: { children: ReactNode; className?: string; delayMs?: number }) {
  const { ref, inView } = useInView<HTMLDivElement>();

  const style = { "--reveal-delay": `${delayMs}ms` } as CSSProperties;

  return (
    <div ref={ref} className={`reveal-motion ${inView ? "reveal-motion--in" : "reveal-motion--out"} ${className}`} style={style}>
      {children}
    </div>
  );
}
