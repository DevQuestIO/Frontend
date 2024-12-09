import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import styles from '@/styles/Chat.module.css';

interface User {
  _id: string;
  username: string;
  isActive: boolean;
  friends: string[];
  pendingRequests: string[];
  pendingSentRequests: string[];
  pendingReceivedRequests: string[];
  requestSent?: boolean;
}

interface Props {
  currentUser: User | null;
  onSelectUser: (user: User) => void;
  socket: typeof Socket;
  selectedUser: User | null;
}

const UserList = ({ currentUser, onSelectUser, socket, selectedUser }: Props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'friends'>('all');
  const [pendingRequests, setPendingRequests] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<{ type: string; message: string }[]>([]);

  useEffect(() => {
    fetchUsers();
    setupSocketListeners();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5003/api/users');
      const data = await response.json();
      setUsers(data.filter((user: User) => user._id !== currentUser?._id));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const setupSocketListeners = () => {
    socket.on('notification', (notification: any) => {
      setNotifications((prev) => [...prev, notification]);
    });

    socket.on('userStatusChanged', ({userId, isActive }:any) => {
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, isActive } : user
        )
      );
    });

    socket.on('newUserLoggedIn', (newUser: User) => {
      setUsers((prev) => {
        const userExists = prev.some((user) => user._id === newUser._id);
        return userExists ? prev : [...prev, newUser];
      });
    });

    socket.on('friendRequest', async ({ fromUserId }: any) => {
      if (!currentUser || currentUser._id === fromUserId) return; // Skip if sender
  
      console.log('Before', pendingRequests);
  
      try {
        // Fetch the latest users directly
        const response = await fetch('http://localhost:5003/api/users');
        const data = await response.json();
        const latestUsers = data.filter((user: User) => user._id !== currentUser?._id);
  
        // Find the user who sent the request
        const requestUser = latestUsers.find((user: any) => user._id === fromUserId);
        console.log('Users after fetch:', latestUsers);
        console.log('Request user:', requestUser);
  
        if (requestUser) {
          setPendingRequests((prev) =>
            prev.some((user) => user._id === fromUserId) ? prev : [...prev, requestUser]
          );
        }
      } catch (error) {
        console.error('Error fetching users in friendRequest listener:', error);
      }
  
      console.log('After', pendingRequests);
    });

    socket.on('friendRequestAccepted', ({ userId }: any) => {
        // Update the current user's friends list
        if (!currentUser) return;
    
        setUsers((prev) =>
          prev.map((user) =>
            user._id === userId
              ? { ...user, friends: [...user.friends, currentUser._id] }
              : user
          )
        );
    
        // Update the current user's friends list
        if (!currentUser.friends.includes(userId)) {
          currentUser.friends.push(userId);
        }
    
        // Refresh the user list to update the friends tab
        fetchUsers();
    });
  };

    const handleConnect = async (userId: string) => {
        if (!currentUser) return;
        try {
          const response = await fetch('http://localhost:5003/api/friend-request', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fromUserId: currentUser._id,
              toUserId: userId,
            }),
          });
      
          if (response.ok) {
            // Mark the request as sent only on the sender's side
            setUsers((prev) =>
              prev.map((user) =>
                user._id === userId ? { ...user, requestSent: true } : user
              )
            );
          }
        } catch (error) {
          console.error('Error sending friend request:', error);
        }
      };
  
  
  const acceptFriendRequest = async (fromUserId: string) => {
    if (!currentUser) return;
    try {
      const response = await fetch('http://localhost:5003/api/accept-friend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromUserId,
          toUserId: currentUser._id
        }),
      });
  
      if (response.ok) {
        // Remove from pending requests
        setPendingRequests(prev =>
          prev.filter(user => user._id !== fromUserId)
        );
  
        // Update users list to reflect new friend status
        setUsers(prev =>
          prev.map(user =>
            user._id === fromUserId
              ? { ...user, friends: [...user.friends, currentUser._id] }
              : user
          )
        );
  
        // Refresh users to get updated relationships
        fetchUsers();
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const rejectFriendRequest = async (fromUserId: string) => {
    if (!currentUser) return;
    try {
      const response = await fetch('http://localhost:5003/api/reject-friend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromUserId,
          toUserId: currentUser._id
        }),
      });

      if (response.ok) {
        setPendingRequests(prev =>
          prev.filter(user => user._id !== fromUserId)
        );
      }
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  const filteredUsers = () => {
    if (!currentUser) return [];
  
    const friends = currentUser.friends || [];
    const sentRequests = currentUser.pendingSentRequests || [];
    const receivedRequests = currentUser.pendingReceivedRequests || [];
  
    switch (activeTab) {
      case 'all':
        return users.filter(
          (user) =>
            user._id !== currentUser._id &&
            !friends.includes(user._id) &&
            !sentRequests.includes(user._id) &&
            !receivedRequests.includes(user._id)
        );      
      case 'friends':
        return users.filter((user) => friends.includes(user._id));
      default:
        return [];
    }
  };
  const removeNotification = (index: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  
  return (
    <div className={styles.sidebar}>
      {/* Current User Section */}
      <div className={styles.userSection}>
        <div className={styles.currentUser}>
          <div className={styles.userAvatar}>
            {currentUser?.username.charAt(0).toUpperCase()}
          </div>
          <span className={styles.userName}>{currentUser?.username}</span>
        </div>
      </div>

      {/* Notification Bar */}
      {notifications.length > 0 && (
        <div className={styles.notificationBar}>
          {notifications.map((notification, index) => (
            <div key={index} className={styles.notification}>
              <span>{notification.message}</span>
              <button
                className={styles.closeIcon}
                onClick={() => removeNotification(index)}
              >
                ✖
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tabs for All Users and Friends */}
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Users
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'friends' ? styles.active : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          Friends
        </button>
      </div>
  
      

{pendingRequests.length > 0 && (
  <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 mb-2 shadow-lg">
    <h3 className="text-lg font-bold text-gray-200 mb-2">
      Pending Requests ({pendingRequests.length})
    </h3>
    {pendingRequests.map((user) => (
      <div
        key={user._id}
        className="bg-gray-700 rounded-lg px-3 py-2  shadow-sm hover:bg-gray-600 transition-all"
      >
        <div className="text-sm font-medium text-gray-100 mb-2">
          {user.username}
        </div>
        <div className="text-xs text-gray-400 mb-3">wants to connect</div>
        <div className="flex items-center gap-4">
          <button
            className="px-4 py-2 bg-green-600 text-white text-sm  rounded-full shadow-md hover:bg-green-500 transition-all"
            onClick={() => acceptFriendRequest(user._id)}
          >
            Accept
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-full shadow-md hover:bg-red-500 transition-all"
            onClick={() => rejectFriendRequest(user._id)}
          >
            Reject
          </button>
        </div>
      </div>
    ))}
  </div>
)}



      {/* User List */}
      <div className={styles.userList}>
  {filteredUsers().map((user) => (
    <div
      key={user._id}
      className={`${styles.userItem} ${
        selectedUser?._id === user._id ? styles.active : ''
      }`}
    >
      {/* Grouping userStatus and userName on the left */}
      <div className={styles.userDetails}>
        <div
          className={`${styles.userStatus} ${
            !user.isActive ? styles.offline : styles.online
          }`}
        />
        <div className={styles.userName}>{user.username}</div>
      </div>

      {/* Conditional rendering for Connect and Chat buttons */}
      {activeTab === 'all' && (
        <button
          className={`${styles.connectButton} ${
            user.requestSent ? styles.sent : ''
          }`}
          onClick={() => handleConnect(user._id)}
          disabled={user.requestSent}
        >
          {user.requestSent ? 'Sent' : 'Connect'}
        </button>
      )}
      {activeTab === 'friends' && (
        <button className={styles.chatButton} onClick={() => onSelectUser(user)}>
          Chat
        </button>
      )}
    </div>
  ))}
</div>

    </div>
  );
};

export default UserList;
