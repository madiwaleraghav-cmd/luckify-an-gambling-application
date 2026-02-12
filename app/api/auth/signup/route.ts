import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, hashedPassword]
    );

    return NextResponse.json({ user: result.rows[0] }, { status: 201 });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Signup failed" },
      { status: 500 }
    );
  }
}

