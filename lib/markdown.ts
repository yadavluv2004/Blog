import type { ReactElement } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeShiki from "@shikijs/rehype";
import rehypeReact from "rehype-react";
import { markdownComponents } from "@/markdown-components";

/**
 * Plain-Markdown rendering pipeline — deliberately NOT MDX.
 *
 * Post bodies are free-text typed into a textarea in /admin, not authored
 * in a code editor with JSX awareness. MDX's parser treats `<...>` as the
 * start of a JSX tag anywhere outside a fence and throws a hard compile
 * error for anything that doesn't form valid JSX — so something as
 * ordinary as writing "a value of type Promise<T[]>" in prose (not even
 * inside a code block) 500s the entire post page.
 *
 * remark/CommonMark is far more forgiving: `<...>` that doesn't match a
 * real HTML tag pattern is just literal text, per the CommonMark spec.
 * We don't use any MDX-only capability here (no embedded JSX components
 * in post content — mdx-components.tsx only maps standard elements like
 * `pre`/`img`/`a`), so this pipeline gets identical rendering — headings,
 * code highlighting, images, links, quotes, tables — with none of MDX's
 * fragility against ordinary prose.
 */
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings, {
    behavior: "wrap",
    properties: { className: ["heading-anchor"], "aria-hidden": "true", tabIndex: -1 },
  })
  .use(rehypeShiki, {
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  })
  .use(rehypeReact, {
    Fragment,
    jsx,
    jsxs,
    components: markdownComponents,
  });

/** Compiles a post's raw Markdown body into React elements. */
export async function renderMarkdown(content: string): Promise<ReactElement> {
  const file = await processor.process(content);
  return file.result;
}
