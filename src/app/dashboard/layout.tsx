import { Session } from "@/app/lib/types";
import { getUserSession } from "@/app/lib/session";
import { redirect } from "next/navigation"; // Use this redirect function for server components

// Handle authorization in layout page
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session: Session = await getUserSession();
  if (session === undefined) {
    redirect("/");
  }

  return <>{children}</>;
}
