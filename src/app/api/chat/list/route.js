import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Chat from "@/models/Chat";

export async function GET(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return NextResponse.json({ success: false, message: "User not authenticated" });

    await connectDB();

    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });

    const response = chats.map(chat => ({
      _id: chat._id,
      name: chat.name || "",
      autoName: chat.autoName || "",
      // optional: preview from first message or last message
      preview: chat.messages?.[0]?.content?.slice(0, 60) || ""
    }));

    return NextResponse.json({ success: true, chats: response });
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
