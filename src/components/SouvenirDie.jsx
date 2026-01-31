import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { souvenirs } from "../data/souvenirData";

const SouvenirDie = ({ onRollComplete }) => {
    const [isRolling, setIsRolling] = useState(false);
    const controls = useAnimation();

    const handleRoll = async () => {
        if (isRolling) return;
        setIsRolling(true);

        // Initial spin
        await controls.start({
            rotateX: [0, 360 * 5],
            rotateY: [0, 360 * 5],
            transition: { duration: 0.5, ease: "linear" }
        });

        // Random result
        const randomIndex = Math.floor(Math.random() * souvenirs.length);
        const result = souvenirs[randomIndex];

        // Determine target rotation based on face (simplified mapping)
        // Front: 0,0 (Anthem)
        // Back: 180,0 (Feast)
        // Right: 0, -90 (Legend)
        // Left: 0, 90 (Slang)
        // Top: -90, 0 (Spot)
        // Bottom: 90, 0 (Gift)

        // For simplicity, we just stop spinning and show the result face in UI separate from 3D die if 3D is too complex, 
        // but here we try a simple CSS 3D cube.

        // Spin more to settle
        await controls.start({
            rotateX: 360 * 8, // Ensure it lands "upright" relative to start for visual consistency before result reveal
            rotateY: 360 * 8,
            transition: { duration: 1, ease: "easeOut" }
        });

        setIsRolling(false);
        onRollComplete(result);
    };

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <motion.div
                className="w-32 h-32 bg-stone-100 rounded-xl shadow-xl flex items-center justify-center cursor-pointer border-4 border-stone-300"
                animate={controls}
                whileTap={{ scale: 0.95 }}
                onClick={handleRoll}
            >
                <span className="text-5xl">{isRolling ? "🎲" : "TAP"}</span>
            </motion.div>
            <p className="mt-4 text-stone-500 font-medium text-sm animate-pulse">
                {isRolling ? "Rolling..." : "Tap to Roll the Souvenir Die"}
            </p>
        </div>
    );
};

export default SouvenirDie;
