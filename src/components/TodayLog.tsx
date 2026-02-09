"use client";

import { useState } from "react";

type TodayLogProps = {
    onUpdate: (pagesAdded: number) => Promise<void>;
    todayPages: number;
}

export default function TodayLog({ onUpdate, todayPages }: TodayLogProps){
    const [inputValue, setInputValue] = useState("");

    const handleUpdate = async () => {
        const pagesToAdd = Number(inputValue);

        if (!Number.isFinite(pagesToAdd) || pagesToAdd <= 0) return;

        // Update the status messages
        await onUpdate(pagesToAdd);
        setInputValue("");
    }

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        await handleUpdate();
    };

    return(
        <div className="w-full min-h-[220px] rounded-3xl bg-gray-200 shadow-sm border border-gray-300 p-8 flex flex-col justify-between">
            {/* Title + number */}
            <div className="text-center">
                <h2 className="text-xl font-semibold leading-snug">
                    Today&apos;s Total Reading Page
                    <br />
                    {todayPages}
                </h2>
            </div>

            {/* input and button updates */}
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
                <input 
                    type="number"
                    placeholder="pages"
                    value = {inputValue}
                    onChange={ (e) => setInputValue(e.target.value)}
                    className="no-spinner w-full max-w-xs h-10 rounded-md border border-gray-300 px-3 bg-white"
                />

                <button type = "submit" className="h-10 px-8 rounded-xl bg-green-400 font-semibold">
                    Updates
                </button>
            </form>
        </div>
    )
}