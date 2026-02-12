"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Bet {
    id: string;
    game: string;
    details: string;
    amount: number;
    potentialWin: number;
    status: "active" | "completed" | "won" | "lost";
    timestamp: number;
}

export interface User {
    id: string;
    email: string;
    balance: number;
    totalDeposited: number;
    totalWon: number;
    totalLost: number;
}

interface GlobalContextType {
    balance: number;
    bets: Bet[];
    user: User | null;
    isLoading: boolean;
    login: (user: User) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
    placeBet: (bet: Omit<Bet, "id" | "timestamp" | "status">) => Promise<boolean>;
    updateBetStatus: (id: string, status: "won" | "lost", winAmount?: number) => Promise<void>;
    addTransaction: (amount: number, type: "DEPOSIT" | "WITHDRAWAL" | "BET" | "WIN", description: string) => Promise<boolean>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [bets, setBets] = useState<Bet[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Failed to fetch user:", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const login = (userData: User) => {
        setUser(userData);
    };

    const logout = async () => {
        // Implement logout API call if needed (to clear cookie) - for now just clear client state
        // Ideally call /api/auth/logout to clear cookie
        setUser(null);
        setBets([]);
        window.location.href = '/login'; // distinct redirect
    };

    const addTransaction = async (amount: number, type: "DEPOSIT" | "WITHDRAWAL" | "BET" | "WIN", description: string) => {
        if (!user) return false;
        try {
            const res = await fetch('/api/user/transaction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, type, description }),
            });
            const data = await res.json();
            if (res.ok) {
                // Update balance locally
                setUser(prev => prev ? { ...prev, balance: data.balance } : null);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Transaction failed:", error);
            return false;
        }
    };

    const placeBet = async (betData: Omit<Bet, "id" | "timestamp" | "status">) => {
        if (!user || user.balance < betData.amount) return false;

        const success = await addTransaction(betData.amount, 'BET', `Bet on ${betData.game}: ${betData.details}`);
        if (!success) return false;

        const newBet: Bet = {
            ...betData,
            id: Math.random().toString(36).substr(2, 9), // Temp ID until specific bet API
            status: "active",
            timestamp: Date.now(),
        };

        setBets((prev) => [newBet, ...prev]);
        return true;
    };

    const updateBetStatus = async (id: string, status: "won" | "lost", winAmount?: number) => {
        setBets((prev) => prev.map(bet => {
            if (bet.id === id) {
                return { ...bet, status };
            }
            return bet;
        }));

        if (status === "won" && winAmount) {
            await addTransaction(winAmount, 'WIN', `Won on game`);
        }
    };

    return (
        <GlobalContext.Provider
            value={{
                balance: user?.balance || 0,
                bets,
                user,
                isLoading,
                login,
                logout,
                refreshUser,
                placeBet,
                updateBetStatus,
                addTransaction
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
}

export function useGlobalContext() {
    const context = useContext(GlobalContext);
    if (context === undefined) {
        throw new Error("useGlobalContext must be used within a GlobalProvider");
    }
    return context;
}
