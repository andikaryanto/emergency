"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { registerUserAction } from "./actions";
import { initialRegisterActionState } from "./form-state";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Memproses..." : "Buat Akun"}
    </button>
  );
}

export function SignupForm() {
  const [state, formAction] = useActionState(
    registerUserAction,
    initialRegisterActionState,
  );

  return (
    <>
      {state.message ? (
        <p className="auth-message auth-message-error" role="alert">
          {state.message}
        </p>
      ) : null}

      <form className="auth-form" action={formAction} noValidate>
        <label htmlFor="name">Nama</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Nama lengkap Anda"
          aria-invalid={Boolean(state.fieldErrors.name)}
          aria-describedby={state.fieldErrors.name ? "name-error" : undefined}
        />
        {state.fieldErrors.name ? (
          <p id="name-error" className="field-error">
            {state.fieldErrors.name}
          </p>
        ) : null}

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
          placeholder="Minimal 8 karakter"
          aria-invalid={Boolean(state.fieldErrors.password)}
          aria-describedby={state.fieldErrors.password ? "password-error" : undefined}
        />
        <p className="field-hint">
          Minimal 8 karakter, wajib ada angka dan karakter spesial, tanpa spasi.
        </p>
        {state.fieldErrors.password ? (
          <p id="password-error" className="field-error">
            {state.fieldErrors.password}
          </p>
        ) : null}

        <label htmlFor="confirm-password">Konfirmasi password</label>
        <input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          placeholder="Ulangi password Anda"
          aria-invalid={Boolean(state.fieldErrors.confirmPassword)}
          aria-describedby={
            state.fieldErrors.confirmPassword ? "confirm-password-error" : undefined
          }
        />
        {state.fieldErrors.confirmPassword ? (
          <p id="confirm-password-error" className="field-error">
            {state.fieldErrors.confirmPassword}
          </p>
        ) : null}

        <SubmitButton />
      </form>
    </>
  );
}
