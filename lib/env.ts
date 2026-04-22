function getRequiredEnv(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback;

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getOptionalEnv(name: string) {
  const value = process.env[name]?.trim();

  return value || undefined;
}

function getPositiveIntegerEnv(name: string, fallback: number) {
  const rawValue = process.env[name];

  if (!rawValue) {
    return fallback;
  }

  const parsedValue = Number.parseInt(rawValue, 10);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    throw new Error(`Environment variable ${name} must be a positive integer.`);
  }

  return parsedValue;
}

function getBooleanEnv(name: string, fallback: boolean) {
  const rawValue = process.env[name];

  if (!rawValue) {
    return fallback;
  }

  const normalizedValue = rawValue.trim().toLowerCase();

  if (["1", "true", "yes", "on"].includes(normalizedValue)) {
    return true;
  }

  if (["0", "false", "no", "off"].includes(normalizedValue)) {
    return false;
  }

  throw new Error(`Environment variable ${name} must be a boolean value.`);
}

function getPaymentMethodEnv(name: string, fallback: "manual" | "midtrans") {
  const rawValue = process.env[name];

  if (!rawValue) {
    return fallback;
  }

  const normalizedValue = rawValue.trim().toLowerCase();

  if (normalizedValue === "manual" || normalizedValue === "midtrans") {
    return normalizedValue;
  }

  throw new Error(`Environment variable ${name} must be either "manual" or "midtrans".`);
}

function normalizeBaseUrl(value: string) {
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return `https://${value}`;
}

export const env = {
  appName: process.env.APP_NAME?.trim() || "Klinik RME",
  appEnv: process.env.APP_ENV?.trim().toLowerCase() || "production",
  appUrl: normalizeBaseUrl(getRequiredEnv("APP_URL")),
  apiBaseUrl: normalizeBaseUrl(getRequiredEnv("API_URL")),
  tenantBaseDomain: getRequiredEnv("TENANT_BASE_DOMAIN"),
  apiTimeoutMs: getPositiveIntegerEnv("API_TIMEOUT_MS", 10_000),
  apiDebugLog: getBooleanEnv(
    "API_DEBUG_LOG",
    (process.env.APP_ENV?.trim().toLowerCase() || "production") !== "production",
  ),
  paymentMethod: getPaymentMethodEnv("PAYMENT_METHOD", "manual"),
  googleAuth: {
    enabled: getBooleanEnv("NEXT_PUBLIC_GOOGLE_SIGN_IN_ENABLED", false),
    clientId: getOptionalEnv("NEXT_PUBLIC_GOOGLE_CLIENT_ID"),
    authUrl: getOptionalEnv("NEXT_PUBLIC_GOOGLE_SIGN_IN_URL"),
    callbackUrl: getOptionalEnv("GOOGLE_OAUTH_CALLBACK_URL"),
  },
};
