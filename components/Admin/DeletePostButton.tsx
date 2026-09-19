"use client";

import { useTransition } from "react";
import { deletePostAction } from "@/app/admin/(protected)/actions";
import styles from "./admin.module.css";

interface DeletePostButtonProps {
  id: string;
  title: string;
}

export function DeletePostButton({ id, title }: DeletePostButtonProps) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className={`text-small ${styles.danger}`}
      disabled={pending}
      onClick={() => {
        if (!window.confirm(`Delete "${title}"? This can't be undone.`)) return;
        startTransition(() => {
          deletePostAction(id);
        });
      }}
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
