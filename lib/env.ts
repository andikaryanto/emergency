function getRequiredEnv(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback;

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
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

function normalizeBaseUrl(value: string) {
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return `https://${value}`;
}

export const env = {
  appName: process.env.APP_NAME?.trim() || "Klinik RME",
  appUrl: normalizeBaseUrl(getRequiredEnv("APP_URL")),
  apiBaseUrl: normalizeBaseUrl(getRequiredEnv("API_URL")),
  tenantBaseDomain: getRequiredEnv("TENANT_BASE_DOMAIN"),
  apiTimeoutMs: getPositiveIntegerEnv("API_TIMEOUT_MS", 10_000),
};
