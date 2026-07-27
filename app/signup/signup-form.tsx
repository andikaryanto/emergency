"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { GoogleSignInButton } from "../../components/auth/google-sign-in-button";
import { PasswordField } from "../../components/auth/password-field";
import {
  billingCycleLabel,
  formatRupiah,
  pricingDescriptions,
} from "../../lib/format-tenant-plan";
import { type LoginGoogleFieldErrors } from "../../lib/landlord/login-google";
import { type SubscriptionPricing } from "../../lib/landlord/list-subscription-pricings";
import { registerUserAction } from "./actions";
import { initialRegisterActionState } from "./form-state";

const SIGNUP_FORM_ID = "signup-form";

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  const isDisabled = pending || disabled;
  const label = isDisabled ? "Sedang membuat akun..." : "Buat Akun";

  return (
    <button type="submit" disabled={isDisabled}>
      {label}
    </button>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`accordion-chevron${open ? " accordion-chevron-open" : ""}`}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
    </svg>
  );
}

function AccordionHeader({
  title,
  description,
  open,
  onClick,
}: {
  title: string;
  description: string;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="accordion-header"
      aria-expanded={open}
      onClick={onClick}
    >
      <span className="accordion-header-copy">
        <strong>{title}</strong>
        <span className="field-hint">{description}</span>
      </span>
      <ChevronIcon open={open} />
    </button>
  );
}

type SignupFormProps = {
  googleSignIn: {
    clientId?: string;
    enabled: boolean;
  };
  pricings: SubscriptionPricing[];
};

