import { signup } from "@/app/actions/auth";

export default function SignupPage() {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Create your account</h1>

        <p>Start writing and sharing your ideas.</p>

        <form action={signup}>
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

          <button type="submit">
            Sign up
          </button>
        </form>
      </div>
    </main>
  );
}