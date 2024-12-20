// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const path = require('path');

// const app = express();
// const port = 3000;

// app.use(bodyParser.json());
// app.use(cors());

// const chatMessages = [];
// const waitingClients = [];

// app.get('/poll', (req, res) => {
//   const lastMessageId = parseInt(req.query.lastId) || -1;
  
//   if (chatMessages.length > lastMessageId + 1) {
//     // New messages available
//     res.json(chatMessages.slice(lastMessageId + 1));
//   } else {
//     // No new messages, hold the request
//     const client = {
//       res: res,
//       lastMessageId: lastMessageId
//     };
//     waitingClients.push(client);
    
//     // Set a timeout to release the connection after 30 seconds
//     setTimeout(() => {
//       const index = waitingClients.indexOf(client);
//       if (index > -1) {
//         waitingClients.splice(index, 1);
//         res.json([]);
//       }
//     }, 30000);
//   }
// });

// app.post('/send', (req, res) => {
//   const message = req.body.message;
//   chatMessages.push(message);
  
//   // Respond to waiting clients
//   waitingClients.forEach(client => {
//     client.res.json(chatMessages.slice(client.lastMessageId + 1));
//   });
//   waitingClients.length = 0;
  
//   res.sendStatus(200);
// });

// // Serve static files from the frontend directory
// app.use(express.static(path.join(__dirname, '../frontend')));

// app.listen(port, () => {
//   console.log(`Chat server running at http://localhost:${port}`);
// });


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const rateLimit = require("express-rate-limit");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

const chatMessages = [];
const waitingClients = [];
const users = new Map();
const typingUsers = new Set();

app.post('/login', (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }
  const userId = Math.random().toString(36).substr(2, 9);
  users.set(userId, username);
  res.json({ userId, username });
});

app.get('/poll', (req, res) => {
  const lastMessageId = parseInt(req.query.lastId) || -1;
  
  if (chatMessages.length > lastMessageId + 1) {
    // New messages available
    res.json(chatMessages.slice(lastMessageId + 1));
  } else {
    // No new messages, hold the request
    const client = {
      res: res,
      lastMessageId: lastMessageId
    };
    waitingClients.push(client);
    
    // Set a timeout to release the connection after 30 seconds
    setTimeout(() => {
      const index = waitingClients.indexOf(client);
      if (index > -1) {
        waitingClients.splice(index, 1);
        res.json([]);
      }
    }, 30000);
  }
});

app.post('/send', (req, res) => {
  const { userId, message } = req.body;
  const username = users.get(userId);
  if (!username) {
    return res.status(401).json({ error: 'User not found' });
  }
  const fullMessage = { username, message, timestamp: new Date().toISOString() };
  chatMessages.push(fullMessage);
  
  // Respond to waiting clients
  waitingClients.forEach(client => {
    client.res.json([fullMessage]);
  });
  waitingClients.length = 0;
  
  res.sendStatus(200);
});

app.get('/history', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  res.json(chatMessages.slice(-limit));
});

app.post('/typing', (req, res) => {
  const { userId, isTyping } = req.body;
  if (isTyping) {
    typingUsers.add(userId);
  } else {
    typingUsers.delete(userId);
  }
  res.sendStatus(200);
});

app.get('/typing', (req, res) => {
  const typingUsernames = Array.from(typingUsers).map(userId => users.get(userId));
  res.json(typingUsernames);
});

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

app.listen(port, () => {
  console.log(`Chat server running at http://localhost:${port}`);
});