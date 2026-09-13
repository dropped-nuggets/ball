import CalendarClient from "@/components/CalendarClient";
import Frieze from "@/components/Frieze";
import { listEvents } from "@/lib/store";
import { guardPage } from "@/lib/guard";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  await guardPage();

  const events = await listEvents();

  // Computed server-side once; the client uses it as "today" so the month
  // grid and the countdowns agree with each other.
  const todayISO = new Date().toISOString().slice(0, 10);

  return (
    <div className="relative">
      <Frieze variant="festival" />
      <CalendarClient initialEvents={events} todayISO={todayISO} />
    </div>
  );
}
