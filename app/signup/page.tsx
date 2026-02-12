"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context/GlobalContext";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useGlobalContext();
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                login(data.user);
                router.push("/");
            } else {
                setError(data.error || "Signup failed");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-black text-white">
            <div className="w-full max-w-md p-8 space-y-6 bg-zinc-900/50 rounded-2xl border border-white/10 backdrop-blur-xl">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold tracking-tighter">Create an account</h1>
                    <p className="text-zinc-400">Enter your email below to create your account</p>
                </div>
                <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="flex h-10 w-full rounded-md border border-zinc-800 bg-black px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:cursor-not-allowed disabled:opacity-50"
                            id="email"
                            placeholder="m@example.com"
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="flex h-10 w-full rounded-md border border-zinc-800 bg-black px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:cursor-not-allowed disabled:opacity-50"
                            id="password"
                            required
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 bg-white text-black hover:bg-zinc-200 h-10 w-full"
                        type="submit"
                    >
                        Sign Up
                    </button>
                </form>
                <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Link className="underline underline-offset-4 hover:text-primary" href="/login">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
