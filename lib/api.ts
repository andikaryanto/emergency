import http from "node:http";
import https from "node:https";
import { env } from "./env";

function normalizePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

function withTrailingSlash(url: string) {
  return url.endsWith("/") ? url : `${url}/`;
}

const DEFAULT_TIMEOUT_MS = env.apiTimeoutMs;
const ENABLE_API_DEBUG_LOG = env.apiDebugLog;
const LANDLORD_API_BASE_URL = new URL(withTrailingSlash(env.apiBaseUrl));
// Non-local environments can resolve the landlord API to IPv6 first, while some hosts
// still only have reliable IPv4 egress. Force IPv4 for landlord requests until infra
// networking is fully aligned.
const SHOULD_FORCE_LANDLORD_IPV4 = env.appEnv !== "local";
let requestSequence = 0;

function isLoopbackHostname(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

function shouldForceIpv4(url: string) {
  try {
    const targetUrl = new URL(url);

    if (!SHOULD_FORCE_LANDLORD_IPV4 || isLoopbackHostname(targetUrl.hostname)) {
      return false;
    }

    return (
      targetUrl.protocol === LANDLORD_API_BASE_URL.protocol &&
      targetUrl.hostname === LANDLORD_API_BASE_URL.hostname &&
      targetUrl.port === LANDLORD_API_BASE_URL.port
    );
  } catch {
    return false;
  }
}

async function fetchWithIpv4(url: string, init: RequestInit) {
  const targetUrl = new URL(url);
  const transport = targetUrl.protocol === "https:" ? https : http;
  const headers = new Headers(init.headers);
  const body =
    typeof init.body === "string" || init.body instanceof Uint8Array ? init.body : undefined;
  const requestOptions = {
    protocol: targetUrl.protocol,
    hostname: targetUrl.hostname,
    port: Number(targetUrl.port || (targetUrl.protocol === "https:" ? 443 : 80)),
    path: `${targetUrl.pathname}${targetUrl.search}`,
    method: init.method ?? "GET",
    headers: Object.fromEntries(headers.entries()),
    family: 4,
    ...(init.signal ? { signal: init.signal } : {}),
  };

  return await new Promise<Response>((resolve, reject) => {
    const request = transport.request(
      requestOptions,
      (response) => {
        const chunks: Buffer[] = [];

        response.on("data", (chunk) => {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        });

        response.on("end", () => {
          const responseHeaders = new Headers();

          for (const [key, value] of Object.entries(response.headers)) {
            if (Array.isArray(value)) {
              for (const item of value) {
                responseHeaders.append(key, item);
              }
              continue;
            }

            if (typeof value === "string") {
              responseHeaders.set(key, value);
            }
          }

          const status = response.statusCode ?? 500;
          const responseBody =
            status === 204 || status === 205 || status === 304 ? null : Buffer.concat(chunks);

          resolve(
            new Response(responseBody, {
              status,
              statusText: response.statusMessage ?? "",
              headers: responseHeaders,
            }),
          );
        });

        response.on("error", reject);
      },
    );

    request.on("error", reject);

    if (body !== undefined) {
      request.write(body);
    }

    request.end();
  });
}

export const apiEndpoints = {
  landlord: {
    paymentProfile: "/api/landlord/user/payment-profile",
    paymentProfiles: "/api/landlord/user/payment-profiles",
    subscriptionPricings: "/api/landlord/subscription-pricings",
    subscriptionInvoices: "/api/landlord/admin/subscription-invoices",
    tenant: "/api/landlord/tenant",
    tenantNameAvailability: "/api/landlord/tenant-name-availability",
    tenants: "/api/landlord/tenants",
    user: {
      forgotPassword: "/api/landlord/user/forgot-password",
      login: "/api/landlord/user/login",
      register: "/api/landlord/user/register",
      resendVerificationEmail: "/api/landlord/user/resend-verification-email",
      resetPassword: "/api/landlord/user/reset-password",
      verifyEmail: "/api/landlord/user/verify-email",
      validateResetToken: "/api/landlord/user/validate-reset-token",
    },
  },
} as const;

export const apiEndpointUrls = {
  landlord: {
    paymentProfile: new URL(
      normalizePath(apiEndpoints.landlord.paymentProfile),
      withTrailingSlash(env.apiBaseUrl),
    ).toString(),
    paymentProfiles: new URL(
      normalizePath(apiEndpoints.landlord.paymentProfiles),
      withTrailingSlash(env.apiBaseUrl),
    ).toString(),
    subscriptionPricings: new URL(
      normalizePath(apiEndpoints.landlord.subscriptionPricings),
      withTrailingSlash(env.apiBaseUrl),
    ).toString(),
    subscriptionInvoices: new URL(
      normalizePath(apiEndpoints.landlord.subscriptionInvoices),
      withTrailingSlash(env.apiBaseUrl),
    ).toString(),
    tenant: new URL(
      normalizePath(apiEndpoints.landlord.tenant),
      withTrailingSlash(env.apiBaseUrl),
    ).toString(),
    tenantNameAvailability: new URL(
      normalizePath(apiEndpoints.landlord.tenantNameAvailability),
      withTrailingSlash(env.apiBaseUrl),
    ).toString(),
    tenants: new URL(
      normalizePath(apiEndpoints.landlord.tenants),
      withTrailingSlash(env.apiBaseUrl),
    ).toString(),
    user: {
      forgotPassword: new URL(
        normalizePath(apiEndpoints.landlord.user.forgotPassword),
        withTrailingSlash(env.apiBaseUrl),
      ).toString(),
      login: new URL(
        normalizePath(apiEndpoints.landlord.user.login),
        withTrailingSlash(env.apiBaseUrl),
      ).toString(),
      register: new URL(
        normalizePath(apiEndpoints.landlord.user.register),
        withTrailingSlash(env.apiBaseUrl),
      ).toString(),
      resendVerificationEmail: new URL(
        normalizePath(apiEndpoints.landlord.user.resendVerificationEmail),
        withTrailingSlash(env.apiBaseUrl),
      ).toString(),
      resetPassword: new URL(
        normalizePath(apiEndpoints.landlord.user.resetPassword),
        withTrailingSlash(env.apiBaseUrl),
      ).toString(),
      verifyEmail: new URL(
        normalizePath(apiEndpoints.landlord.user.verifyEmail),
        withTrailingSlash(env.apiBaseUrl),
      ).toString(),
      validateResetToken: new URL(
        normalizePath(apiEndpoints.landlord.user.validateResetToken),
        withTrailingSlash(env.apiBaseUrl),
      ).toString(),
    },
  },
} as const;

type ApiErrorCode =
  | "HTTP_ERROR"
  | "NETWORK_ERROR"
  | "TIMEOUT_ERROR"
  | "INVALID_RESPONSE";

type JsonRecord = Record<string, unknown>;

function isSensitiveLogKey(key: string) {
  const normalizedKey = key.trim().toLowerCase();

  return (
    normalizedKey.includes("password") ||
    normalizedKey.includes("authorization") ||
    normalizedKey.includes("token") ||
    normalizedKey.includes("cookie")
  );
}

function sanitizeForLog(value: unknown, visited = new WeakSet<object>()): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === "string") {
    return value.length > 600 ? `${value.slice(0, 600)}...[truncated]` : value;
  }

  if (typeof value !== "object") {
    return value;
  }

  if (visited.has(value)) {
    return "[Circular]";
  }

  visited.add(value);

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeForLog(item, visited));
  }

  const output: Record<string, unknown> = {};

  for (const [key, itemValue] of Object.entries(value)) {
    output[key] = isSensitiveLogKey(key)
      ? "[REDACTED]"
      : sanitizeForLog(itemValue, visited);
  }

  return output;
}

