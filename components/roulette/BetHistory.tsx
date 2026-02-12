"use client";

import { Bet } from "./types";

interface HistoryItem {
    roundId: number;
    winningNumber: number;
    totalBet: number;
    totalWin: number;
}

interface BetHistoryProps {
    history: HistoryItem[];
}

export default function BetHistory({ history }: BetHistoryProps) {
    if (history.length === 0) return null;

    return (
        <div className="w-full bg-neutral-900 border border-white/10 rounded-lg p-4 mt-8">
            <h3 className="text-xl font-bold text-yellow-500 mb-4">Round History</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-neutral-400">
                    <thead className="bg-white/5 uppercase font-medium">
                        <tr>
                            <th className="px-4 py-2">Result</th>
                            <th className="px-4 py-2">Bet</th>
                            <th className="px-4 py-2">Win</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {history.slice().reverse().map((item) => (
                            <tr key={item.roundId} className="hover:bg-white/5 transition-colors">
                                <td className="px-4 py-3 font-bold text-white">
                                    <span
                                        className={`inline-block w-6 h-6 leading-6 text-center rounded-full mr-2 ${item.winningNumber === 0 ? 'bg-green-600' :
                                                [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(item.winningNumber) ? 'bg-red-600' : 'bg-neutral-800'
                                            }`}
                                    >
                                        {item.winningNumber}
                                    </span>
                                </td>
                                <td className="px-4 py-3">₹{item.totalBet}</td>
                                <td className={`px-4 py-3 font-bold ${item.totalWin > 0 ? 'text-green-400' : 'text-neutral-500'}`}>
                                    {item.totalWin > 0 ? `+₹${item.totalWin}` : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
