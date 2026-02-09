import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardClients from "../../components/DashboardClients";

// Format date into yyyy-mm-dd
function dayKeyInTZ(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const d = parts.find((p) => p.type === "day")?.value;

  return `${y}-${m}-${d}`;
}

export default async function Game() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) redirect("/");

  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
    select: { username: true, petPoints: true, todayPages: true, todayDate: true, timeZone: true}
  });

  if (!user) redirect("/");

  const now = new Date();
  const tz = user.timeZone;
  const isNewDay = dayKeyInTZ(user.todayDate, tz) !== dayKeyInTZ(now, tz);

  let todayPages = user.todayPages;

  if(isNewDay) {
     const updated = await prisma.user.update({
      where: { id: Number(userId) },
      data: { todayPages: 0, todayDate: now },
      select: { todayPages: true},
     });

     todayPages = updated.todayPages
  }

  return(
      <DashboardClients 
        initialPetPoints = {user.petPoints}
        initialTodayPages = {todayPages}
        username={user.username}
      />
  );
}
