import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chat from './components/Chat';
import { WebSocketProvider } from './contexts/WebSocketContext';
import './App.css';

const App = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/messages').then((response) => {
      setMessages(response.data);
    });
  }, []);

  return (
    <WebSocketProvider>
      <div className="App">
        <h1>Chat Application</h1>
        <Chat />
      </div>
    </WebSocketProvider>
  );
};

export default App;
