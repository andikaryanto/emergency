"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createTenantAction } from "./actions";
import { initialCreateTenantActionState } from "./form-state";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Memproses..." : "Buat Tenant"}
    </button>
  );
}

export function CreateTenantForm() {
  const [state, formAction] = useActionState(
    createTenantAction,
    initialCreateTenantActionState,
  );

  return (
    <>
      {state.message ? (
        <p className="auth-message auth-message-error" role="alert">
          {state.message}
        </p>
      ) : null}

      <form className="auth-form" action={formAction} noValidate>
        <label htmlFor="name">Nama tenant</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Contoh: Klinik Test"
          aria-invalid={Boolean(state.fieldErrors.name)}
          aria-describedby={state.fieldErrors.name ? "name-error" : undefined}
        />
        {state.fieldErrors.name ? (
          <p id="name-error" className="field-error">
            {state.fieldErrors.name}
          </p>
        ) : null}

        <label htmlFor="username">Username admin</label>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="Contoh: admin"
          aria-invalid={Boolean(state.fieldErrors.username)}
          aria-describedby={state.fieldErrors.username ? "username-error" : undefined}
        />
        {state.fieldErrors.username ? (
          <p id="username-error" className="field-error">
            {state.fieldErrors.username}
          </p>
        ) : null}

        <label htmlFor="email">Email admin</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="admin@klinikanda.com"
          aria-invalid={Boolean(state.fieldErrors.email)}
          aria-describedby={state.fieldErrors.email ? "email-error" : undefined}
        />
        {state.fieldErrors.email ? (
          <p id="email-error" className="field-error">
            {state.fieldErrors.email}
          </p>
        ) : null}

        <label htmlFor="password">Password admin</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Minimal 8 karakter"
          aria-invalid={Boolean(state.fieldErrors.password)}
          aria-describedby={state.fieldErrors.password ? "password-error" : undefined}
        />
        {state.fieldErrors.password ? (
          <p id="password-error" className="field-error">
            {state.fieldErrors.password}
          </p>
        ) : null}

        <SubmitButton />
      </form>
    </>
  );
}
