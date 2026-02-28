import { env } from "./env";

function normalizePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

function withTrailingSlash(url: string) {
  return url.endsWith("/") ? url : `${url}/`;
}

const DEFAULT_TIMEOUT_MS = env.apiTimeoutMs;

export const apiPaths = {
  landlord: {
    user: {
      register: "/api/landlord/user/register",
    },
  },
} as const;

export const apiUrls = {
  landlord: {
    user: {
      register: new URL(
        normalizePath(apiPaths.landlord.user.register),
        withTrailingSlash(env.apiUrl),
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

  try {
    const response = await fetch(url, {
      method,
      headers: {
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      cache: "no-store",
      signal,
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const payload = await parseResponsePayload(response);

    if (!response.ok) {
      const message =
        isJsonRecord(payload) && typeof payload.message === "string"
          ? payload.message
          : `API request gagal dengan status ${response.status}.`;

      throw new ApiError({
        message,
        code: "HTTP_ERROR",
        status: response.status,
        payload,
      });
    }

    return payload as TResponse;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError({
        message: "Request ke API melebihi batas waktu.",
        code: "TIMEOUT_ERROR",
      });
    }

    throw new ApiError({
      message: "Tidak dapat terhubung ke API.",
      code: "NETWORK_ERROR",
      payload: error,
    });
  } finally {
    clear();
  }
}
