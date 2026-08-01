import { cookies } from "next/headers";

const LANDLORD_AUTH_TOKEN_COOKIE = "landlord_auth_token";
const LANDLORD_AUTH_USER_COOKIE = "landlord_auth_user";

export type LandlordAuthUser = {
  authProviders: string[];
  id: number;
  name: string;
  username: string | null;
  email: string;
  isActive: boolean;
  role: string | null;
};

export type LandlordSession = {
  token: string;
  expiredAt: string;
  user: LandlordAuthUser;
};

function createCookieDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date;
}

export async function setLandlordSession(session: LandlordSession) {
  const cookieStore = await cookies();
  const expires = createCookieDate(session.expiredAt);

  cookieStore.set(LANDLORD_AUTH_TOKEN_COOKIE, session.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(expires ? { expires } : {}),
  });

  cookieStore.set(LANDLORD_AUTH_USER_COOKIE, JSON.stringify(session.user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(expires ? { expires } : {}),
  });
}

export async function setLandlordAuthUser(user: LandlordAuthUser) {
  const cookieStore = await cookies();

  cookieStore.set(LANDLORD_AUTH_USER_COOKIE, JSON.stringify(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export async function clearLandlordSession() {
  const cookieStore = await cookies();

  cookieStore.delete(LANDLORD_AUTH_TOKEN_COOKIE);
  cookieStore.delete(LANDLORD_AUTH_USER_COOKIE);
}

export async function getLandlordAccessToken() {
  const cookieStore = await cookies();

  return cookieStore.get(LANDLORD_AUTH_TOKEN_COOKIE)?.value ?? null;
}

export async function getLandlordAuthUser() {
  const cookieStore = await cookies();
  const value = cookieStore.get(LANDLORD_AUTH_USER_COOKIE)?.value;

  if (!value) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(value) as Partial<LandlordAuthUser>;

    if (
      typeof parsedValue.id !== "number" ||
      typeof parsedValue.name !== "string" ||
      typeof parsedValue.email !== "string"
    ) {
      return null;
    }

    return {
      id: parsedValue.id,
      name: parsedValue.name,
      username: typeof parsedValue.username === "string" ? parsedValue.username : null,
      email: parsedValue.email,
      isActive: Boolean(parsedValue.isActive),
      role: typeof parsedValue.role === "string" ? parsedValue.role : null,
      authProviders: Array.isArray(parsedValue.authProviders)
        ? parsedValue.authProviders
            .map((item) => (typeof item === "string" ? item.trim().toLowerCase() : null))
            .filter((item): item is string => Boolean(item))
        : [],
    } satisfies LandlordAuthUser;
  } catch {
    return null;
  }
}

export async function getLandlordAuthorizationHeader() {
  const token = await getLandlordAccessToken();

  if (!token) {
    return {} as HeadersInit;
  }

  return {
    Authorization: `Bearer ${token}`,
  } satisfies HeadersInit;
}

export function isLandlordAdmin(user: LandlordAuthUser | null) {
  return user?.role === "admin";
}

export function hasLandlordAuthProvider(
  user: LandlordAuthUser | null,
  provider: string,
) {
  const normalizedProvider = provider.trim().toLowerCase();

  return (
    user?.authProviders?.some(
      (item) => item.trim().toLowerCase() === normalizedProvider,
    ) ?? false
  );
}

export function appendLandlordAuthProvider(
  user: LandlordAuthUser,
  provider: string,
): LandlordAuthUser {
  const normalizedProvider = provider.trim().toLowerCase();
  const authProviders = Array.from(
    new Set([...user.authProviders, normalizedProvider].filter(Boolean)),
  );

  return {
    ...user,
    authProviders,
  };
}
