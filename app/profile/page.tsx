"use client";

import { useEffect, useState } from "react";
import { useGlobalContext } from "@/context/GlobalContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Transaction {
    id: string;
    amount: number;
    type: string;
    description: string;
    createdAt: string;
}

export default function Profile() {
    const { user, isLoading } = useGlobalContext();
    const router = useRouter();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loadingTransactions, setLoadingTransactions] = useState(true);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        if (user) {
            fetch("/api/user/transaction?limit=20")
                .then((res) => res.json())
                .then((data) => {
                    if (data.transactions) {
                        setTransactions(data.transactions);
                    }
                })
                .finally(() => setLoadingTransactions(false));
        }
    }, [user]);

    if (isLoading || !user) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-black text-white p-6 pt-24">
            <div className="max-w-4xl mx-auto space-y-8">
                <Link href="/" className="inline-flex items-center text-zinc-400 hover:text-white transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                </Link>

                <div className="flex items-center space-x-4">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-3xl font-bold">
                        {user.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{user.email}</h1>
                        <p className="text-zinc-400">User ID: {user.id}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-6 rounded-xl bg-zinc-900/50 border border-white/10">
                        <h3 className="text-sm font-medium text-zinc-400">Current Balance</h3>
                        <p className="text-2xl font-bold mt-2">₹{user.balance.toFixed(2)}</p>
                    </div>
                    <div className="p-6 rounded-xl bg-zinc-900/50 border border-white/10">
                        <h3 className="text-sm font-medium text-zinc-400">Total Deposited</h3>
                        <p className="text-2xl font-bold mt-2 text-green-400">₹{user.totalDeposited.toFixed(2)}</p>
                    </div>
                    <div className="p-6 rounded-xl bg-zinc-900/50 border border-white/10">
                        <h3 className="text-sm font-medium text-zinc-400">Total Winnings</h3>
                        <p className="text-2xl font-bold mt-2 text-blue-400">₹{user.totalWon.toFixed(2)}</p>
                    </div>
                    <div className="p-6 rounded-xl bg-zinc-900/50 border border-white/10">
                        <h3 className="text-sm font-medium text-zinc-400">Total Bets/Losses</h3>
                        <p className="text-2xl font-bold mt-2 text-red-400">₹{user.totalLost.toFixed(2)}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-bold">Transaction History</h2>
                    <div className="rounded-xl border border-white/10 overflow-hidden">
                        {loadingTransactions ? (
                            <div className="p-8 text-center text-zinc-500">Loading transactions...</div>
                        ) : transactions.length === 0 ? (
                            <div className="p-8 text-center text-zinc-500">No transactions found</div>
                        ) : (
                            <table className="w-full text-left text-sm">
                                <thead className="bg-zinc-900 text-zinc-400">
                                    <tr>
                                        <th className="p-4 font-medium">Type</th>
                                        <th className="p-4 font-medium">Description</th>
                                        <th className="p-4 font-medium">Amount</th>
                                        <th className="p-4 font-medium text-right">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {transactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-zinc-900/30 transition-colors">
                                            <td className="p-4 font-medium">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${tx.type === 'DEPOSIT' || tx.type === 'WIN' || tx.type === 'BONUS'
                                                        ? 'bg-green-500/10 text-green-400'
                                                        : 'bg-red-500/10 text-red-400'
                                                    }`}>
                                                    {tx.type}
                                                </span>
                                            </td>
                                            <td className="p-4 text-zinc-300">{tx.description}</td>
                                            <td className={`p-4 font-bold ${tx.type === 'DEPOSIT' || tx.type === 'WIN' || tx.type === 'BONUS'
                                                    ? 'text-green-400'
                                                    : 'text-red-400'
                                                }`}>
                                                {tx.type === 'BET' || tx.type === 'WITHDRAWAL' ? '-' : '+'}₹{tx.amount.toFixed(2)}
                                            </td>
                                            <td className="p-4 text-right text-zinc-500">
                                                {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
