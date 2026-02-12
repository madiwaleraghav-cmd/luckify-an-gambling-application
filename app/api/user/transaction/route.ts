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
        const userResult = await db.query('SELECT balance FROM users WHERE id = $1', [userId]);
        const user = userResult.rows[0];

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
        const client = await db.connect();

        try {
            await client.query('BEGIN');

            // 1. Insert main transaction
            await client.query(`
                INSERT INTO transactions (id, userId, amount, type, description)
                VALUES ($1, $2, $3, $4, $5)
            `, [transactionId, userId, amount, type, description]);

            // 2. Update user stats and balance
            if (type === 'DEPOSIT') {
                await client.query('UPDATE users SET totalDeposited = totalDeposited + $1, balance = balance + $2 WHERE id = $3',
                    [amount, amount, userId]);

                // 3. Handle Bonus (20%)
                const bonusAmount = amount * 0.20;
                const bonusId = uuidv4();
                await client.query(`
                  INSERT INTO transactions (id, userId, amount, type, description)
                  VALUES ($1, $2, $3, $4, $5)
                `, [bonusId, userId, bonusAmount, 'BONUS', `20% Bonus on deposit of ${amount}`]);

                await client.query('UPDATE users SET balance = balance + $1 WHERE id = $2', [bonusAmount, userId]);

            } else if (type === 'BET') {
                await client.query('UPDATE users SET balance = balance - $1, totalLost = totalLost + $2 WHERE id = $3',
                    [amount, amount, userId]);
            } else if (type === 'WIN') {
                await client.query('UPDATE users SET totalWon = totalWon + $1, balance = balance + $2 WHERE id = $3',
                    [amount, amount, userId]);
            } else if (type === 'WITHDRAWAL') {
                await client.query('UPDATE users SET balance = balance - $1 WHERE id = $2', [amount, userId]);
            }

            await client.query('COMMIT');
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }

        const updatedUserResult = await db.query('SELECT balance FROM users WHERE id = $1', [userId]);
        const updatedUser = updatedUserResult.rows[0];

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

        const result = await db.query(`
      SELECT * FROM transactions 
      WHERE userId = $1 
      ORDER BY createdAt DESC 
      LIMIT $2
    `, [session.userId, limit]);

        return NextResponse.json({ transactions: result.rows });
    } catch (error) {
        console.error('Get transactions error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
