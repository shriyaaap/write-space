"use client";

import { useActionState } from "react";
import {
  updateProfile,
  changePassword,
} from "@/app/actions/profile";
import styles from "./profile.module.css";

type Props = {
  username: string;
  name: string;
  email: string;
};

type ActionState = {
  error?: string;
  success?: string;
} | null;

const initialState: ActionState = null;

export default function ProfileForm({
  username,
  name,
  email,
}: Props) {
  const [
    profileState,
    profileAction,
    profilePending,
  ] = useActionState(
    updateProfile,
    initialState
  );

  const [
    passwordState,
    passwordAction,
    passwordPending,
  ] = useActionState(
    changePassword,
    initialState
  );

  return (
    <div className={styles.settings}>

      {/* Profile settings */}
      <section className={styles.section}>
        <h2>Profile</h2>

        <form
          action={profileAction}
          className={styles.form}
        >
          {/* Name */}
          <div className={styles.field}>
            <label htmlFor="name">
              Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              defaultValue={name}
              required
            />
          </div>

          {/* Username */}
          <div className={styles.field}>
            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              name="username"
              type="text"
              defaultValue={username}
              required
            />
          </div>

          {/* Email */}
          <div className={styles.field}>
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              defaultValue={email}
              required
            />
          </div>

          {profileState?.error && (
            <p className={styles.error}>
              {profileState.error}
            </p>
          )}

          {profileState?.success && (
            <p className={styles.success}>
              {profileState.success}
            </p>
          )}

          <button
            type="submit"
            disabled={profilePending}
            className={styles.saveButton}
          >
            {profilePending
              ? "Saving..."
              : "Save Changes"}
          </button>
        </form>
      </section>

      {/* Change password */}
      <section className={styles.section}>
        <h2>Change password</h2>

        <form
          action={passwordAction}
          className={styles.form}
        >
          <div className={styles.field}>
            <label htmlFor="currentPassword">
              Current password
            </label>

            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="newPassword">
              New password
            </label>

            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="confirmPassword">
              Confirm new password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
            />
          </div>

          {passwordState?.error && (
            <p className={styles.error}>
              {passwordState.error}
            </p>
          )}

          {passwordState?.success && (
            <p className={styles.success}>
              {passwordState.success}
            </p>
          )}

          <button
            type="submit"
            disabled={passwordPending}
            className={styles.saveButton}
          >
            {passwordPending
              ? "Changing..."
              : "Change Password"}
          </button>
        </form>
      </section>

    </div>
  );
}