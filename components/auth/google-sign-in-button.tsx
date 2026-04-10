"use client";

import Script from "next/script";
import { useActionState, useEffect, useRef, useState } from "react";
import { loginWithGoogleAction } from "../../app/auth-actions";

type GoogleSignInButtonProps = {
  clientId?: string;
  disabled?: boolean;
  enabled: boolean;
  mode: "login" | "signup";
  onPendingChange?: (pending: boolean) => void;
};

const buttonCopy = {
  login: "Login dengan Google",
  signup: "Login dengan Google",
} as const;

const initialGoogleLoginActionState = {
  status: "idle",
  message: null,
} as const;

export function GoogleSignInButton({
  clientId,
  disabled = false,
  enabled,
  mode,
  onPendingChange,
}: GoogleSignInButtonProps) {
  const label = buttonCopy[mode];
  const buttonContainerRef = useRef<HTMLDivElement | null>(null);
  const credentialInputRef = useRef<HTMLInputElement | null>(null);
  const hiddenFormRef = useRef<HTMLFormElement | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [state, formAction] = useActionState(
    loginWithGoogleAction,
    initialGoogleLoginActionState,
  );
  const isReady = enabled && Boolean(clientId) && !disabled;

  useEffect(() => {
    if (window.google) {
      setIsScriptLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (state.status === "error") {
      onPendingChange?.(false);
    }
  }, [onPendingChange, state.status]);

  useEffect(() => {
    if (!buttonContainerRef.current) {
      return;
    }

    if (disabled) {
      buttonContainerRef.current.innerHTML = "";
      return;
    }

    if (!isReady || !isScriptLoaded || !window.google) {
      return;
    }

    const handleCredentialResponse = (response: GoogleCredentialResponse) => {
      if (!response.credential || !credentialInputRef.current || !hiddenFormRef.current) {
        return;
      }

      onPendingChange?.(true);
      credentialInputRef.current.value = response.credential;
      hiddenFormRef.current.requestSubmit();
    };

    buttonContainerRef.current.innerHTML = "";
    window.google.accounts.id.initialize({
      client_id: clientId!,
      callback: handleCredentialResponse,
    });
    window.google.accounts.id.renderButton(buttonContainerRef.current, {
      theme: "outline",
      size: "large",
      shape: "pill",
      text: "signin_with",
      width: 360,
    });
  }, [clientId, disabled, isReady, isScriptLoaded, onPendingChange]);

  if (!enabled || !clientId) {
    return (
      <div className="social-auth-stack">
        <button
          type="button"
          className="social-auth-button social-auth-button-disabled"
          disabled
          aria-disabled="true"
          title="Google Sign-In belum dikonfigurasi"
        >
          <GoogleMark />
          <span>{label}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="social-auth-stack">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setIsScriptLoaded(true)}
      />

      {state.message ? (
        <p className="auth-message auth-message-error" role="alert">
          {state.message}
        </p>
      ) : null}

      <form ref={hiddenFormRef} action={formAction} className="social-auth-hidden-form">
        <input ref={credentialInputRef} type="hidden" name="id_token" />
      </form>

      <div
        ref={buttonContainerRef}
        className={`google-sign-in-container${disabled ? " google-sign-in-container-disabled" : ""}`}
      />
    </div>
  );
}

function GoogleMark() {
  return (
    <svg
      aria-hidden="true"
      className="social-auth-icon"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.805 10.023H12.24v3.955h5.497c-.237 1.27-.95 2.347-2.02 3.073v2.556h3.272c1.915-1.763 3.016-4.36 3.016-7.437 0-.713-.064-1.398-.2-2.147Z"
        fill="#4285F4"
      />
      <path
        d="M12.24 22c2.73 0 5.022-.904 6.75-2.445l-3.272-2.556c-.904.61-2.06.972-3.478.972-2.64 0-4.88-1.783-5.68-4.18H3.184v2.637A10.19 10.19 0 0 0 12.24 22Z"
        fill="#34A853"
      />
      <path
        d="M6.56 13.79A6.114 6.114 0 0 1 6.242 12c0-.62.11-1.222.318-1.79V7.572H3.184A10.193 10.193 0 0 0 2.16 12c0 1.644.393 3.2 1.024 4.428l3.376-2.637Z"
        fill="#FBBC05"
      />
      <path
        d="M12.24 6.028c1.483 0 2.817.51 3.868 1.51l2.899-2.9C17.257 2.994 14.97 2 12.24 2A10.19 10.19 0 0 0 3.184 7.572l3.376 2.637c.8-2.396 3.04-4.18 5.68-4.18Z"
        fill="#EA4335"
      />
    </svg>
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
