/* =========================================
   KRISHNAS AI — FRONTEND CONTROLLER
   Backend-ready architecture
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

// बाद में हमारा अपना backend इस URL पर होगा.
// अभी इसे बदलने की जरूरत नहीं है.
const API_URL = "/api/chat";


/* =========================================
   CHAT FUNCTIONS
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


function removeTyping() {

    const typing = document.getElementById("typing-message");

    if (typing) {
        typing.remove();
    }
}


/* =========================================
   SEND MESSAGE
========================================= */

async function sendMessage() {

    const message = userInput.value.trim();

    if (!message) {
        return;
    }

    addMessage(message, "user");

    userInput.value = "";

    showTyping();

    try {

        /*
         * अभी backend बनाया नहीं गया है।
         *
         * Backend बनने के बाद यही request
         * हमारे AI server को message भेजेगी.
         */

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })

        });


        if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server error: ${response.status}`);
        }
        }


        const data = await response.json();

        removeTyping();

        addMessage(
            data.reply || "I received your message.",
            "ai"
        );


    } catch (error) {

        removeTyping();

        addMessage(
    "AI Error: " + error.message,
    "ai"
);

        console.log("Backend connection:", error);

    }

}


/* =========================================
   SEND BUTTON
========================================= */

sendBtn.addEventListener("click", sendMessage);


/* =========================================
   ENTER KEY
========================================= */

userInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter" && !event.shiftKey) {

        event.preventDefault();

        sendMessage();

    }

});


/* =========================================
   QUICK ACTIONS
========================================= */

actionCards.forEach((card) => {

    card.addEventListener("click", () => {

        const title = card.querySelector("strong").textContent;

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

    });

});


/* =========================================
   VOICE INPUT
========================================= */

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

if (SpeechRecognition) {

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;


    voiceBtn.addEventListener("click", () => {

        recognition.start();

        voiceBtn.textContent = "🔴";

    });


    recognition.onresult = (event) => {

        const transcript =
            event.results[0][0].transcript;

        userInput.value = transcript;

        voiceBtn.textContent = "🎙️";

    };


    recognition.onerror = () => {

        voiceBtn.textContent = "🎙️";

    };


    recognition.onend = () => {

        voiceBtn.textContent = "🎙️";

    };

} else {

    voiceBtn.addEventListener("click", () => {

        addMessage(
            "Voice input is not supported by this browser.",
            "ai"
        );

    });

}


/* =========================================
   ATTACH BUTTON
========================================= */

attachBtn.addEventListener("click", () => {

    addMessage(
        "File and image upload will be connected to the backend in the next stage.",
        "ai"
    );

});


/* =========================================
   MENU BUTTON
========================================= */

menuBtn.addEventListener("click", () => {

    addMessage(
        "Krishnas AI settings will be available here.",
        "ai"
    );

});
