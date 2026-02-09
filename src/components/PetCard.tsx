"use client";

import { useEffect, useRef, useState } from "react";

type PetCardProps = {
    points: number;
};

const ANIM_MS = 500;
const RESET_MS = 20;

type LevelInfo = {
    level: number;
    start: number;
    end: number;
    size: number;
    progress: number;
    percent: number;
};

// Calculation for level info
function getLevelInfo(p: number): LevelInfo {
    let level = 1;
    let start = 0;
    let end = 100;

    if (p < 100) {
        level = 1; start = 0; end = 100;
    } else if (p < 200) {
        level = 2; start = 100; end = 200;
    } else if (p < 400) {
        level = 3; start = 200; end = 400;
    } else if (p < 700) {
        level = 4; start = 400; end = 700;
    } else {
        // level 5 at 700 total, and 700 need after each level
        const extra = Math.floor((p - 700) / 700); // 0 for [700..1399], 1 for [1400..2099], ...
        level = 5 + extra;
        start = 700 + extra * 700;
        end = start + 700;
    }

    const size = end - start;
    const progress = p - start;
    const percent = size === 0 ? 0 : (progress / size ) * 100;

    return { level, start, end, size, progress, percent };

}

export default function PetCard({ points }: PetCardProps){
    const levelInfo = getLevelInfo(points)
    const [displayPercent, setDisplayPercent] = useState(levelInfo.percent);
    const [noTransition, setNoTransition] = useState(false);

    const prevPointRef = useRef(points);
    const seqRef = useRef(0);

    // filling the progress bar 
    useEffect(() => {
        const prevPoints = prevPointRef.current;
        prevPointRef.current = points;

        const prevInfo = getLevelInfo(prevPoints);
        const nextInfo = getLevelInfo(points);

        const prevPercent = prevInfo.percent;
        const nextPercent = nextInfo.percent;

        const wraps = Math.max(0, nextInfo.level - prevInfo.level);

        const seq = ++seqRef.current;
        const wait = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

        (async () => {
            setNoTransition(false);
            setDisplayPercent(prevPercent);
            await wait(RESET_MS);
            if (seq !== seqRef.current) return;

            if (wraps === 0) {
                setNoTransition(false);
                setDisplayPercent(nextPercent);
                return;
            }

            setNoTransition(false);
            setDisplayPercent(100);
            await wait(ANIM_MS);
            if (seq !== seqRef.current) return;

            for(let i = 1; i < wraps; i++) {
                setNoTransition(true);
                setDisplayPercent(0);
                await wait(RESET_MS);
                if (seq !== seqRef.current) return;

                setNoTransition(false);
                setDisplayPercent(100);
                await wait(ANIM_MS);
                if (seq !== seqRef.current) return;
            }

            setNoTransition(true);
            setDisplayPercent(0);
            await wait(RESET_MS);
            if (seq !== seqRef.current) return;

            setNoTransition(false);
            setDisplayPercent(nextPercent);
        })();
    }, [points]);

    return (
    <div className="w-full min-h-[480px] rounded-3xl bg-gray-200 shadow-sm border border-gray-300 flex flex-col justify-between pb-9">
        {/* Pet display area */}
        <div className="flex-1 flex  justify-center pt-6"> 
            <div className="w-[240px] h-[240px] rounded-2xl bg-gray-100 border border-gray-300 " />
        </div>

        {/* Progress Bar */}
        <div className="w-full">
            <div className="mt-2 flex items-center justify-between text-sm font-semibold">
            <span>Level {levelInfo.level}</span>
            <span>
                {levelInfo.progress}/{levelInfo.size}
            </span>
            </div>

            <div className="h-4 w-full rounded-full bg-gray-300">
                <div 
                    className={["h-4 w-2/3 rounded-full bg-cyan-400 shadow-sm transition-[width] duration-500 ease-out", 
                        noTransition ? "transition-none" : "transition-[width] duration-500 ease-out",
                    ].join(" ")} 
                    style={{ width: `${displayPercent}%`}}
                />
            </div>
        </div>
    </div>);
}