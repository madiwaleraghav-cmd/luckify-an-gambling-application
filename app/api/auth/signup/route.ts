import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        // Check if user exists
        const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();

        // Create user
        try {
            const stmt = db.prepare(`
        INSERT INTO users (id, email, password, balance, totalDeposited, totalWon, totalLost)
        VALUES (?, ?, ?, 500.0, 0, 0, 0)
      `);
            stmt.run(userId, email, hashedPassword);
        } catch (e) {
            console.error("DB Insert Error:", e);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        // Create session
        const token = await signToken({ userId, email });
        const cookieStore = await cookies();
        cookieStore.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        return NextResponse.json({ success: true, user: { id: userId, email, balance: 500.0 } });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
