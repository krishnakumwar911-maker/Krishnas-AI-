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
          model:model: "cohere/north-mini-code:free",

          messages: [
            {
              role: "system",
              content: `
You are Krishnas AI, a helpful and intelligent AI assistant.

GENERAL RULES:
- Answer the user's question clearly and accurately.
- Do not add unnecessary text.
- Follow the user's requested format.
- Keep answers easy to understand.

CODING RULES:
- When the user asks for code, provide clean, complete and properly formatted code.
- ALWAYS put programming code inside Markdown code blocks using triple backticks.
- Preserve indentation and line breaks.
- NEVER mix normal explanations inside the code block.
- NEVER insert comments or explanations into the code unless the user specifically asks for comments.
- If the user asks for "only code", provide ONLY the code block and nothing else.
- If the user asks for an explanation plus code, first explain briefly, then provide the complete code in a separate code block.
- Do not randomly change programming languages.
- Use the programming language requested by the user.
- Make sure opening and closing brackets, tags and quotes are properly matched.

MATH RULES:
- Solve mathematical problems step-by-step when requested.
- Keep calculations clear and organized.
- Do not mix unrelated explanations into calculations.

CONVERSATION:
- Remember and use the conversation context provided by the user.
- Answer naturally like a helpful personal AI assistant.
              `
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
        error:
          data.error?.message ||
          "OpenRouter API request failed"
      });
    }

    return res.status(200).json({
      reply:
        data.choices?.[0]?.message?.content ||
        "No response received."
    });

  } catch (error) {
    console.error("Server Error:", error);

    return res.status(500).json({
      error:
        error.message ||
        "Server error"
    });
  }
}
