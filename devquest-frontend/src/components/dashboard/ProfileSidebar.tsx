import React from 'react';
import { signOut } from "next-auth/react";
import {useSession} from "../../hooks/useSession";

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ isOpen, onClose }) => {
    const { session, status } = useSession();
  return (
    <div
      className={`fixed top-0 right-0 h-full w-64 bg-slate-900 text-white shadow-lg transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-4 flex justify-between items-center bg-gradient-to-br from-emerald-500/20 to-violet-500/10 px-4 py-2 rounded hover:bg-gradient-to-br">
        <h2 className="text-lg font-semibold">DevQuest</h2><br></br>
        {/* <h2 className="text-lg font-semibold">{session?.given_name}</h2> */}
        <button
          onClick={onClose}
          className="text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:text-red-500"
        >
          ✕
        </button>
      </div>
      <div className="p-4">
      <button
          onClick={() => {
            console.log("Make Friends API Call");
            window.location.href = "http://localhost:3000/chat";
            onClose();
          }}
          className="w-full py-2 px-4 mb-4 bg-gradient-to-br from-green-500/20 to-green-500/10 px-4 py-2 rounded hover:bg-gradient-to-br"
        >
          Make Friends
        </button>
      <button
          onClick={async () => {
            try {
              // Call the signout API and clear the session
              await fetch('http://localhost:5002/api/auth/signout', { method: 'POST', credentials: 'include' });
              await signOut({ redirect: false }); // Avoid automatic redirection from NextAuth
              
              // Redirect to the home page
              window.location.href = "http://localhost:3000/";
            } catch (error) {
              console.error("Signout error:", error);
            }
          }}
          className="w-full py-2 px-4 mb-4 bg-gradient-to-r from-red-500/20 to-red-500/10 px-4 py-2 rounded hover:bg-gradient-to-br"
        >
          Sign Out
        </button>
      
     
      </div>
    </div>
  );
};

export default ProfileSidebar;
