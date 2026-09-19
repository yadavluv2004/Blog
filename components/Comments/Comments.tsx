"use client";

import Giscus from "@giscus/react";
import { useEffect, useState } from "react";
import { site } from "@/site.config";
import styles from "./Comments.module.css";

/**
 * GitHub Discussions-backed comments — no accounts to build or maintain,
 * auth is handled entirely by GitHub on click-through. Renders nothing at
 * all until every giscus.* value in site.config.ts is filled in (get them
 * from https://giscus.app after enabling Discussions on a public repo).
 */
export function Comments() {
  const { repo, repoId, category, categoryId } = site.giscus;
  const configured = Boolean(repo && repoId && category && categoryId);

  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (!configured) return;

    const read = () =>
      setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");
    read();

    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, [configured]);

  if (!configured) return null;

  return (
    <div className={styles.wrap}>
      <h2 className="text-h2">Comments</h2>
      <div className={styles.embed}>
        <Giscus
          repo={repo as `${string}/${string}`}
          repoId={repoId}
          category={category}
          categoryId={categoryId}
          mapping="pathname"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme={theme}
          lang="en"
          loading="lazy"
        />
      </div>
    </div>
  );
}
