"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createTenantSnapPaymentTransactionAction } from "../../app/dashboard/actions";

type TenantSnapPaymentButtonProps = {
  tenantId: number;
};

const initialState = {
  status: "idle",
  message: null,
  snap: null,
} as const;

function getSnapScriptUrl({
  clientKey,
  redirectUrl,
}: {
  clientKey: string;
  redirectUrl: string | null;
}) {
  const normalizedRedirectUrl = redirectUrl?.toLowerCase() ?? "";
  const normalizedClientKey = clientKey.trim().toLowerCase();

  if (
    normalizedRedirectUrl.includes("sandbox.midtrans.com") ||
    normalizedRedirectUrl.includes("app.stg.midtrans.com") ||
    normalizedClientKey.startsWith("sb-mid-")
  ) {
    return "https://app.sandbox.midtrans.com/snap/snap.js";
  }

  return "https://app.midtrans.com/snap/snap.js";
}

function loadMidtransSnapScript({
  clientKey,
  redirectUrl,
}: {
  clientKey: string;
  redirectUrl: string | null;
}) {
  const scriptUrl = getSnapScriptUrl({ clientKey, redirectUrl });

  return new Promise<void>((resolve, reject) => {
    if (window.snap) {
      resolve();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-midtrans-snap="true"]',
    );

    if (
      existingScript &&
      existingScript.src === scriptUrl &&
      existingScript.dataset.clientKey === clientKey
    ) {
      if (window.snap) {
        resolve();
        return;
      }

      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Snap Midtrans gagal dimuat.")),
        { once: true },
      );
      return;
    }

    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.dataset.clientKey = clientKey;
    script.dataset.midtransSnap = "true";
    script.setAttribute("data-client-key", clientKey);
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error("Snap Midtrans gagal dimuat.")), {
      once: true,
    });
    document.body.appendChild(script);
  });
}

export function TenantSnapPaymentButton({ tenantId }: TenantSnapPaymentButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [messageStatus, setMessageStatus] = useState<"success" | "error" | null>(null);

  const handlePay = () => {
    setMessage(null);
    setMessageStatus(null);

    startTransition(async () => {
      const state = await createTenantSnapPaymentTransactionAction(initialState, {
        tenantId,
      });

      if (state.status !== "success" || !state.snap) {
        setMessageStatus("error");
        setMessage(state.message ?? "Pembayaran belum bisa dimulai saat ini.");
        return;
      }

      if (state.snap.gateway?.toLowerCase() !== "midtrans") {
        setMessageStatus("error");
        setMessage("Gateway pembayaran yang diterima tidak didukung.");
        return;
      }

      try {
        await loadMidtransSnapScript({
          clientKey: state.snap.clientKey,
          redirectUrl: state.snap.redirectUrl,
        });
      } catch (error) {
        setMessageStatus("error");
        setMessage(error instanceof Error ? error.message : "Snap Midtrans gagal dimuat.");
        return;
      }

      if (!window.snap) {
        setMessageStatus("error");
        setMessage("Snap Midtrans belum tersedia di browser.");
        return;
      }

      window.snap.pay(state.snap.token, {
        onSuccess: () => {
          setMessageStatus("success");
          setMessage("Pembayaran berhasil diproses. Status invoice akan diperbarui.");
          router.refresh();
        },
        onPending: () => {
          setMessageStatus("success");
          setMessage("Transaksi dibuat. Lanjutkan pembayaran Anda di Midtrans.");
          router.refresh();
        },
        onError: () => {
          setMessageStatus("error");
          setMessage("Pembayaran gagal diproses oleh Midtrans. Silakan coba lagi.");
        },
        onClose: () => {
          setMessageStatus("error");
          setMessage(
            "Popup pembayaran ditutup. Anda masih bisa pakai konfirmasi pembayaran manual sebagai cadangan.",
          );
        },
      });
    });
  };

  return (
    <div className="tenant-snap-payment">
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

      <button
        type="button"
        className="primary-button tenant-payment-button"
        onClick={handlePay}
        disabled={isPending}
      >
        {isPending ? "Menyiapkan pembayaran..." : "Bayar"}
      </button>
    </div>
  );
}

type MidtransSnapCallbacks = {
  onClose?: () => void;
  onError?: (result: unknown) => void;
  onPending?: (result: unknown) => void;
  onSuccess?: (result: unknown) => void;
};

type MidtransSnap = {
  pay: (token: string, callbacks?: MidtransSnapCallbacks) => void;
};

declare global {
  interface Window {
    snap?: MidtransSnap;
  }
}
