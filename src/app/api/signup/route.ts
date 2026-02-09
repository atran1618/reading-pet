import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try{
        const body = await req.json();
        const username = String(body.username ?? "").trim();
        const password = String(body.password ?? "").trim();
        const timeZone = String(body.timeZone ?? "UTC").trim();

        // Make sure that the timezone is safe 
        let safeTimeZone = "UTC";
        try {
            new Intl.DateTimeFormat("en-US", { timeZone }).format(new Date());
            safeTimeZone = timeZone;
        } catch {
            safeTimeZone = "UTC;"
        }

        if (!username || !password) {
            return NextResponse.json(
                { error: "Username and password are required."},
                { status: 400}
            );
        }

        const existing = await prisma.user.findUnique({
            where: { username },
        })

        if (existing) {
            return NextResponse.json(
                { error: "Username already exists."},
                { status: 409}
            );
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {username, passwordHash, timeZone: safeTimeZone},
        });

        return NextResponse.json({ ok: true }, { status: 201 });
    } catch {
        return NextResponse.json(
            { error: "Something went wrong."},
            { status: 500 }
        )
    }
}