"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { GoogleSignInButton } from "../../components/auth/google-sign-in-button";
import { loginUserAction } from "./actions";
import { initialLoginActionState } from "./form-state";

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  const isDisabled = pending || disabled;
  const label = isDisabled ? "Sedang masuk..." : "Masuk";

  return (
    <button type="submit" disabled={isDisabled}>
      {label}
    </button>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>
  );
}

function PasswordField({
  fieldError,
  isAuthBusy,
}: {
  fieldError?: string;
  isAuthBusy: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <label htmlFor="password">Password</label>
      <div className="password-field">
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          readOnly={isAuthBusy}
          aria-disabled={isAuthBusy}
          placeholder="••••••••"
          aria-invalid={Boolean(fieldError)}
          aria-describedby={fieldError ? "password-error" : undefined}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword((previous) => !previous)}
          aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
          aria-pressed={showPassword}
        >
          <EyeIcon open={showPassword} />
        </button>
      </div>
      {fieldError ? (
        <p id="password-error" className="field-error">
          {fieldError}
        </p>
      ) : null}
    </>
  );
}

type LoginFormProps = {
  googleSignIn: {
    clientId?: string;
    enabled: boolean;
  };
};

export function LoginForm({ googleSignIn }: LoginFormProps) {
  const [state, formAction] = useActionState(
    loginUserAction,
    initialLoginActionState,
  );
  const [isAuthBusy, setIsAuthBusy] = useState(false);

  useEffect(() => {
    if (state.status === "error") {
      setIsAuthBusy(false);
    }
  }, [state.status]);

  return (
    <>
      {state.message ? (
        <p className="auth-message auth-message-error" role="alert">
          {state.message}
        </p>
      ) : null}

      <form
        className="auth-form"
        action={formAction}
        noValidate
        onSubmitCapture={() => setIsAuthBusy(true)}
      >
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          readOnly={isAuthBusy}
          aria-disabled={isAuthBusy}
          placeholder="nama@klinikanda.com"
          aria-invalid={Boolean(state.fieldErrors.email)}
          aria-describedby={state.fieldErrors.email ? "email-error" : undefined}
        />
        {state.fieldErrors.email ? (
          <p id="email-error" className="field-error">
            {state.fieldErrors.email}
          </p>
        ) : null}

        <PasswordField fieldError={state.fieldErrors.password} isAuthBusy={isAuthBusy} />

        <SubmitButton disabled={isAuthBusy} />
      </form>

      <div className="auth-divider" aria-hidden="true">
        <span>atau</span>
      </div>

      <GoogleSignInButton
        clientId={googleSignIn.clientId}
        disabled={isAuthBusy}
        enabled={googleSignIn.enabled}
        mode="login"
        onPendingChange={setIsAuthBusy}
      />
    </>
  );
}
