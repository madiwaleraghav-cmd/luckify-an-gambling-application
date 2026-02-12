"use client";

import { ChipValue } from "./types";
import { motion } from "framer-motion";

interface ChipSelectorProps {
    selectedChip: ChipValue;
    onSelectChip: (value: ChipValue) => void;
}

const CHIPS: ChipValue[] = [10, 20, 50];

export default function ChipSelector({ selectedChip, onSelectChip }: ChipSelectorProps) {
    return (
        <div className="flex gap-4 justify-center items-center py-4">
            {CHIPS.map((value) => (
                <motion.button
                    key={value}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelectChip(value)}
                    className={`
            relative w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg shadow-lg border-2
            ${selectedChip === value
                            ? "border-yellow-400 ring-4 ring-yellow-400/30 -translate-y-2"
                            : "border-white/20 hover:border-white/50"
                        }
          `}
                    style={{
                        background: value === 10 ? 'radial-gradient(circle at 30% 30%, #4facfe, #00f2fe)' :
                            value === 20 ? 'radial-gradient(circle at 30% 30%, #43e97b, #38f9d7)' :
                                'radial-gradient(circle at 30% 30%, #fa709a, #fee140)',
                        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5), 0 5px 15px rgba(0,0,0,0.3)'
                    }}
                >
                    {/* Simple inner detail to look like a chip */}
                    <div className="absolute inset-2 rounded-full border border-dashed border-white/40" />
                    <span className="relative z-10 text-white drop-shadow-md">
                        ₹{value}
                    </span>
                </motion.button>
            ))}
        </div>
    );
}
