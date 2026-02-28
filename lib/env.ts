function getRequiredEnv(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback;

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  appName: getRequiredEnv("APP_NAME", "Klinik RME"),
  appUrl: getRequiredEnv("APP_URL", "https://clinicrme.my.id"),
  apiUrl: getRequiredEnv("API_URL", "https://landlord.clinicrme.my.id"),
  tenantBaseDomain: getRequiredEnv("TENANT_BASE_DOMAIN", "clinicrme.my.id"),
};
