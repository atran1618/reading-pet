"use client";

import { useState } from "react";
import PetCard from "../components/PetCard";
import StatusBox from "../components/StatusBox";
import TodayLog from "../components/TodayLog";

type DashboardClientsProps = {
    initialPetPoints: number;
    initialTodayPages: number;
    username?: string;
};

export default function DashboardClients({
    initialPetPoints,
    initialTodayPages,
    username,
}: DashboardClientsProps) {
    const [petPoints, setPetPoints] = useState(initialPetPoints);
    const [todayPages, setTodayPages] = useState(initialTodayPages);

    const [statusMessage, setStatusMessage] = useState(
        initialTodayPages > 0 ? 
            "Welcome back" : "you haven't read any pages today"
    )

    const handleTodayLogUpdate = async (pagesAdded: number) => {
        try {
            const res = await fetch("/api/progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pagesAdded }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                setStatusMessage(data.error ?? "Could not save progress.");
                return;
            }

            setPetPoints(data.petPoints);
            setTodayPages(data.todayPages);

            setStatusMessage(`Nice! you just read ${pagesAdded} pages`);
        } catch {

        };
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-[1.25fr_0.75fr] gap-8">
            {/* Left Column */}
            <section className="min-h-[480px] fade-up">
            <PetCard points={petPoints}/>
            </section>

            {/* Right column */}
            <section className="min-h-[480px] flex flex-col justify-between fade-up fade-up-delay-1">
            <TodayLog onUpdate={handleTodayLogUpdate} todayPages={todayPages}/>
            <StatusBox message={statusMessage}/>
            </section>
        </div>
        </main>
    )
}
