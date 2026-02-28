"use server";

import { redirect } from "next/navigation";
import { clearLandlordSession } from "../../lib/landlord/auth-session";

export async function logoutUserAction() {
  await clearLandlordSession();
  redirect("/login");
}
