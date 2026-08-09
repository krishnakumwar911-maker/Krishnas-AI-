export default async function handler(req, res) {
  try {
    const hasKey = !!process.env.OPENAI_API_KEY;

    return res.status(200).json({
      reply: hasKey
        ? "OPENAI_API_KEY is available"
        : "OPENAI_API_KEY is missing"
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
