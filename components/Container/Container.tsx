import type { ReactNode } from "react";
import styles from "./Container.module.css";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /** Narrower max-width for reading-focused layouts. */
  narrow?: boolean;
}

export function Container({ children, className, narrow }: ContainerProps) {
  return (
    <div className={cn(styles.container, narrow && styles.narrow, className)}>{children}</div>
  );
}
