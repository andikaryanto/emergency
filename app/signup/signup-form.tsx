"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { GoogleSignInButton } from "../../components/auth/google-sign-in-button";
import { PasswordInput } from "../../components/auth/password-input";
import { type SubscriptionPricing } from "../../lib/landlord/list-subscription-pricings";
import { registerUserAction } from "./actions";
import { initialRegisterActionState } from "./form-state";

const pricingDescriptions: Record<"Basic" | "Advance" | "Pro", string> = {
  Basic: "Cocok untuk mulai digitalisasi operasional.",
  Advance: "Untuk fitur analitik dan operasional lanjutan.",
  Pro: "Semua fitur Advance plus integrasi Satu Sehat.",
};

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function billingCycleLabel(billingCycle: "monthly" | "yearly") {
  return billingCycle === "monthly" ? "Bulanan" : "Tahunan";
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  const isDisabled = pending || disabled;
  const label = pending ? "Sedang membuat akun..." : "Buat Akun";

  return (
    <button type="submit" disabled={isDisabled}>
      {label}
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
  const [isAuthBusy, setIsAuthBusy] = useState(false);
  const [tenantName, setTenantName] = useState("");
  const [nameAvailability, setNameAvailability] = useState<
    "idle" | "checking" | "available" | "unavailable" | "error"
  >("idle");
  const [nameAvailabilityMessage, setNameAvailabilityMessage] = useState("");
  const checkedNameRef = useRef("");
  const latestRequestIdRef = useRef(0);

  const firstPlanId = pricings[0]?.subscription_pricing_plans[0]?.id;
  const [subscriptionPricingPlanId, setSubscriptionPricingPlanId] = useState(
    firstPlanId ? String(firstPlanId) : "",
  );
  const [tenantUsername, setTenantUsername] = useState("");

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantName]);

  return (
    <>
      {state.message ? (
        <p className="auth-message auth-message-error" role="alert">
          {state.message}
        </p>
      ) : null}

      <div className="auth-form signup-tenant-section">
        <label htmlFor="tenant-name">Nama klinik</label>
        <input
          id="tenant-name"
          type="text"
          value={tenantName}
          placeholder="Contoh: sejahtera"
          readOnly={isAuthBusy}
          aria-disabled={isAuthBusy}
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
          aria-invalid={Boolean(state.fieldErrors.tenantName)}
          aria-describedby={state.fieldErrors.tenantName ? "tenant-name-error" : undefined}
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
        {state.fieldErrors.tenantName ? (
          <p id="tenant-name-error" className="field-error">
            {state.fieldErrors.tenantName}
          </p>
        ) : null}

        <label htmlFor="tenant-username">Username aplikasi klinik</label>
        <input
          id="tenant-username"
          type="text"
          value={tenantUsername}
          placeholder="Contoh: admin.klinik"
          readOnly={isAuthBusy}
          aria-disabled={isAuthBusy}
          onChange={(event) => setTenantUsername(event.currentTarget.value)}
          aria-invalid={Boolean(state.fieldErrors.username)}
          aria-describedby={state.fieldErrors.username ? "tenant-username-error" : undefined}
        />
        <p className="field-hint">
          Username ini dipakai untuk login ke aplikasi klinik Anda, baik daftar dengan email
          maupun Google.
        </p>
        {state.fieldErrors.username ? (
          <p id="tenant-username-error" className="field-error">
            {state.fieldErrors.username}
          </p>
        ) : null}

        <label>Pilih paket langganan</label>
        <div
          className="pricing-choice-grid"
          role="radiogroup"
          aria-label="Pilih paket langganan"
          aria-invalid={Boolean(state.fieldErrors.subscriptionPricingPlanId)}
          aria-describedby={
            state.fieldErrors.subscriptionPricingPlanId
              ? "subscription-pricing-plan-id-error"
              : undefined
          }
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
                      name="subscription_pricing_plan_id_selector"
                      value={String(plan.id)}
                      checked={subscriptionPricingPlanId === String(plan.id)}
                      onChange={(event) => setSubscriptionPricingPlanId(event.currentTarget.value)}
                      disabled={isAuthBusy}
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
        {state.fieldErrors.subscriptionPricingPlanId ? (
          <p id="subscription-pricing-plan-id-error" className="field-error">
            {state.fieldErrors.subscriptionPricingPlanId}
          </p>
        ) : null}
      </div>

      <div className="signup-method-accordion">
        <details name="signup-method" open>
          <summary>Daftar dengan Email</summary>

          <form
            className="auth-form"
            action={formAction}
            noValidate
            onSubmitCapture={() => setIsAuthBusy(true)}
          >
            <input type="hidden" name="tenant_name" value={tenantName} />
            <input
              type="hidden"
              name="subscription_pricing_plan_id"
              value={subscriptionPricingPlanId}
            />
            <input type="hidden" name="username" value={tenantUsername} />

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

            <label htmlFor="password">Password</label>
            <PasswordInput
              id="password"
              name="password"
              readOnly={isAuthBusy}
              aria-disabled={isAuthBusy}
              placeholder="Minimal 8 karakter"
              aria-invalid={Boolean(state.fieldErrors.password)}
              aria-describedby={state.fieldErrors.password ? "password-error" : undefined}
            />
            <p className="field-hint">
              Minimal 8 karakter, wajib ada angka dan karakter spesial, tanpa spasi. Password
              ini juga dipakai untuk login ke aplikasi klinik Anda.
            </p>
            {state.fieldErrors.password ? (
              <p id="password-error" className="field-error">
                {state.fieldErrors.password}
              </p>
            ) : null}

            <label htmlFor="confirm-password">Konfirmasi password</label>
            <PasswordInput
              id="confirm-password"
              name="confirmPassword"
              readOnly={isAuthBusy}
              aria-disabled={isAuthBusy}
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

            <SubmitButton disabled={isAuthBusy} />
          </form>
        </details>

        <details name="signup-method">
          <summary>Daftar dengan Google</summary>

          <div className="google-signup-panel">
            <p className="field-hint">
              Login dengan akun Google untuk akun utama Anda. Password di bawah ini akan
              dipakai khusus untuk login ke aplikasi klinik (username memakai yang sudah
              Anda isi di atas).
            </p>

            <GoogleSignInButton
              clientId={googleSignIn.clientId}
              disabled={isAuthBusy}
              enabled={googleSignIn.enabled}
              mode="signup"
              extraFields={{
                tenant_name: tenantName,
                subscription_pricing_plan_id: subscriptionPricingPlanId,
                username: tenantUsername,
              }}
              onPendingChange={setIsAuthBusy}
            />
          </div>
        </details>
      </div>
    </>
  );
}
