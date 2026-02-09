import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const username = String(body.username ?? "").trim();
        const password = String(body.password ?? "").trim();

        if (!username || !password) {
            return NextResponse.json(
                { error: "Username and password are required." },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({ where: {username} });

        if (!user) {
            return NextResponse.json({ error: "No username for this exist."}, { status:401 });
        }

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
            return NextResponse.json({ error: "Invalid password."}, { status:401 });
        }

        const res = NextResponse.json({ ok: true });

        res.cookies.set("isSignedIn", "1", {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            secure: process.env.NODE_ENV === "production",
        });

        res.cookies.set("userId", String(user.id), {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            secure: process.env.NODE_ENV === "production",
        });

        return res;
    } catch {
        return NextResponse.json( { error: "Something went wrong." }, { status: 500 })
    }
} 