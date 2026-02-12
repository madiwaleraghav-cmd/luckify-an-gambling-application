import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { amount, type, description } = await req.json();

        if (!amount || !type) {
            return NextResponse.json({ error: 'Amount and type are required' }, { status: 400 });
        }

        const userId = session.userId;
        const user = db.prepare('SELECT balance FROM users WHERE id = ?').get(userId) as { balance: number } | undefined;

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Determine balance change
        let balanceChange = 0;

        // Validation for sufficient funds
        if (type === 'BET' || type === 'WITHDRAWAL') {
            if (user.balance < amount) {
                return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 });
            }
            balanceChange = -Math.abs(amount);
        } else {
            balanceChange = Math.abs(amount);
        }

        const transactionId = uuidv4();

        // Use a transaction for atomicity
        const runTransaction = db.transaction(() => {
            // 1. Insert main transaction
            db.prepare(`
        INSERT INTO transactions (id, userId, amount, type, description)
        VALUES (?, ?, ?, ?, ?)
      `).run(transactionId, userId, amount, type, description);

            // 2. Update user stats and balance
            if (type === 'DEPOSIT') {
                db.prepare('UPDATE users SET totalDeposited = totalDeposited + ?, balance = balance + ? WHERE id = ?')
                    .run(amount, amount, userId);

                // 3. Handle Bonus (20%)
                const bonusAmount = amount * 0.20;
                const bonusId = uuidv4();
                db.prepare(`
          INSERT INTO transactions (id, userId, amount, type, description)
          VALUES (?, ?, ?, ?, ?)
        `).run(bonusId, userId, bonusAmount, 'BONUS', `20% Bonus on deposit of ${amount}`);

                db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?')
                    .run(bonusAmount, userId);

            } else if (type === 'BET') {
                db.prepare('UPDATE users SET balance = balance - ?, totalLost = totalLost + ? WHERE id = ?')
                    .run(amount, amount, userId); // Assuming bet is lost until win? Or just separate Bet vs Win?
                // Actually, usually Bet decreases balance. Win increases. Net is tracked.
                // "totalLost" usually aggregates net losses. Here I'll just track total wagered?
                // User asked "loosing amount should be added". Maybe sum of all BETs that didn't result in WIN?
                // Simplest: track total bets placed as potential loss.
            } else if (type === 'WIN') {
                db.prepare('UPDATE users SET totalWon = totalWon + ?, balance = balance + ? WHERE id = ?')
                    .run(amount, amount, userId);
            } else if (type === 'WITHDRAWAL') {
                db.prepare('UPDATE users SET balance = balance - ? WHERE id = ?')
                    .run(amount, userId);
            }
        });

        runTransaction();

        const updatedUser = db.prepare('SELECT balance FROM users WHERE id = ?').get(userId) as { balance: number };
        return NextResponse.json({ success: true, balance: updatedUser.balance });

    } catch (error) {
        console.error('Transaction error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const limit = searchParams.get('limit') || 50;

        const transactions = db.prepare(`
      SELECT * FROM transactions 
      WHERE userId = ? 
      ORDER BY createdAt DESC 
      LIMIT ?
    `).all(session.userId, limit);

        return NextResponse.json({ transactions });
    } catch (error) {
        console.error('Get transactions error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
