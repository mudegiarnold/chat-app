const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const db = new sqlite3.Database(':memory:');

app.use(cors());
app.use(express.json());

// Initialize SQLite DB
db.serialize(() => {
  db.run('CREATE TABLE messages (id INTEGER PRIMARY KEY, user TEXT, message TEXT)');
});

// API to fetch messages
app.get('/messages', (req, res) => {
  db.all('SELECT * FROM messages', (err, rows) => {
    res.json(rows);
  });
});

// WebSocket connection
wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    db.run('INSERT INTO messages (user, message) VALUES (?, ?)', [data.user, data.message]);

    // Broadcast to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
