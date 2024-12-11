// ChatWindow.tsx

import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import styles from '@/styles/Chat.module.css';

interface User {
  _id: string;
  username: string;
  isActive: boolean;
}

interface Message {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp: Date;
}

interface Props {
  currentUser: User | null;
  selectedUser: User;
  socket: typeof Socket;
}

const ChatWindow = ({ currentUser, selectedUser, socket }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    fetchMessages();
    socket.on('newMessage', (message: Message) => {
      if (
        (message.sender === selectedUser._id && message.receiver === currentUser?._id) ||
        (message.sender === currentUser?._id && message.receiver === selectedUser._id)
      ) {
        setMessages(prev => [...prev, message]);
      }
    });

    return () => {
      socket.off('newMessage');
    };
  }, [selectedUser._id]);

  const fetchMessages = async () => {
    if (!currentUser) return;
    try {
      const response = await fetch(
        `http://localhost:5003/api/messages/${currentUser._id}/${selectedUser._id}`
      );
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = () => {
    if (!inputMessage.trim() || !currentUser) return;

    const messageData = {
      sender: currentUser._id,
      senderUsername: currentUser.username,
      receiver: selectedUser._id,
      content: inputMessage,
    };
    console.log('messageData',messageData);
    socket.emit('sendMessage', messageData);
    setMessages(prev => [...prev, { ...messageData, _id: Date.now().toString(), timestamp: new Date() }]);
    setInputMessage('');
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <div className={`${styles.userStatus} ${!selectedUser.isActive ? styles.offline : ''}`} />
        <span className={styles.userName}>{selectedUser.username}</span>
      </div>

      <div className={styles.messageContainer}>
        {messages.map((message) => (
          <div
            key={message._id}
            className={`${styles.message} ${
              message.sender === currentUser?._id ? styles.sent : styles.received
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>

      <div className={styles.inputContainer}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          className={styles.messageInput}
        />
        <button onClick={sendMessage} className={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;


