"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { GoogleSignInButton } from "../../components/auth/google-sign-in-button";
import { loginUserAction } from "./actions";
import { initialLoginActionState } from "./form-state";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Memproses..." : "Masuk"}
    </button>
  );
}

type LoginFormProps = {
  googleSignIn: {
    authUrl?: string;
    enabled: boolean;
  };
};

export function LoginForm({ googleSignIn }: LoginFormProps) {
  const [state, formAction] = useActionState(
    loginUserAction,
    initialLoginActionState,
  );

  return (
    <>
      {state.message ? (
        <p className="auth-message auth-message-error" role="alert">
          {state.message}
        </p>
      ) : null}

      <form className="auth-form" action={formAction} noValidate>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="nama@klinikanda.com"
          aria-invalid={Boolean(state.fieldErrors.email)}
          aria-describedby={state.fieldErrors.email ? "email-error" : undefined}
        />
        {state.fieldErrors.email ? (
          <p id="email-error" className="field-error">
            {state.fieldErrors.email}
          </p>
        ) : null}

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          aria-invalid={Boolean(state.fieldErrors.password)}
          aria-describedby={state.fieldErrors.password ? "password-error" : undefined}
        />
        {state.fieldErrors.password ? (
          <p id="password-error" className="field-error">
            {state.fieldErrors.password}
          </p>
        ) : null}

        <div className="auth-divider" aria-hidden="true">
          <span>atau</span>
        </div>

        <GoogleSignInButton
          authUrl={googleSignIn.authUrl}
          enabled={googleSignIn.enabled}
          mode="login"
        />

        <SubmitButton />
      </form>
    </>
  );
}
