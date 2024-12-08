import { signIn, signOut } from "next-auth/react";
import { useSession } from "../hooks/useSession";
import Link from "next/link";
import React from "react";
const handleSSOLogin = () => {
  window.location.href =
    "http://localhost:8080/realms/devquest/protocol/openid-connect/auth?" +
    "client_id=devquest-frontend&" +
    "response_type=code&" +
    "redirect_uri=http://localhost:5002/api/auth/callback";
};
const Navbar = () => {
  const { session, status } = useSession();
  
  return (
    <header className="bg-gray-900 fixed top-0 w-full z-50 shadow-md h-16">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-full">
        {/* Logo */}
        <div className="text-white text-2xl font-bold">DevQuest</div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4">
          <Link href="/about">
            <span className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              About Us
            </span>
          </Link>
          {status === "loading" ? null : session ? (
            <>
              <span className="text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                Hi, {session.given_name || "User"}
              </span>
              <button
                onClick={async () => {
                  await fetch("http://localhost:5002/api/auth/signout", {
                    method: "POST",
                    credentials: "include",
                  });
                  signOut();
                }}
                className="text-white hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
                onClick={handleSSOLogin}
              >
                Login
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

const HomePage = () => {
  const { session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Navbar />

      {/* Main Content */}
      <div className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="w-full flex flex-col items-center text-center py-24 bg-gray-800">
          <h1 className="text-5xl font-bold">Track, Analyze & Share</h1>
          <p className="mt-4 text-lg text-gray-400 max-w-3xl">
            DevQuest helps you navigate and track your coding journey to success
          </p>
          {!session ? (
              <button className="mt-6 px-8 py-3 text-lg font-medium bg-blue-600 rounded-lg hover:bg-blue-700 transition" onClick={handleSSOLogin}>
                Login / Signup →
                
              </button>
          ):(
            <div className="w-full max-w-md space-y-8">
              <div>
                <h1 className="text-3xl pt-8  text-center text-white">
                  Welcome back, {session.name}!
                </h1>
              </div>
            </div>
          )}
        </section>

        {/* Coding Platforms Section */}
        <section className="py-20 bg-gray-900">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl font-bold">
                Your Favourite Coding Platforms
              </h2>
              <p className="mt-4 text-lg text-gray-400">
                Streamlined in DevQuest to simplify your coding journey.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center shadow">
                <img
                  src="/images/leetcode.png"
                  alt="LeetCode"
                  className="w-10 h-10"
                />
              </div>
              {/* Add more logos */}
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="py-6 bg-gray-800 text-gray-400 text-center">
        <p>© 2024 DevQuest, Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
