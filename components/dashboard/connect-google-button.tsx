"use client";

import Script from "next/script";
import { useActionState, useEffect, useRef, useState } from "react";
import { connectGoogleAction } from "../../app/dashboard/actions";

const initialConnectGoogleActionState = {
  status: "idle",
  message: null,
} as const;

export function ConnectGoogleButton() {
  const buttonContainerRef = useRef<HTMLDivElement | null>(null);
  const credentialInputRef = useRef<HTMLInputElement | null>(null);
  const hiddenFormRef = useRef<HTMLFormElement | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [state, formAction] = useActionState(
    connectGoogleAction,
    initialConnectGoogleActionState,
  );

  useEffect(() => {
    if (window.google) {
      setIsScriptLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (state.status === "error") {
      setIsPending(false);
    }
  }, [state.status]);

  useEffect(() => {
    if (!buttonContainerRef.current) {
      return;
    }

    if (isPending) {
      buttonContainerRef.current.innerHTML = "";
      return;
    }

    if (!isScriptLoaded || !window.google) {
      return;
    }

    const handleCredentialResponse = (response: GoogleCredentialResponse) => {
      if (!response.credential || !credentialInputRef.current || !hiddenFormRef.current) {
        return;
      }

      setIsPending(true);
      credentialInputRef.current.value = response.credential;
      hiddenFormRef.current.requestSubmit();
    };

    buttonContainerRef.current.innerHTML = "";
    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
      callback: handleCredentialResponse,
    });
    window.google.accounts.id.renderButton(buttonContainerRef.current, {
      theme: "outline",
      size: "large",
      shape: "pill",
      text: "continue_with",
      width: 280,
    });
  }, [isPending, isScriptLoaded]);

  return (
    <div className="dashboard-connect-stack">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setIsScriptLoaded(true)}
      />

      {state.message ? (
        <p className="auth-message auth-message-error dashboard-connect-message" role="alert">
          {state.message}
        </p>
      ) : null}

      <form ref={hiddenFormRef} action={formAction} className="social-auth-hidden-form">
        <input ref={credentialInputRef} type="hidden" name="id_token" />
      </form>

      <div
        ref={buttonContainerRef}
        className={`google-sign-in-container${isPending ? " google-sign-in-container-disabled" : ""}`}
      />

      <p className="field-hint field-hint-neutral">
        Hubungkan akun Google untuk mempermudah login berikutnya.
      </p>
    </div>
  );
}

type GoogleCredentialResponse = {
  credential?: string;
};

type GoogleAccountsId = {
  initialize: (options: {
    callback: (response: GoogleCredentialResponse) => void;
    client_id: string;
  }) => void;
  renderButton: (
    parent: HTMLElement,
    options: {
      shape?: "circle" | "pill" | "rectangular" | "square";
      size?: "large" | "medium" | "small";
      text?: "continue_with" | "signin" | "signin_with" | "signup_with";
      theme?: "filled_black" | "filled_blue" | "outline";
      width?: number;
    },
  ) => void;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: GoogleAccountsId;
      };
    };
  }
}
