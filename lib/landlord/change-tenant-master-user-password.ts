import { ApiError, apiEndpointUrls, requestJson } from "../api";

export class ChangeTenantMasterUserPasswordError extends Error {
  readonly status: number | null;

  constructor(message: string, status: number | null = null) {
    super(message);
    this.name = "ChangeTenantMasterUserPasswordError";
    this.status = status;
  }
}

function mapChangeTenantMasterUserPasswordError(error: ApiError) {
  if (error.code === "TIMEOUT_ERROR" || error.code === "NETWORK_ERROR") {
    return new ChangeTenantMasterUserPasswordError(
      "Server sedang tidak dapat dijangkau. Coba lagi beberapa saat.",
    );
  }

  const payload = error.payload as { message?: string } | undefined;

  return new ChangeTenantMasterUserPasswordError(
    payload?.message ?? "Password akun utama klinik gagal diperbarui.",
    error.status,
  );
}

export async function changeTenantMasterUserPassword(
  tenantId: number,
  password: string,
  passwordConfirmation: string,
  headers: HeadersInit,
) {
  try {
    await requestJson<unknown, { password: string; password_confirmation: string }>({
      url: `${apiEndpointUrls.landlord.tenant}/${tenantId}/master-user/change-password`,
      method: "POST",
      headers,
      body: { password, password_confirmation: passwordConfirmation },
    });
  } catch (error) {
    if (error instanceof ChangeTenantMasterUserPasswordError) {
      throw error;
    }

    if (error instanceof ApiError) {
      throw mapChangeTenantMasterUserPasswordError(error);
    }

    throw new ChangeTenantMasterUserPasswordError(
      "Terjadi kesalahan tak terduga saat mengubah password.",
    );
  }
}
