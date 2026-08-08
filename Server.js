const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(express.json());


/* =========================
   HOME / STATUS
========================= */

app.get("/", (req, res) => {
    res.json({
        name: "KRISHNAS AI",
        status: "Online",
        message: "KRISHNAS AI backend is running."
    });
});


/* =========================
   AI CHAT
========================= */

app.post("/api/chat", async (req, res) => {

    try {

        const { message } = req.body;

        if (!message || !message.trim()) {

            return res.status(400).json({
                error: "Message is required."
            });

        }


        const response = await openai.responses.create({

            model: "gpt-5.5",

            instructions:
                "You are KRISHNAS AI, a helpful, intelligent and friendly personal AI assistant. Give clear, accurate and useful answers. When solving mathematics, explain every step clearly.",

            input: message

        });


        res.json({
            reply: response.output_text
        });


    } catch (error) {

        console.error("KRISHNAS AI ERROR:", error);

        res.status(500).json({
            error: "KRISHNAS AI could not process the request."
        });

    }

});


/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {

    console.log(
        `KRISHNAS AI backend running on port ${PORT}`
    );

});