function sanitizeHeadersForLog(headers: HeadersInit | undefined) {
  if (!headers) {
    return undefined;
  }

  const normalized = new Headers(headers);
  const output: Record<string, string> = {};

  for (const [key, value] of normalized.entries()) {
    output[key] = isSensitiveLogKey(key) ? "[REDACTED]" : value;
  }

  return output;
}

function logApiEvent(label: string, meta: Record<string, unknown>) {
  if (!ENABLE_API_DEBUG_LOG) {
    return;
  }

  console.info("[api] " + new Date().toISOString() + " " + label, sanitizeForLog(meta));
}

function toErrorLogMeta(error: unknown) {
  if (!(error instanceof Error)) {
    return { message: "Unknown network error", raw: String(error) };
  }

  const base: Record<string, unknown> = {
    name: error.name,
    message: error.message,
  };

  const errorWithCause = error as Error & { cause?: unknown };
  const cause = errorWithCause.cause;

  if (cause && typeof cause === "object") {
    const causeRecord = cause as Record<string, unknown>;
    base.cause = {
      name: causeRecord.name,
      message: causeRecord.message,
      code: causeRecord.code,
      errno: causeRecord.errno,
      syscall: causeRecord.syscall,
      hostname: causeRecord.hostname,
      address: causeRecord.address,
      port: causeRecord.port,
    };
  }

  return base;
}

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number | null;
  readonly payload: unknown;

  constructor({
    message,
    code,
    status = null,
    payload,
  }: {
    message: string;
    code: ApiErrorCode;
    status?: number | null;
    payload?: unknown;
  }) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.payload = payload;
  }
}

function isJsonRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isJsonResponse(contentType: string | null) {
  return contentType?.includes("application/json") ?? false;
}

async function parseResponsePayload(response: Response) {
  if (response.status === 204) {
    return null;
  }

  if (isJsonResponse(response.headers.get("content-type"))) {
    try {
      return (await response.json()) as unknown;
    } catch {
      throw new ApiError({
        message: "API mengembalikan JSON yang tidak valid.",
        code: "INVALID_RESPONSE",
        status: response.status,
      });
    }
  }

  try {
    return await response.text();
  } catch {
    return null;
  }
}

function createTimeoutSignal(timeoutMs: number) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeoutId),
  };
}

export async function requestJson<TResponse, TBody extends JsonRecord | undefined>({
  url,
  method,
  body,
  headers,
  timeoutMs = DEFAULT_TIMEOUT_MS,
}: {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: TBody;
  headers?: HeadersInit;
  timeoutMs?: number;
}) {
  const { signal, clear } = createTimeoutSignal(timeoutMs);
  const requestId = `req_${Date.now()}_${++requestSequence}`;
  const startedAt = Date.now();
  const requestHeaders: HeadersInit = {
    Accept: "application/json",
    ...(body ? { "Content-Type": "application/json" } : {}),
    ...headers,
  };

  logApiEvent("request", {
    requestId,
    method,
    url,
    timeoutMs,
    headers: sanitizeHeadersForLog(requestHeaders),
    body,
  });

  try {
    const requestInit: RequestInit = {
      method,
      headers: requestHeaders,
      cache: "no-store",
      signal,
      ...(body ? { body: JSON.stringify(body) } : {}),
    };
    const response = shouldForceIpv4(url)
      ? await fetchWithIpv4(url, requestInit)
      : await fetch(url, requestInit);

    const payload = await parseResponsePayload(response);
    const durationMs = Date.now() - startedAt;

    if (!response.ok) {
      const message =
        isJsonRecord(payload) && typeof payload.message === "string"
          ? payload.message
          : `API request gagal dengan status ${response.status}.`;

      logApiEvent("response_error", {
        requestId,
        method,
        url,
        status: response.status,
        durationMs,
        payload,
      });

      throw new ApiError({
        message,
        code: "HTTP_ERROR",
        status: response.status,
        payload,
      });
    }

    logApiEvent("response_ok", {
      requestId,
      method,
      url,
      status: response.status,
      durationMs,
      payload,
    });

    return payload as TResponse;
  } catch (error) {
    if (error instanceof ApiError) {
      logApiEvent("exception", {
        requestId,
        method,
        url,
        code: error.code,
        status: error.status,
        durationMs: Date.now() - startedAt,
        message: error.message,
        payload: error.payload,
      });
      throw error;
    }

    if (error instanceof Error && error.name === "AbortError") {
      logApiEvent("timeout", {
        requestId,
        method,
        url,
        durationMs: Date.now() - startedAt,
      });
      throw new ApiError({
        message: "Request ke API melebihi batas waktu.",
        code: "TIMEOUT_ERROR",
      });
    }

    logApiEvent("network_error", {
      requestId,
      method,
      url,
      durationMs: Date.now() - startedAt,
      error: toErrorLogMeta(error),
    });

    throw new ApiError({
      message: "Tidak dapat terhubung ke API.",
      code: "NETWORK_ERROR",
      payload: error,
    });
  } finally {
    clear();
  }
}
