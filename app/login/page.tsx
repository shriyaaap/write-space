import { login } from "@/app/actions/auth";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Welcome back</h1>

        <p>Log in to continue writing.</p>

        <form action={login}>
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



          <button type="submit">
            Log in
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