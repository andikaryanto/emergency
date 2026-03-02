"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { resendVerificationAction } from "./actions";
import { initialResendVerificationActionState } from "./form-state";

type ResendVerificationFormProps = {
  defaultEmail?: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Memproses..." : "Kirim Ulang Link"}
    </button>
  );
}

export function ResendVerificationForm({
  defaultEmail = "",
}: ResendVerificationFormProps) {
  const [state, formAction] = useActionState(
    resendVerificationAction,
    initialResendVerificationActionState,
  );

  return (
    <>
      {state.message ? (
        <p
          className={`auth-message ${
            state.status === "success"
              ? "auth-message-success"
              : "auth-message-error"
          }`}
          role={state.status === "error" ? "alert" : "status"}
        >
          {state.message}
        </p>
      ) : null}

      <form className="auth-form" action={formAction} noValidate>
        <label htmlFor="email">Email akun</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="nama@klinikanda.com"
          defaultValue={defaultEmail}
          aria-invalid={Boolean(state.fieldErrors.email)}
          aria-describedby={state.fieldErrors.email ? "email-error" : undefined}
        />
        {state.fieldErrors.email ? (
          <p id="email-error" className="field-error">
            {state.fieldErrors.email}
          </p>
        ) : null}

        <SubmitButton />
      </form>
    </>
  );
}
