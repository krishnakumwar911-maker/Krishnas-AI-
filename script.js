/* =========================================
   KRISHNAS AI — FRONTEND CONTROLLER
   Chat Memory + Backend Ready
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const chatArea = document.getElementById("chatArea");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const voiceBtn = document.getElementById("voiceBtn");
const attachBtn = document.querySelector(".attach-btn");
const actionCards = document.querySelectorAll(".action-card");
const menuBtn = document.getElementById("menuBtn");


/* =========================================
   CONFIGURATION
========================================= */

const API_URL = "/api/chat";

const MEMORY_KEY = "krishnas_ai_memory";


/* =========================================
   CHAT MEMORY
========================================= */

let chatMemory = JSON.parse(
    localStorage.getItem(MEMORY_KEY) || "[]"
);


/* =========================================
   SAVE MEMORY
========================================= */

function saveMemory() {

    localStorage.setItem(
        MEMORY_KEY,
        JSON.stringify(chatMemory)
    );

}


/* =========================================
   ADD MESSAGE TO SCREEN
========================================= */

function addMessage(text, type) {

    const message = document.createElement("div");

    message.classList.add("message");

    if (type === "user") {

        message.classList.add("user-message");

    } else {

        message.classList.add("ai-message");

    }

    message.textContent = text;

    chatArea.appendChild(message);

    chatArea.scrollTop = chatArea.scrollHeight;

    return message;
}


/* =========================================
   LOAD OLD CHAT ON PAGE LOAD
========================================= */

function loadChatMemory() {

    chatMemory.forEach((item) => {

        addMessage(
            item.text,
            item.role === "user" ? "user" : "ai"
        );

    });

}


/* =========================================
   TYPING INDICATOR
========================================= */

function showTyping() {

    const typing = document.createElement("div");

    typing.className = "message ai-message";

    typing.id = "typing-message";

    typing.innerHTML = `
        <span>Krishnas AI is thinking...</span>
    `;

    chatArea.appendChild(typing);

    chatArea.scrollTop = chatArea.scrollHeight;
}


/* =========================================
   REMOVE TYPING
========================================= */

function removeTyping() {

    const typing =
        document.getElementById("typing-message");

    if (typing) {

        typing.remove();

    }

}


/* =========================================
   BUILD CONVERSATION CONTEXT
========================================= */

function buildConversationContext() {

    let context = "";

    chatMemory.forEach((item) => {

        if (item.role === "user") {

            context += `User: ${item.text}\n`;

        }

        else if (item.role === "assistant") {

            context += `Krishnas AI: ${item.text}\n`;

        }

    });

    return context;

}


/* =========================================
   SEND MESSAGE
========================================= */

async function sendMessage() {

    const message = userInput.value.trim();

    if (!message) {

        return;

    }


    /* -----------------------------
       SHOW USER MESSAGE
    ----------------------------- */

    addMessage(message, "user");

    userInput.value = "";


    /* -----------------------------
       SAVE USER MESSAGE
    ----------------------------- */

    chatMemory.push({

        role: "user",

        text: message

    });

    saveMemory();


    /* -----------------------------
       SHOW TYPING
    ----------------------------- */

    showTyping();


    try {

        /* -----------------------------
           BUILD MEMORY CONTEXT
        ----------------------------- */

        const conversation =
            buildConversationContext();


        /* -----------------------------
           SEND TO BACKEND
        ----------------------------- */

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                message: `
You are Krishnas AI.

Use the conversation history below to understand the user's context.

Conversation History:
${conversation}

Current User Message:
${message}

Answer the current user naturally and helpfully.
                `

            })

        });


        /* -----------------------------
           CHECK RESPONSE
        ----------------------------- */

        if (!response.ok) {

            throw new Error(
                `Backend error: ${response.status}`
            );

        }


        const data = await response.json();


        /* -----------------------------
           REMOVE TYPING
        ----------------------------- */

        removeTyping();


        /* -----------------------------
           AI REPLY
        ----------------------------- */

        const reply =
            data.reply ||
            "I received your message.";


        addMessage(
            reply,
            "ai"
        );


        /* -----------------------------
           SAVE AI REPLY
        ----------------------------- */

        chatMemory.push({

            role: "assistant",

            text: reply

        });


        saveMemory();


    }

    catch (error) {

        removeTyping();


        addMessage(

            "I'm having trouble connecting to the AI backend right now.",

            "ai"

        );


        console.error(
            "Backend connection:",
            error
        );

    }

}


/* =========================================
   SEND BUTTON
========================================= */

sendBtn.addEventListener(

    "click",

    sendMessage

);


/* =========================================
   ENTER KEY
========================================= */

userInput.addEventListener(

    "keydown",

    (event) => {

        if (

            event.key === "Enter" &&

            !event.shiftKey

        ) {

            event.preventDefault();

            sendMessage();

        }

    }

);


/* =========================================
   QUICK ACTIONS
========================================= */

actionCards.forEach(

    (card) => {

        card.addEventListener(

            "click",

            () => {

                const title =
                    card.querySelector(
                        "strong"
                    ).textContent;


                if (title === "Math") {

                    userInput.value =
                        "Solve this mathematics problem step-by-step: ";

                }


                else if (title === "Code") {

                    userInput.value =
                        "Help me write and explain this code: ";

                }


                else if (title === "Vision") {

                    userInput.value =
                        "Analyze this image: ";

                }


                else if (title === "Search") {

                    userInput.value =
                        "Search and explain this topic: ";

                }


                userInput.focus();

            }

        );

    }

);


/* =========================================
   VOICE INPUT
========================================= */

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (SpeechRecognition) {


    const recognition =
        new SpeechRecognition();


    recognition.lang = "en-IN";

    recognition.continuous = false;

    recognition.interimResults = false;


    voiceBtn.addEventListener(

        "click",

        () => {

            recognition.start();

            voiceBtn.textContent = "🔴";

        }

    );


    recognition.onresult =

        (event) => {

            const transcript =
                event.results[0][0]
                .transcript;


            userInput.value =
                transcript;


            voiceBtn.textContent =
                "🎙️";

        };


    recognition.onerror =

        () => {

            voiceBtn.textContent =
                "🎙️";

        };


    recognition.onend =

        () => {

            voiceBtn.textContent =
                "🎙️";

        };


}


else {


    voiceBtn.addEventListener(

        "click",

        () => {

            addMessage(

                "Voice input is not supported by this browser.",

                "ai"

            );

        }

    );

}


/* =========================================
   ATTACH BUTTON
========================================= */

attachBtn.addEventListener(

    "click",

    () => {

        addMessage(

            "File and image upload will be connected in the next stage.",

            "ai"

        );

    }

);


/* =========================================
   MENU BUTTON
========================================= */

menuBtn.addEventListener(

    "click",

    () => {

        addMessage(

            "Krishnas AI settings will be available here.",

            "ai"

        );

    }

);


/* =========================================
   STARTUP
========================================= */

loadChatMemory();
