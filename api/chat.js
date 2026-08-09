export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://krishnas-ai.vercel.app",
          "X-Title": "Krishnas AI"
        },

        body: JSON.stringify({
          model: "nvidia/nemotron-nano-9b-v2:free",
          messages: [
            {
              role: "system",
              content: "You are Krishnas AI, a helpful personal AI assistant."
            },
            {
              role: "user",
              content: message
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter API Error:", data);

      return res.status(response.status).json({
        error: data.error?.message || "OpenRouter API request failed"
      });
    }

    return res.status(200).json({
      reply: data.choices?.[0]?.message?.content || "No response received."
    });

  } catch (error) {
    console.error("Server Error:", error);

    return res.status(500).json({
      error: error.message || "Server error"
    });
  }
}
