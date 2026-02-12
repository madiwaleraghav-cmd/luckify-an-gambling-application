"use client";

import { Bet, BetType, ChipValue, RED_NUMBERS } from "./types";
import { motion, AnimatePresence } from "framer-motion";

interface BettingBoardProps {
    currentBets: Bet[];
    onPlaceBet: (type: BetType, value: string | number) => void;
    selectedChip: ChipValue;
}

export default function BettingBoard({ currentBets, onPlaceBet, selectedChip }: BettingBoardProps) {

    // Helper to render existing chips on a spot
    const renderChips = (type: BetType, value: string | number) => {
        const betsOnSpot = currentBets.filter(b => b.type === type && b.value === value);
        if (betsOnSpot.length === 0) return null;

        const totalAmount = betsOnSpot.reduce((sum, b) => sum + b.amount, 0);

        return (
            <motion.div
                initial={{ scale: 0, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 md:w-8 md:h-8 rounded-full bg-yellow-500 border-2 border-white shadow-xl flex items-center justify-center z-10 pointer-events-none"
            >
                <span className="text-[10px] md:text-xs font-bold text-black">
                    {totalAmount >= 1000 ? (totalAmount / 1000).toFixed(1) + 'k' : totalAmount}
                </span>
            </motion.div>
        );
    };

    const NumberCell = ({ num }: { num: number }) => {
        const colorClass = RED_NUMBERS.includes(num) ? "bg-red-600 hover:bg-red-500" : "bg-neutral-800 hover:bg-neutral-700";

        return (
            <div
                onClick={() => onPlaceBet('number', num)}
                className={`relative h-12 md:h-16 flex items-center justify-center border border-white/10 cursor-pointer transition-colors ${colorClass}`}
            >
                <span className="text-white font-bold text-lg md:text-xl drop-shadow-md">{num}</span>
                {renderChips('number', num)}
            </div>
        );
    };

    return (
        <div className="flex flex-col select-none max-w-3xl mx-auto overflow-x-auto">
            <div className="flex">
                {/* Zero */}
                <div
                    onClick={() => onPlaceBet('number', 0)}
                    className="w-12 md:w-16 flex items-center justify-center bg-green-600 hover:bg-green-500 rounded-l-lg cursor-pointer border-r border-white/10 relative"
                >
                    <span className="text-white font-bold -rotate-90">0</span>
                    {renderChips('number', 0)}
                </div>

                {/* Numbers Grid */}
                <div className="flex-1 grid grid-cols-[repeat(12,1fr)]">
                    {/* We need column-major order to match visual standard?
                Standard board:
                3, 6, 9...
                2, 5, 8...
                1, 4, 7...
                React grid is row-major. So we render row 3, row 2, row 1?
                No, standard visual usually:
                Col 1: 3, 2, 1 (vertically)
                OR
                Row 1: 3, 6, 9, 12...
                Row 2: 2, 5, 8, 11...
                Row 3: 1, 4, 7, 10...
            */}

                    {/* Top Row: 3, 6, 9, ... 36 */}
                    {[...Array(12)].map((_, i) => <NumberCell key={`r1-${i}`} num={(i + 1) * 3} />)}

                    {/* Middle Row: 2, 5, 8, ... 35 */}
                    {[...Array(12)].map((_, i) => <NumberCell key={`r2-${i}`} num={(i * 3) + 2} />)}

                    {/* Bottom Row: 1, 4, 7, ... 34 */}
                    {[...Array(12)].map((_, i) => <NumberCell key={`r3-${i}`} num={(i * 3) + 1} />)}
                </div>

                {/* 2 to 1 Column Bets */}
                <div className="flex flex-col w-8 md:w-12">
                    <div onClick={() => onPlaceBet('column', '3')} className="flex-1 border border-white/10 flex items-center justify-center text-xs md:text-sm cursor-pointer hover:bg-white/10 relative">
                        <span className="-rotate-90">2:1</span> {renderChips('column', '3')}
                    </div>
                    <div onClick={() => onPlaceBet('column', '2')} className="flex-1 border border-white/10 flex items-center justify-center text-xs md:text-sm cursor-pointer hover:bg-white/10 relative">
                        <span className="-rotate-90">2:1</span> {renderChips('column', '2')}
                    </div>
                    <div onClick={() => onPlaceBet('column', '1')} className="flex-1 border border-white/10 flex items-center justify-center text-xs md:text-sm cursor-pointer hover:bg-white/10 relative">
                        <span className="-rotate-90">2:1</span> {renderChips('column', '1')}
                    </div>
                </div>
            </div>

            {/* Bottom Bets: Dozens */}
            <div className="flex ml-12 md:ml-16 mr-8 md:mr-12 h-10 md:h-12">
                <div onClick={() => onPlaceBet('dozen', '1st 12')} className="flex-1 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 text-sm font-bold relative">
                    1st 12 {renderChips('dozen', '1st 12')}
                </div>
                <div onClick={() => onPlaceBet('dozen', '2nd 12')} className="flex-1 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 text-sm font-bold relative">
                    2nd 12 {renderChips('dozen', '2nd 12')}
                </div>
                <div onClick={() => onPlaceBet('dozen', '3rd 12')} className="flex-1 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 text-sm font-bold relative">
                    3rd 12 {renderChips('dozen', '3rd 12')}
                </div>
            </div>

            {/* Simple Bets: Even/Odd, Red/Black, etc */}
            <div className="flex ml-12 md:ml-16 mr-8 md:mr-12 h-10 md:h-12">
                <div onClick={() => onPlaceBet('range', 'low')} className="flex-1 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 text-xs font-bold relative">
                    1-18 {renderChips('range', 'low')}
                </div>
                <div onClick={() => onPlaceBet('parity', 'even')} className="flex-1 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 text-xs font-bold relative">
                    EVEN {renderChips('parity', 'even')}
                </div>
                <div onClick={() => onPlaceBet('color', 'red')} className="flex-1 bg-red-900/50 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-red-800 text-xs font-bold relative">
                    <div className="w-4 h-4 bg-red-600 rounded-full transform rotate-45" /> {renderChips('color', 'red')}
                </div>
                <div onClick={() => onPlaceBet('color', 'black')} className="flex-1 bg-neutral-900/50 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-neutral-800 text-xs font-bold relative">
                    <div className="w-4 h-4 bg-neutral-900 border border-white/20 rounded-full transform rotate-45" /> {renderChips('color', 'black')}
                </div>
                <div onClick={() => onPlaceBet('parity', 'odd')} className="flex-1 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 text-xs font-bold relative">
                    ODD {renderChips('parity', 'odd')}
                </div>
                <div onClick={() => onPlaceBet('range', 'high')} className="flex-1 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 text-xs font-bold relative">
                    19-36 {renderChips('range', 'high')}
                </div>
            </div>
        </div>
    );
}
