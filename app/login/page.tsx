import { redirect } from "next/navigation";
import LoginClient from "@/components/LoginClient";
import Motes, { Stars } from "@/components/Motes";
import { isAuthed } from "@/lib/auth";
import { SITE_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = { title: SITE_NAME };

export default async function LoginPage() {
  if (await isAuthed()) redirect("/");

  return (
    <div className="relative grid min-h-dvh place-items-center px-4">
      <Stars count={40} />
      <Motes count={14} />
      <LoginClient />
    </div>
  );
}
