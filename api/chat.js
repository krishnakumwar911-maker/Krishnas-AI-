import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { message } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Krishnas AI, a helpful AI assistant. Answer clearly and accurately. For mathematics, explain step by step. For coding, provide useful working code.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "I could not generate a response.";

    return res.status(200).json({
      reply,
    });
  } catch (error) {
    console.error("AI ERROR:", error);

    return res.status(500).json({
      error: "AI response failed",
    });
  }
}
