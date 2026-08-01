"use client";

import { type FormEvent, useState, useTransition } from "react";
import { changeTenantMasterUserPasswordAction } from "../../app/dashboard/actions";

type TenantChangePasswordFormProps = {
  tenantId: number;
};

const initialState = {
  status: "idle",
  message: null,
} as const;

const MIN_PASSWORD_LENGTH = 8;

export function TenantChangePasswordForm({ tenantId }: TenantChangePasswordFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [messageStatus, setMessageStatus] = useState<"success" | "error" | null>(null);

  const handleToggle = () => {
    setIsOpen((current) => !current);
    setMessage(null);
    setMessageStatus(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isPending) {
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setMessageStatus("error");
      setMessage(`Password baru minimal ${MIN_PASSWORD_LENGTH} karakter.`);
      return;
    }

    if (password !== passwordConfirmation) {
      setMessageStatus("error");
      setMessage("Konfirmasi password tidak sama dengan password baru.");
      return;
    }

    startTransition(async () => {
      const state = await changeTenantMasterUserPasswordAction(initialState, {
        tenantId,
        password,
        passwordConfirmation,
      });

      setMessageStatus(state.status === "success" ? "success" : "error");
      setMessage(state.message);

      if (state.status === "success") {
        setPassword("");
        setPasswordConfirmation("");
      }
    });
  };

  return (
    <div className="tenant-password-change">
      <button type="button" className="tenant-text-action" onClick={handleToggle}>
        {isOpen ? "Batalkan Ubah Password" : "Ubah Password Klinik"}
      </button>

      {isOpen ? (
        <form className="auth-form tenant-password-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor={`tenant-${tenantId}-password`}>Password baru</label>
          <input
            id={`tenant-${tenantId}-password`}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Masukkan password baru"
            minLength={MIN_PASSWORD_LENGTH}
            autoComplete="new-password"
            required
          />

          <label htmlFor={`tenant-${tenantId}-password-confirmation`}>
            Konfirmasi password baru
          </label>
          <input
            id={`tenant-${tenantId}-password-confirmation`}
            type="password"
            value={passwordConfirmation}
            onChange={(event) => setPasswordConfirmation(event.target.value)}
            placeholder="Ulangi password baru"
            minLength={MIN_PASSWORD_LENGTH}
            autoComplete="new-password"
            required
          />

          {message ? (
            <p
              className={`auth-message ${
                messageStatus === "success" ? "auth-message-success" : "auth-message-error"
              }`}
              role={messageStatus === "success" ? "status" : "alert"}
            >
              {message}
            </p>
          ) : null}

          <button type="submit" disabled={isPending}>
            {isPending ? "Menyimpan..." : "Simpan Password Baru"}
          </button>
        </form>
      ) : null}
    </div>
  );
}
