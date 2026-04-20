"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  getLandlordAccessToken,
  getLandlordAuthorizationHeader,
} from "../../../lib/landlord/auth-session";
import {
  LandlordUserProfileError,
  type UpdateLandlordUserProfileRequest,
  updateLandlordUserProfile,
} from "../../../lib/landlord/user-profile";
import { type UserProfileActionState } from "./form-state";

function createErrorState(
  message: string,
  fieldErrors: UserProfileActionState["fieldErrors"] = {},
): UserProfileActionState {
  return {
    status: "error",
    message,
    fieldErrors,
  };
}

function validateUserProfilePayload(formData: FormData) {
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const province = String(formData.get("province") ?? "").trim();
  const postalCode = String(formData.get("postal_code") ?? "").trim();

  if (!phone || !address || !city || !province || !postalCode) {
    return {
      success: false as const,
      state: createErrorState("Lengkapi profil user terlebih dahulu.", {
        ...(!phone ? { phone: "Nomor telepon wajib diisi." } : {}),
        ...(!address ? { address: "Alamat wajib diisi." } : {}),
        ...(!city ? { city: "Kota wajib diisi." } : {}),
        ...(!province ? { province: "Provinsi wajib diisi." } : {}),
        ...(!postalCode ? { postalCode: "Kode pos wajib diisi." } : {}),
      }),
    };
  }

  return {
    success: true as const,
    payload: {
      phone,
      address,
      city,
      province,
      postal_code: postalCode,
    } satisfies UpdateLandlordUserProfileRequest,
  };
}

async function resolveAuthorizedRequest() {
  const accessToken = await getLandlordAccessToken();

  if (!accessToken) {
    redirect("/login");
  }

  return getLandlordAuthorizationHeader();
}

export async function updateUserProfileAction(
  userId: number,
  _previousState: UserProfileActionState,
  formData: FormData,
): Promise<UserProfileActionState> {
  const validation = validateUserProfilePayload(formData);

  if (!validation.success) {
    return validation.state;
  }

  try {
    const authorizationHeader = await resolveAuthorizedRequest();
    await updateLandlordUserProfile(userId, validation.payload, authorizationHeader);
  } catch (error) {
    if (error instanceof LandlordUserProfileError) {
      return createErrorState(error.message, error.fieldErrors);
    }

    return createErrorState(
      "Terjadi kesalahan tak terduga saat memperbarui profil user.",
    );
  }

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard");

  return {
    status: "success",
    message: "Profil user berhasil diperbarui.",
    fieldErrors: {},
  };
}
