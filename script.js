// Seleccionar elementos del DOM
const inputField = document.querySelector(".chatbot-input input");
const sendButton = document.querySelector(".chatbot-input button");
const messagesContainer = document.querySelector(".chatbot-messages");

// Función para añadir un mensaje al contenedor
function addMessage(content, isUser = false) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("chatbot-message");
    if (isUser) messageDiv.classList.add("user");
    messageDiv.textContent = content;
    messagesContainer.appendChild(messageDiv);

    // Desplazar el contenedor hacia abajo
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Función para procesar el mensaje del usuario
async function sendMessage() {
    const userInput = inputField.value.trim();

    if (userInput === "") return; // Validar que no esté vacío

    // Añadir mensaje del usuario al contenedor
    addMessage(userInput, true);

    // Limpiar el campo de entrada
    inputField.value = "";

    // Mostrar mensaje de carga
    const loadingMessage = addMessage("ChefBot está pensando...");
    
    try {
        // Realizar la solicitud a la API de OpenAI
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "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" // Cambia esto por tu API key
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: userInput }]
            })
        });

        const data = await response.json();

        // Eliminar mensaje de carga
        messagesContainer.removeChild(messagesContainer.lastChild);

        if (response.ok) {
            // Añadir respuesta del chatbot
            const botMessage = data.choices[0].message.content;
            addMessage(botMessage);
        } else {
            addMessage("Hubo un error al obtener la respuesta. Intenta nuevamente.");
            console.error(data);
        }
    } catch (error) {
        // Manejo de errores
        messagesContainer.removeChild(messagesContainer.lastChild);
        addMessage("Hubo un problema al conectar con el servidor. Por favor, inténtalo más tarde.");
        console.error(error);
    }
}

// Event Listeners
sendButton.addEventListener("click", sendMessage);
inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});
