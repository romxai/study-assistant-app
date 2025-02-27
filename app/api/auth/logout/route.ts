import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";

export async function POST() {
  try {
    const sessionToken = cookies().get("session")?.value;

    if (sessionToken) {
      const client = await clientPromise;
      const db = client.db("study-assistant");
      const sessions = db.collection("sessions");

      // Delete the session
      await sessions.deleteOne({ token: sessionToken });
    }

    // Clear the session cookie
    const response = NextResponse.json({ message: "Logged out successfully" });
    response.cookies.delete("session");

    return response;
  } catch (error: any) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
