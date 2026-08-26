"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup } from "@/app/actions/auth";

const initialState = {
  error: "",
};

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(
    signup,
    initialState
  );

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Create your account</h1>

        <p>Start writing and sharing your ideas.</p>

        <form action={formAction}>
          <label>
            Name
            <input
              type="text"
              name="name"
              required
            />
          </label>

          <label>
            Username
            <input
              type="text"
              name="username"
              required
            />
          </label>

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
              minLength={8}
              required
            />
          </label>

          {state?.error && (
            <p className="auth-error">{state.error}</p>
          )}

          <button type="submit" disabled={pending}>
            {pending ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link href="/login" className="auth-link">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}