export function SignupForm({ googleSignIn, pricings }: SignupFormProps) {
  const [state, formAction] = useActionState(
    registerUserAction,
    initialRegisterActionState,
  );
  const [googleFieldErrors, setGoogleFieldErrors] = useState<LoginGoogleFieldErrors>({});
  const [isAuthBusy, setIsAuthBusy] = useState(false);
  const [activeMethod, setActiveMethod] = useState<"email" | "google">("email");
  const [tenantName, setTenantName] = useState("");
  const [nameAvailability, setNameAvailability] = useState<
    "idle" | "checking" | "available" | "unavailable" | "error"
  >("idle");
  const [nameAvailabilityMessage, setNameAvailabilityMessage] = useState("");
  const checkedNameRef = useRef("");
  const latestRequestIdRef = useRef(0);

  useEffect(() => {
    if (state.status === "error") {
      setIsAuthBusy(false);
    }
  }, [state.status]);

  async function checkTenantNameAvailability(rawName: string, force = false) {
    const name = rawName.trim();

    if (!name) {
      setNameAvailability("idle");
      setNameAvailabilityMessage("");
      checkedNameRef.current = "";
      return;
    }

    if (!force && name === checkedNameRef.current) {
      return;
    }

    const requestId = latestRequestIdRef.current + 1;
    latestRequestIdRef.current = requestId;
    checkedNameRef.current = name;
    setNameAvailability("checking");
    setNameAvailabilityMessage("Memeriksa ketersediaan nama klinik...");

    try {
      const response = await fetch(
        `/api/landlord/tenant-name-availability?name=${encodeURIComponent(name)}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const payload = (await response.json()) as {
        available?: boolean;
        message?: string;
      };

      if (requestId !== latestRequestIdRef.current) {
        return;
      }

      if (payload.available) {
        setNameAvailability("available");
        setNameAvailabilityMessage(payload.message ?? "Nama klinik tersedia.");
        return;
      }

      setNameAvailability("unavailable");
      setNameAvailabilityMessage(payload.message ?? "Nama klinik belum tersedia.");
    } catch {
      if (requestId !== latestRequestIdRef.current) {
        return;
      }

      setNameAvailability("error");
      setNameAvailabilityMessage(
        "Nama klinik belum bisa diperiksa. Silakan coba lagi.",
      );
    }
  }

  useEffect(() => {
    const name = tenantName.trim();

    if (!name) {
      return;
    }

    const timeoutId = setTimeout(() => {
      void checkTenantNameAvailability(name);
    }, 600);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [tenantName]);

  const firstPlanId = pricings[0]?.subscription_pricing_plans[0]?.id;
  const tenantNameError = state.fieldErrors.tenantName ?? googleFieldErrors.tenantName;
  const usernameError = state.fieldErrors.username ?? googleFieldErrors.username;
  const planError =
    state.fieldErrors.subscriptionPricingPlanId ?? googleFieldErrors.subscriptionPricingPlanId;

  return (
    <>
      {state.message ? (
        <p className="auth-message auth-message-error" role="alert">
          {state.message}
        </p>
      ) : null}

      <form
        id={SIGNUP_FORM_ID}
        className="auth-form"
        action={formAction}
        noValidate
        onSubmitCapture={() => {
          setIsAuthBusy(true);
          setGoogleFieldErrors({});
        }}
      >
        <span className="eyebrow">Detail klinik</span>

        <label htmlFor="tenant-name">Nama klinik</label>
        <input
          id="tenant-name"
          name="tenant_name"
          type="text"
          readOnly={isAuthBusy}
          aria-disabled={isAuthBusy}
          placeholder="Contoh: sejahtera"
          onChange={(event) => {
            const value = event.currentTarget.value.trim();
            setTenantName(event.currentTarget.value);

            if (!value) {
              setNameAvailability("idle");
              setNameAvailabilityMessage("");
              checkedNameRef.current = "";
              return;
            }

            if (value !== checkedNameRef.current && nameAvailability !== "idle") {
              setNameAvailability("idle");
              setNameAvailabilityMessage("");
            }
          }}
          onBlur={(event) => {
            void checkTenantNameAvailability(event.currentTarget.value, true);
          }}
          aria-invalid={Boolean(tenantNameError)}
          aria-describedby={tenantNameError ? "tenant-name-error" : undefined}
        />
        <p className="field-hint">
          Gunakan huruf kecil dan angka saja tanpa spasi atau karakter spesial.
        </p>
        {nameAvailability !== "idle" ? (
          <p
            className={`field-hint ${
              nameAvailability === "available"
                ? "field-hint-success"
                : nameAvailability === "checking"
                  ? "field-hint-neutral"
                  : "field-hint-error"
            }`}
            role={nameAvailability === "error" ? "alert" : "status"}
          >
            {nameAvailabilityMessage}
          </p>
        ) : null}
        {tenantNameError ? (
          <p id="tenant-name-error" className="field-error">
            {tenantNameError}
          </p>
        ) : null}

        <label htmlFor="username">Username admin klinik</label>
        <input
          id="username"
          name="username"
          type="text"
          readOnly={isAuthBusy}
          aria-disabled={isAuthBusy}
          placeholder="Contoh: admin.klinik"
          aria-invalid={Boolean(usernameError)}
          aria-describedby={usernameError ? "username-error" : undefined}
        />
        <p className="field-hint">
          Username ini dipakai untuk login ke aplikasi klinik Anda (bukan akun portal ini).
        </p>
        {usernameError ? (
          <p id="username-error" className="field-error">
            {usernameError}
          </p>
        ) : null}

        <label>Pilih paket langganan</label>
        <div
          className="pricing-choice-grid"
          role="radiogroup"
          aria-label="Pilih paket langganan"
          aria-invalid={Boolean(planError)}
          aria-describedby={planError ? "subscription-pricing-plan-id-error" : undefined}
        >
          {pricings.map((pricing) => (
            <section className="pricing-group-card" key={pricing.id}>
              <div className="pricing-group-head">
                <strong>{pricing.name}</strong>
                <p>{pricingDescriptions[pricing.name]}</p>
              </div>

              <div className="pricing-group-options">
                {pricing.subscription_pricing_plans.map((plan) => (
                  <label className="pricing-choice-card pricing-choice-option" key={plan.id}>
                    <input
                      type="radio"
                      name="subscription_pricing_plan_id"
                      value={String(plan.id)}
                      defaultChecked={plan.id === firstPlanId}
                    />
                    <div className="pricing-choice-copy">
                      <div className="pricing-choice-row">
                        <strong>{billingCycleLabel(plan.billingCycle)}</strong>
                        <span className="pricing-choice-price">{formatRupiah(plan.amount)}</span>
                      </div>
                      <p>{plan.billingCycle === "monthly" ? "Bayar per bulan" : "Bayar per tahun"}</p>
                    </div>
                  </label>
                ))}
              </div>
            </section>
          ))}
        </div>
        {planError ? (
          <p id="subscription-pricing-plan-id-error" className="field-error">
            {planError}
          </p>
        ) : null}

        <p className="field-hint">Pilih cara mendaftar</p>

        <div className="signup-method-accordion">
          <div className="accordion-item">
            <AccordionHeader
              title="Daftar dengan Email"
              description="Buat password sendiri untuk akun portal & aplikasi klinik."
              open={activeMethod === "email"}
              onClick={() => setActiveMethod("email")}
            />

            {activeMethod === "email" ? (
              <div className="accordion-panel">
                <label htmlFor="name">Nama</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  readOnly={isAuthBusy}
                  aria-disabled={isAuthBusy}
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
                  placeholder="Minimal 8 karakter"
                  disabled={isAuthBusy}
                  fieldError={state.fieldErrors.password}
                  hint={
                    <p className="field-hint">
                      Minimal 8 karakter, wajib ada angka dan karakter spesial, tanpa spasi.
                      Password ini juga akan jadi password login ke aplikasi klinik Anda.
                    </p>
                  }
                />

                <PasswordField
                  id="confirm-password"
                  name="confirmPassword"
                  label="Konfirmasi password"
                  placeholder="Ulangi password Anda"
                  disabled={isAuthBusy}
                  fieldError={state.fieldErrors.confirmPassword}
                />

                <SubmitButton disabled={isAuthBusy} />
              </div>
            ) : null}
          </div>

          <div className="accordion-item">
            <AccordionHeader
              title="Daftar dengan Google"
              description="Google hanya untuk masuk ke akun portal. Aplikasi klinik tetap butuh password sendiri."
              open={activeMethod === "google"}
              onClick={() => setActiveMethod("google")}
            />

            {activeMethod === "google" ? (
              <div className="accordion-panel">
                <PasswordField
                  id="tenant-password"
                  name="tenant_password"
                  label="Password aplikasi klinik"
                  placeholder="Minimal 8 karakter"
                  disabled={isAuthBusy}
                  fieldError={googleFieldErrors.tenantPassword}
                />

                <GoogleSignInButton
                  clientId={googleSignIn.clientId}
                  disabled={isAuthBusy}
                  enabled={googleSignIn.enabled}
                  formId={SIGNUP_FORM_ID}
                  mode="signup"
                  onFieldErrors={setGoogleFieldErrors}
                  onPendingChange={setIsAuthBusy}
                />
              </div>
            ) : null}
          </div>
        </div>
      </form>
    </>
  );
}
