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
      "https://api.deepseek.com/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
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
      console.error("DeepSeek API Error:", data);

      return res.status(response.status).json({
        error: data.error?.message || "DeepSeek API request failed"
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
