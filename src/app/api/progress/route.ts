import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

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

export async function POST(req: Request) {
    try{
        const cookieStore = await cookies();
        const userId = cookieStore.get("userId")?.value;

        const body = await req.json();

        const pagesAdded = Number(body.pagesAdded);

        const user = await prisma.user.findUnique({
            where: { id: Number(userId) },
            select: { todayDate: true, timeZone: true },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found." }, { status: 404 });
        }

        const now = new Date();
        const isNewDay = dayKeyInTZ(user.todayDate, user.timeZone) !== dayKeyInTZ(now, user.timeZone);
        
        // This is in case when it's a new day when the user press the update button
        if (isNewDay) {
            await prisma.user.update({
                where: { id: Number(userId) },
                data: { todayPages: 0, todayDate: now },
            });
        }

        const updated = await prisma.user.update({
            where: { id: Number(userId)},
            data: {
                petPoints: { increment: pagesAdded},
                todayPages: { increment: pagesAdded},
            },
            select: {
                petPoints: true,
                todayPages: true,
            },
        });

        return NextResponse.json(updated, { status: 200 });
    } catch {
        return NextResponse.json(
            { error: "Failed to update progress." },
            { status: 500 }
        );
    }
}