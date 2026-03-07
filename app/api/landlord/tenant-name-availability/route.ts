import { NextResponse } from "next/server";
import { ApiError, apiEndpointUrls, requestJson } from "../../../../lib/api";
import {
  getLandlordAccessToken,
  getLandlordAuthorizationHeader,
} from "../../../../lib/landlord/auth-session";

type TenantNameAvailabilityApiResponse = {
  message?: string;
  data?: {
    name?: string;
    available?: boolean;
    _resources?: {
      name?: string;
      available?: boolean;
    };
  };
};

function extractAvailability(payload: TenantNameAvailabilityApiResponse) {
  const rawValue = payload.data?._resources?.available ?? payload.data?.available;

  if (typeof rawValue === "boolean") {
    return rawValue;
  }

  return null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name")?.trim() ?? "";

  if (!name) {
    return NextResponse.json(
      {
        available: false,
        message: "Nama klinik wajib diisi.",
      },
      { status: 200 },
    );
  }

  const accessToken = await getLandlordAccessToken();

  if (!accessToken) {
    return NextResponse.json(
      {
        available: false,
        message: "Sesi login tidak ditemukan. Silakan login ulang.",
      },
      { status: 401 },
    );
  }

  try {
    const url = new URL(apiEndpointUrls.landlord.tenantNameAvailability);
    url.searchParams.set("name", name);
    const authorizationHeader = await getLandlordAuthorizationHeader();

    const payload = await requestJson<TenantNameAvailabilityApiResponse, undefined>({
      url: url.toString(),
      method: "GET",
      headers: authorizationHeader,
    });

    const availability = extractAvailability(payload);
    const message =
      availability === null
        ? "Belum bisa memeriksa ketersediaan nama klinik."
        : availability
          ? "Nama klinik tersedia."
          : "Nama klinik belum tersedia.";

    return NextResponse.json(
      {
        available: availability ?? false,
        message,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          available: false,
          message:
            error.message || "Belum bisa memeriksa ketersediaan nama klinik.",
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        available: false,
        message: "Terjadi kesalahan saat memeriksa nama klinik.",
      },
      { status: 500 },
    );
  }
}
