import { renderMarkdown } from "@/lib/markdown";

interface ArticleProps {
  content: string;
}

/** Renders a post's raw Markdown body inside the .prose typography scope. */
export async function Article({ content }: ArticleProps) {
  const rendered = await renderMarkdown(content);
  return <div className="prose">{rendered}</div>;
}
