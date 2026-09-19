import type { Components } from "hast-util-to-jsx-runtime";
import { CodeBlock } from "@/components/Article/CodeBlock";
import { MDXImage } from "@/components/Article/MDXImage";
import { MDXLink } from "@/components/Article/MDXLink";

/**
 * Element overrides for rendered post content, passed to rehype-react in
 * lib/markdown.ts. Everything else (h2-h4, blockquote, lists, tables,
 * inline code) is styled purely through app/prose.css and needs no
 * component override.
 */
export const markdownComponents: Partial<Components> = {
  pre: CodeBlock,
  img: MDXImage,
  a: MDXLink,
};
