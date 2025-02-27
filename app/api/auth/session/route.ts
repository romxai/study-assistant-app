import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";
import { SafeUser } from "@/types/user";

export async function GET() {
  try {
    const sessionToken = cookies().get("session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ user: null });
    }

    const client = await clientPromise;
    const db = client.db("study-assistant");
    const sessions = db.collection("sessions");

    // Find valid session
    const session = await sessions.findOne({
      token: sessionToken,
      expiresAt: { $gt: new Date() },
    });

    if (!session) {
      return NextResponse.json({ user: null });
    }

    // Get user data
    const users = db.collection("users");
    const user = await users.findOne(
      { _id: session.userId },
      { projection: { password: 0 } } // Exclude password
    );

    if (!user) {
      return NextResponse.json({ user: null });
    }

    // Convert to SafeUser type
    const safeUser: SafeUser = {
      ...user,
      _id: user._id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json({ user: safeUser });
  } catch (error: any) {
    console.error("Session check error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
