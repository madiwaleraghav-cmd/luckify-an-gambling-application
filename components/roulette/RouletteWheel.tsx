"use client";

import { useEffect, useState } from "react";
import { motion, useAnimation, useMotionValue } from "framer-motion";
import { WHEEL_NUMBERS } from "./types";

interface RouletteWheelProps {
    spinning: boolean;
    targetNumber: number | null;
    onSpinComplete?: () => void;
}

const SEGMENT_ANGLE = 360 / 37;

// The image usually has 0 at the top.
// If 0 is at 0 degrees (12 o'clock).
// The sequence is CW: 0, 32, 15...
// So index 1 (32) is at +9.7deg.
const WHEEL_IMAGE_URL = "/roulette.png";
// Note: using a high-quality stock PNG.
// If this URL is unstable, we might need a backup or local asset. 
// Standard euro wheel order is consistent.

export default function RouletteWheel({ spinning, targetNumber, onSpinComplete }: RouletteWheelProps) {
    const wheelControls = useAnimation();
    const ballControls = useAnimation();
    const wheelRotation = useMotionValue(0);

    useEffect(() => {
        if (spinning && targetNumber !== null) {
            spinWheel(targetNumber);
        }
    }, [spinning, targetNumber]);

    const spinWheel = async (target: number) => {
        // 1. Calculate stopping positions
        // We want the ball to land on the target number.
        // Let's define a random "Landing Angle" on the screen (e.g., somewhere between 0 and 360).
        const landingAngle = Math.random() * 360;

        // The Ball simply spins and stops at `landingAngle`.
        // We add multiple rotations to the ball for speed.
        // Ball usually spins opposite to wheel.
        // Let's say Ball spins CCW (negative angle).

        const ballSpins = 5 * 360; // 5 full laps
        const ballDuration = 4; // seconds
        const ballTargetRotation = -(ballSpins + landingAngle);

        // 2. Calculate Wheel Rotation
        // The Wheel must stop such that the `targetNumber` slot is under `landingAngle`.
        // Target's position on the wheel (relative to 0-index) is `index * SEGMENT_ANGLE`.
        // If Wheel is at 0 rotation, `target` is at `index * SEGMENT_ANGLE`.
        // We want `WheelRotation + (Index * SEGMENT)` = `LandingAngle`.
        // => `WheelRotation = LandingAngle - (Index * SEGMENT)`.

        const targetIndex = WHEEL_NUMBERS.indexOf(target);
        const targetAngleOnWheel = targetIndex * SEGMENT_ANGLE;

        // We want wheel to spin CW (positive).
        // Add extra spins for visual effect.
        const wheelSpins = 3 * 360;

        // Calculate final wheel rotation
        // Current rotation reference
        const currentWheelRot = wheelRotation.get();
        const currentMod = currentWheelRot % 360;

        // We need to reach `LandingAngle - targetAngleOnWheel`.
        let desiredWheelRot = landingAngle - targetAngleOnWheel;

        // Normalize to positive forward spin
        // Next rotation should be `current + wheelSpins + delta`
        // Delta is difference between desired and currentMod
        let nextWheelRot = currentWheelRot + wheelSpins + (desiredWheelRot - currentMod);

        // Correction to ensure it's always forward and enough distance
        if (nextWheelRot <= currentWheelRot + 720) {
            nextWheelRot += 360;
        }

        // 3. Animate
        // Wheel animation (heavier, keeps momentum longer?)
        // Ball animation (lighter, stops earlier?)
        // Actually usually ball stops first, drops into slot, then wheel stops.
        // Or wheel stops?
        // Let's sync them to stop roughly together for simplicity, 
        // or Ball stops, then wheel slows down.

        // Let's animate concurrently.

        await Promise.all([
            wheelControls.start({
                rotate: nextWheelRot,
                transition: {
                    duration: 5,
                    ease: "circOut", // Slows down gradually
                }
            }),
            ballControls.start({
                rotate: ballTargetRotation, // Absolute rotation for the ball container
                transition: {
                    duration: 4.5, // Ball settles slightly before wheel stops
                    ease: "circOut"
                }
            })
        ]);

        wheelRotation.set(nextWheelRot);
        if (onSpinComplete) onSpinComplete();
    };

    return (
        <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center">
            {/* Outer Rim / Static Decorative Container */}
            <div className="absolute inset-0 rounded-full border-4 border-yellow-900/50 shadow-2xl bg-black/40 backdrop-blur-sm z-0" />

            {/* Pointer (Optional, usually for static wheels, but good for reference) */}
            <div className="absolute top-0 z-30 w-4 h-6 bg-yellow-500 clip-path-polygon-[50%_100%,_0%_0%,_100%_0%] shadow-lg drop-shadow-md transform -translate-y-1/2" />

            {/* The Rotating Wheel */}
            <motion.div
                className="w-full h-full relative z-10"
                initial={{ rotate: 0 }}
                animate={wheelControls}
                style={{ rotate: wheelRotation }}
            >
                {/* Realistic Image */}
                {/* We use a specific image that matches our number sequence (Standard Euro).
             If the image is different, the logic breaks.
             Most stock 'european roulette' images start with 0 at top and go CW: 32, 15... 
             Using a reliable source or a local asset is best.
             I will use a high-quality external URL.
         */}
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Roulette_wheel.svg/1024px-Roulette_wheel.svg.png"
                    alt="Roulette Wheel"
                    className="w-full h-full object-contain filter drop-shadow-2xl"
                />
            </motion.div>

            {/* The Ball Layer */}
            {/* 
         The ball needs to orbit. 
         We rotate a transparent container, and the ball is a child at the edge (radius).
         Target rotation makes this container stop at `LandingAngle`.
         Ball sits at top (0 deg) of this container.
      */}
            <motion.div
                className="absolute inset-0 z-20 pointer-events-none"
                initial={{ rotate: 0 }}
                animate={ballControls}
            >
                {/* The Ball */}
                {/* Positioned at the top edge (radius) */}
                <div className="absolute top-[14%] left-1/2 -translate-x-1/2 w-3 h-3 md:w-4 md:h-4 bg-white rounded-full shadow-[0_0_5px_rgba(0,0,0,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.3)]" />
            </motion.div>

            {/* Center Cap (Static or rotating with wheel?) 
          Real wheels: turret rotates with wheel.
      */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_4px_8px_rgba(0,0,0,0.5)] z-20 flex items-center justify-center border-2 border-yellow-400">
                <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center shadow-inner">
                    <span className="text-yellow-500 font-bold text-[10px]">LUCKIFY</span>
                </div>
            </div>

        </div>
    );
}

