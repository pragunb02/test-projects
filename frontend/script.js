// let lastMessageId = -1;

// function pollMessages() {
//     fetch(`http://localhost:3000/poll?lastId=${lastMessageId}`)
//         .then(response => response.json())
//         .then(messages => {
//             if (messages.length > 0) {
//                 messages.forEach(displayMessage);
//                 lastMessageId += messages.length;
//             }
//             pollMessages(); // Poll again immediately
//         })
//         .catch(error => {
//             console.error('Polling error:', error);
//             setTimeout(pollMessages, 5000); // Retry after 5 seconds on error
//         });
// }

// function displayMessage(message) {
//     const chatMessages = document.getElementById('chat-messages');
//     const messageElement = document.createElement('p');
//     messageElement.textContent = message;
//     chatMessages.appendChild(messageElement);
//     chatMessages.scrollTop = chatMessages.scrollHeight;
// }

// function sendMessage() {
//     const input = document.getElementById('message-input');
//     const message = input.value.trim();
//     if (message) {
//         fetch('http://localhost:3000/send', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ message }),
//         })
//         .then(response => {
//             if (response.ok) {
//                 input.value = '';
//             } else {
//                 console.error('Failed to send message');
//             }
//         })
//         .catch(error => console.error('Error:', error));
//     }
// }

// // Start polling for messages
// pollMessages();

let lastMessageId = -1;
let currentUser = null;
let typingTimeout;

function login() {
  const username = document.getElementById('username-input').value;
  fetchWithRetry('http://localhost:3000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username })
  })
  .then(data => {
    currentUser = data;
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('chat-container').style.display = 'block';
    fetchHistory();
    pollMessages();
    pollTypingIndicators();
  })
  .catch(error => {
    console.error('Login failed:', error);
    alert('Failed to login. Please try again.');
  });
}

function fetchHistory() {
  fetchWithRetry('http://localhost:3000/history?limit=50')
    .then(messages => {
      messages.forEach(displayMessage);
      lastMessageId = chatMessages.length - 1;
    })
    .catch(error => {
      console.error('Failed to fetch history:', error);
    });
}

function pollMessages() {
  fetchWithRetry(`http://localhost:3000/poll?lastId=${lastMessageId}`)
    .then(messages => {
      if (messages.length > 0) {
        messages.forEach(displayMessage);
        lastMessageId += messages.length;
      }
      pollMessages(); // Poll again immediately
    })
    .catch(error => {
      console.error('Polling error:', error);
      setTimeout(pollMessages, 5000); // Retry after 5 seconds on error
    });
}

function displayMessage(message) {
  const chatMessages = document.getElementById('chat-messages');
  const messageElement = document.createElement('p');
  messageElement.textContent = `${message.username}: ${message.message}`;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById('message-input');
  const message = input.value.trim();
  if (message && currentUser) {
    fetchWithRetry('http://localhost:3000/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.userId, message }),
    })
    .then(response => {
      if (response.ok) {
        input.value = '';
      } else {
        console.error('Failed to send message');
      }
    })
    .catch(error => console.error('Error:', error));
  }
}

function sendTypingIndicator(isTyping) {
  fetchWithRetry('http://localhost:3000/typing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: currentUser.userId, isTyping })
  })
  .catch(error => console.error('Error sending typing indicator:', error));
}

function pollTypingIndicators() {
  fetchWithRetry('http://localhost:3000/typing')
    .then(typingUsers => {
      const typingIndicator = document.getElementById('typing-indicator');
      if (typingUsers.length > 0) {
        typingIndicator.textContent = `${typingUsers.join(', ')} is typing...`;
      } else {
        typingIndicator.textContent = '';
      }
      setTimeout(pollTypingIndicators, 2000);
    })
    .catch(error => {
      console.error('Error polling typing indicators:', error);
      setTimeout(pollTypingIndicators, 5000);
    });
}

document.getElementById('message-input').addEventListener('input', () => {
  clearTimeout(typingTimeout);
  sendTypingIndicator(true);
  typingTimeout = setTimeout(() => sendTypingIndicator(false), 1000);
});

function fetchWithRetry(url, options, maxRetries = 3) {
  return fetch(url, options)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      if (maxRetries > 0) {
        console.log(`Retrying... (${maxRetries} attempts left)`);
        return fetchWithRetry(url, options, maxRetries - 1);
      }
      throw error;
    });
}

// Start the login process
document.getElementById('login-button').addEventListener('click', login);