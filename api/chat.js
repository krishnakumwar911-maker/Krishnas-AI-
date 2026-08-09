import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    return res.status(200).json({
      reply: "OpenAI package initialized successfully!"
    });

  } catch (error) {
    console.error("OPENAI INIT ERROR:", error);

    return res.status(500).json({
      error: error.message
    });
  }
}
