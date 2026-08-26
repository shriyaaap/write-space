"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/app/actions/auth";

const initialState = {
  error: "",
};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(
    login,
    initialState
  );

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Welcome back</h1>

        <p>Log in to continue writing.</p>

        <form action={formAction}>
          <label>
            Email
            <input
              type="email"
              name="email"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              required
            />
          </label>

          {state?.error && (
            <p className="auth-error">{state.error}</p>
          )}

          <button type="submit" disabled={pending}>
            {pending ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="auth-switch">
          Dont have an account yet?{" "}
          <Link href="/signup" className="auth-link">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}