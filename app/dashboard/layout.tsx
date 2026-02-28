import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getLandlordAccessToken } from "../../lib/landlord/auth-session";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const accessToken = await getLandlordAccessToken();

  if (!accessToken) {
    redirect("/login");
  }

  return children;
}
