import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";

type MDXLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

/** Internal links use next/link for client-side navigation; external links open in a new tab safely. */
export function MDXLink({ href = "", children, ...rest }: MDXLinkProps) {
  const isExternal = /^https?:\/\//.test(href);

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
