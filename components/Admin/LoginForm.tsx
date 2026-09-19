"use client";

import { useActionState } from "react";
import type { LoginState } from "@/app/admin/login/actions";
import styles from "./admin.module.css";

interface LoginFormProps {
  action: (prevState: LoginState, formData: FormData) => Promise<LoginState>;
  next: string;
}

export function LoginForm({ action, next }: LoginFormProps) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(action, {});

  return (
    <form action={formAction}>
      {state.error && <p className={styles.error}>{state.error}</p>}
      <input type="hidden" name="next" value={next} />
      <label htmlFor="password" className={`text-small text-muted ${styles.field}`}>
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoFocus
        required
        autoComplete="current-password"
        className={styles.textInput}
      />
      <button type="submit" disabled={pending} className={`button buttonPrimary ${styles.submit}`}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
