import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { SafeUser } from "@/types/user";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("study-assistant");
    const users = db.collection("users");

    // Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const now = new Date();
    const result = await users.insertOne({
      email,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    });

    // Create session
    const sessions = db.collection("sessions");
    const token = crypto.randomUUID();
    await sessions.insertOne({
      userId: result.insertedId,
      token,
      createdAt: now,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    // Get created user without password
    const user = await users.findOne(
      { _id: result.insertedId },
      { projection: { password: 0 } }
    );

    // Convert to SafeUser type
    const safeUser: SafeUser = {
      ...user,
      _id: user._id.toString(),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // Set session cookie
    const response = NextResponse.json({ user: safeUser }, { status: 201 });
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
