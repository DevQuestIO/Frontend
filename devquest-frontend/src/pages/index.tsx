// src/pages/index.tsx
import { useSession, signIn, signOut } from "next-auth/react";

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-center text-gray-900">
              Welcome to DevQuest
            </h1>
            <p className="mt-2 text-center text-gray-600">
              Please sign in to continue
            </p>
          </div>
          <div>
            <button
              onClick={() => signIn('keycloak')}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              Sign in with Keycloak
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-center text-gray-900">
            Welcome back!
          </h1>
          <p className="mt-2 text-center text-gray-600">
            {session.user?.name}
          </p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-4">
            <p className="text-gray-600">
              <span className="font-medium">Email:</span> {session.user?.email}
            </p>
            {session.roles && (
              <p className="text-gray-600">
                <span className="font-medium">Roles:</span> {session.roles.join(', ')}
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
    </div>
  );
}