// Chat.tsx
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import styles from '@/styles/Chat.module.css';
import UserList from './UserList';
import ChatWindow from './ChatWindow';

interface User {
  _id: string;
  username: string;
  isActive: boolean;
  friends: string[];
  pendingRequests: string[];
}

let socket: Socket;

const Chat = () => {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    if (!username) {
      const name = prompt('Please enter your username:');
      if (name) {
        setUsername(name);
        handleLogin(name);
      }
    }
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const handleLogin = async (name: string) => {
    try {
      const response = await fetch('http://localhost:5001/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: name }),
      });

      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user);
        setIsLoggedIn(true);
        initializeSocket(user);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // In Chat.tsx, update initializeSocket function
const initializeSocket = (user: User) => {
  socket = io('http://localhost:5001');
    
  socket.on('connect', () => {
    console.log('Connected to socket');
    socket.emit('join', user.username);
  });

  // Add this to debug socket connection
  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });
};

  if (!isLoggedIn) {
    return <div className={styles.loginContainer}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <UserList
        currentUser={currentUser}
        onSelectUser={setSelectedUser}
        socket={socket}
        selectedUser={selectedUser} 
      />
      {selectedUser && (
        <ChatWindow
          currentUser={currentUser}
          selectedUser={selectedUser}
          socket={socket}
        />
      )}
    </div>
  );
};

export default Chat;

