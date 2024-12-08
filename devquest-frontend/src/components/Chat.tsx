import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import styles from '@/styles/Chat.module.css';
import UserList from './UserList';
import ChatWindow from './ChatWindow';
import { useSession } from "../hooks/useSession";

interface User {
  _id: string;
  username: string;
  isActive: boolean;
  friends: string[];
  pendingRequests: string[];
}

let socket: Socket;

const Chat = () => {
  const { session, status } = useSession();
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    if (status === 'authenticated' && session?.name) {
      setUsername(session.name);
      handleLogin(session.name);
    }
  }, [status, session]);

  const handleLogin = async (name: string) => {
    try {
      const response = await fetch('http://localhost:5003/api/users/login', {
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
      } else {
        console.error('Failed to log in:', await response.text());
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const initializeSocket = (user: User) => {
    socket = io('http://localhost:5003');

    socket.on('connect', () => {
      console.log('Connected to socket');
      socket.emit('join', user.username);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  };

  if (status === 'loading') {
    return <div className={styles.loginContainer}>Loading session...</div>;
  }

  if (status === 'unauthenticated') {
    return <div className={styles.loginContainer}>Please log in to continue.</div>;
  }

  if (!isLoggedIn) {
    return <div className={styles.loginContainer}>Initializing...</div>;
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
