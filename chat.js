// 將回覆訊息加入聊天框中
function appendMessage(message, isUser) {
    var chatbox = document.getElementById('chatbox');
    var messageClass = isUser ? 'user-message' : 'bot-message';
    var messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', messageClass);
    messageElement.textContent = message;
    chatbox.appendChild(messageElement);
    chatbox.scrollTop = chatbox.scrollHeight;
}

// 發送使用者輸入的訊息
function sendMessage() {
    var userInput = document.getElementById('userInput');
    var userMessage = userInput.value.trim();

    if (userMessage !== '') {
        // 將使用者輸入的訊息加入聊天框
        appendMessage('You: ' + userMessage, true);

        // 發送API請求，並處理回傳結果
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://earl.cognitiveservices.azure.com/language/:analyze-conversations?api-version=2022-10-01-preview'); // 替換為正確的 Azure Language 服務的 API 端點 URL
        xhr.setRequestHeader('Ocp-Apim-Subscription-Key', 'a865f1c5ff604efa9b991d3c335092ae'); // 替換為您的 Azure Language 服務的 API 金鑰
        xhr.setRequestHeader('Apim-Request-Id', '4ffcac1c-b2fc-48ba-bd6d-b69d9942995a'); // 替換為您的請求 ID
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    var botReply = response.result.prediction.topIntent;

                    // 將機器人回覆的訊息加入聊天框
                    appendMessage('Bot: ' + botReply, false);
                } else {
                    appendMessage('Error: ' + xhr.status, false);
                }
            }
        };

        var payload = {
            "kind": "Conversation",
            "analysisInput": {
                "conversationItem": {
                    "id": "1",
                    "text": userMessage,
                    "modality": "text",
                    "participantId": "user1"
                }
            },
            "parameters": {
                "projectName": "0719", // 替換為您的專案名稱
                "verbose": true,
                "deploymentName": "0719" // 替換為您的部署名稱
            }
        };

        xhr.send(JSON.stringify(payload));

        // 清空使用者輸入的訊息
        userInput.value = '';
    }
}

// 監聽使用者按下Enter鍵的事件
document.getElementById('userInput').addEventListener('keypress', function(event) {
    if (event.keyCode === 13) {
        sendMessage();
    }
});
