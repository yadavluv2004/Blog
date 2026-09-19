import type { ReactNode } from "react";
import styles from "./Section.module.css";
import { Container } from "@/components/Container";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  /** Adds the top hairline used between stacked homepage sections. */
  border?: boolean;
  narrow?: boolean;
}

export function Section({ children, className, id, border, narrow }: SectionProps) {
  return (
    <section id={id} className={cn(styles.section, border && styles.border, className)}>
      <Container narrow={narrow}>{children}</Container>
    </section>
  );
}
