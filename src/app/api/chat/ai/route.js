import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import Chat from "../../../../models/Chat"
import connectDB from "../../../../config/db"

// Initialize OpenAI/OpenRouter
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    const { chatId, prompt } = await req.json();

    if (!userId) return NextResponse.json({ success: false, message: "User not authenticated" });
    if (!prompt || prompt.trim() === "") return NextResponse.json({ success: false, message: "Prompt cannot be empty" });

    await connectDB();
    const chat = await Chat.findOne({ userId, _id: chatId });
    if (!chat) return NextResponse.json({ success: false, message: "Chat not found" });

    // Add user message
    const userPrompt = { role: "user", content: prompt, timestamp: Date.now() };
    chat.messages.push(userPrompt);

    // --- 1️⃣ Limit messages to last 10 for token control ---
    const recentMessages = chat.messages.slice(-10).map(m => ({ role: m.role, content: m.content }));

    // --- 2️⃣ Set max_tokens explicitly to avoid 402 errors ---
    const completion = await openai.chat.completions.create({
     //model: "google/gemini-2.5-flash",
     model: "deepseek/deepseek-chat-v3.1",

      messages: recentMessages,
      max_tokens: 500, // adjust i needed, must be under account limit
    });

    // --- 3️⃣ Check for empty response ---
    if (!completion.choices || completion.choices.length === 0 || !completion.choices[0].message) {
      return NextResponse.json({ success: false, message: "AI returned empty response" });
    }

    const aiMessage = {
      role: completion.choices[0].message.role,
      content: completion.choices[0].message.content,
      timestamp: Date.now(),
    };

    // Add AI response to chat and save
    chat.messages.push(aiMessage);
    await chat.save();

    // Return the AI message
    // return NextResponse.json({ success: true, data: aiMessage });

    // --- AUTONAME: generate title if user hasn't named it and no autoName yet
    if ((!chat.name || chat.name.trim() === "") && (!chat.autoName || chat.autoName.trim() === "")) {
      try {
        // Send a short prompt to the LLM to produce a concise title
        const titleResp = await openai.chat.completions.create({
          //model: "google/gemini-2.5-flash",
          model: "deepseek/deepseek-chat-v3.1",
          messages: [
            { role: "system", content: "You are a concise title generator. Produce a short chat title (3-6 words) summarizing the conversation. Return title only, no punctuation, no extra text." },
            { role: "user", content: `User: ${prompt}\nAssistant: ${completion.choices[0].message.content}` },
          ],
          max_tokens: 20,
        });

        const rawTitle = titleResp.choices?.[0]?.message?.content || "";
        // cleanup: keep only plain text, remove quotes and trailing punctuation
        const title = rawTitle.trim().replace(/(^"|"$)/g, "").replace(/[.?!]$/g, "").slice(0, 80);

        if (title) {
          chat.autoName = title;
        }
      } catch (err) {
        console.error("Autoname error:", err);
        // continue even if autoname fails
      }
    }

    await chat.save();

    return NextResponse.json({ success: true, data: aiMessage, autoName: chat.autoName || null });


  } catch (error) {
    console.error("AI API error:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
