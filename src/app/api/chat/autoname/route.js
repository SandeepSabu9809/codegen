// Example: app/api/chat/autoname/route.js
import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { chatId, firstMessage } = await req.json();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // or groq via openrouter
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: `Summarize this in 5 words or less as a title: ${firstMessage}` },
      ],
    });

    const title = completion.choices[0].message.content.trim();

    // Save to DB -> update chat.autoName
    // await Chat.updateOne({ _id: chatId }, { autoName: title });

    return NextResponse.json({ success: true, title });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
