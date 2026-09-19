"use client";

import { useActionState } from "react";
import type { PostFormState } from "@/lib/post-form";
import styles from "./PostForm.module.css";
import adminStyles from "./admin.module.css";

export interface PostFormValues {
  title: string;
  slug: string;
  description: string;
  date: string;
  category: string;
  tags: string;
  coverImage: string;
  readingTime: string;
  featured: boolean;
  draft: boolean;
  content: string;
}

interface PostFormProps {
  action: (prevState: PostFormState, formData: FormData) => Promise<PostFormState>;
  initialValues: PostFormValues;
  submitLabel: string;
}

const today = () => new Date().toISOString().slice(0, 10);

export function PostForm({ action, initialValues, submitLabel }: PostFormProps) {
  const [state, formAction, pending] = useActionState<PostFormState, FormData>(action, {});

  return (
    <form action={formAction} className={styles.form}>
      {state.error && <p className={adminStyles.error}>{state.error}</p>}

      <div className={styles.grid}>
        <label className={styles.field}>
          <span className={styles.label}>Title *</span>
          <input name="title" defaultValue={initialValues.title} required className={styles.input} />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Slug</span>
          <input
            name="slug"
            defaultValue={initialValues.slug}
            placeholder="auto-generated from title"
            className={styles.input}
          />
        </label>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>Description</span>
        <textarea
          name="description"
          defaultValue={initialValues.description}
          rows={2}
          className={styles.textarea}
        />
      </label>

      <div className={styles.grid}>
        <label className={styles.field}>
          <span className={styles.label}>Date *</span>
          <input
            name="date"
            type="date"
            defaultValue={initialValues.date || today()}
            required
            className={styles.input}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Category</span>
          <input name="category" defaultValue={initialValues.category} className={styles.input} />
        </label>
      </div>

      <div className={styles.grid}>
        <label className={styles.field}>
          <span className={styles.label}>Tags</span>
          <input
            name="tags"
            defaultValue={initialValues.tags}
            placeholder="comma, separated, tags"
            className={styles.input}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Reading time</span>
          <input
            name="readingTime"
            defaultValue={initialValues.readingTime}
            placeholder="auto-calculated"
            className={styles.input}
          />
        </label>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>Cover image URL</span>
        <input
          name="coverImage"
          defaultValue={initialValues.coverImage}
          placeholder="/images/… or https://…"
          className={styles.input}
        />
      </label>

      <div className={styles.checkboxRow}>
        <label className={styles.checkboxLabel}>
          <input type="checkbox" name="featured" defaultChecked={initialValues.featured} />
          Featured on homepage
        </label>
        <label className={styles.checkboxLabel}>
          <input type="checkbox" name="draft" defaultChecked={initialValues.draft} />
          Save as draft (hidden from the public site)
        </label>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>Content *</span>
        <span className={styles.hint}>
          MDX/Markdown — headings, lists, blockquotes, images, and fenced code blocks all render with
          syntax highlighting on the post page.
        </span>
        <textarea
          name="content"
          defaultValue={initialValues.content}
          required
          rows={20}
          className={styles.contentTextarea}
          spellCheck={false}
        />
      </label>

      <button type="submit" disabled={pending} className="button buttonPrimary">
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
