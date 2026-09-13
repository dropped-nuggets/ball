import "server-only";
import { redirect } from "next/navigation";
import { isAuthed } from "./auth";

/**
 * Page-level gate. The API routes guard themselves independently — this is the
 * second of the two enforcement points SEC-02 asks for, not a substitute.
 */
export async function guardPage(): Promise<void> {
  if (!(await isAuthed())) redirect("/login");
}
