// src/pages/index.tsx
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="bg-blue-600 fixed top-0 w-full z-50 shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          {/* Logo/Brand Name */}
          <div className="flex-shrink-0 text-white text-2xl font-bold">DevQuest</div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {/* About Us */}
            <Link href="/about">
              <span className="text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                About Us
              </span>
            </Link>

            {/* Login */}
            <Link href="/auth/login">
              <span className="text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Login
              </span>
            </Link>

            {/* Signup */}
            <Link href="/auth/register">
              <span className="text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Signup
              </span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-16">
      <Navbar /> {/* Add Navbar Component here */}
      <div className="flex flex-col items-center justify-center p-4">
        {!session ? (
          <div className="w-full max-w-md space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-center text-gray-900">
                Welcome to DevQuest
              </h1>
              <p className="mt-2 text-center text-gray-600">Please sign in to continue</p>
            </div>
            <div>
              <button
                onClick={() => signIn("keycloak")}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
                Sign in with Keycloak
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-center text-gray-900">
                Welcome back, {session.user?.name}!
              </h1>
              <p className="mt-2 text-center text-gray-600">Your Profile</p>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <div className="space-y-4">
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> {session.user?.email}
                </p>
                {session.user?.roles && (
                  <p className="text-gray-600">
                    <span className="font-medium">Roles:</span> {session.user?.roles.join(", ")}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => signOut()}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
