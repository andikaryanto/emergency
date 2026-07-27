"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { GoogleSignInButton } from "../../components/auth/google-sign-in-button";
import { PasswordField } from "../../components/auth/password-field";
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

        <PasswordField
          id="password"
          name="password"
          label="Password"
          disabled={isAuthBusy}
          fieldError={state.fieldErrors.password}
        />

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
