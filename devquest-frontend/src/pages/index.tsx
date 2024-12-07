import { signIn, signOut } from "next-auth/react";
import {useSession} from "../hooks/useSession";
import Link from "next/link";

// const Navbar = () => {
//   const {session, status } = useSession();
//   console.log(session);
//   console.log(status);
//   return (
//     <header className="bg-blue-600 fixed top-0 w-full z-50 shadow-md">
//       <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="relative flex items-center justify-between h-16">
//           {/* Logo/Brand Name */}
//           <div className="flex-shrink-0 text-white text-2xl font-bold">DevQuest</div>

//           {/* Navigation Links */}
//           <div className="flex items-center space-x-4">
//             {/* Always show About Us */}
//             <Link href="/about">
//               <span className="text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
//                 About Us
//               </span>
//             </Link>

//             {/* Conditionally render Login/Logout */}
//             {status === "loading" ? null : session ? (
//               <>
//                 <span className="text-white px-3 py-2 rounded-md text-sm font-medium">
//                   Hi, {session.given_name || "User"}
//                 </span>
//                 <button
//                   onClick={() => signOut()}
//                   className="text-white hover:bg-red-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
//                 >
//                   Sign Out
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link href="/auth/login">
//                   <span className="text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
//                     Login
//                   </span>
//                 </Link>
//                 <Link href="/auth/register">
//                   <span className="text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
//                     Signup
//                   </span>
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// };
const Navbar = () => {
  const { session, status } = useSession();

  const handleSignOut = async () => {
    try {
      const res = await fetch('http://localhost:5002/api/auth/signout', {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        // Optionally, you can clear local state or redirect to the login page
        window.location.href = '/auth/login'; // Redirect to login after signout
      } else {
        console.error('Signout failed:', await res.text());
      }
    } catch (error) {
      console.error('Error during signout:', error);
    }
  };

  return (
    <header className="bg-blue-600 fixed top-0 w-full z-50 shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex-shrink-0 text-white text-2xl font-bold">DevQuest</div>
          <div className="flex items-center space-x-4">
            <Link href="/about">
              <span className="text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                About Us
              </span>
            </Link>
            {status === 'loading' ? null : session ? (
              <>
                <span className="text-white px-3 py-2 rounded-md text-sm font-medium">
                  Hi, {session.given_name || 'User'}
                </span>
                <button
  onClick={async () => {
    await fetch('http://localhost:5002/api/auth/signout', { method: 'POST', credentials: 'include' });
    signOut(); // This ensures NextAuth session is cleared too
  }}
  className="text-white hover:bg-red-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
>
  Sign Out
</button>

                {/* <button
                  onClick={handleSignOut}
                  className="text-white hover:bg-red-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign Out
                </button> */}
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <span className="text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Login
                  </span>
                </Link>
                <Link href="/auth/register">
                  <span className="text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Signup
                  </span>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};


export default function HomePage() {
  const {session, status } = useSession();

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
          </div>
        ) : (
          <div className="w-full max-w-md space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-center text-gray-900">
                Welcome back, {session.name}!
              </h1>
              <p className="mt-2 text-center text-gray-600">Your Profile</p>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <div className="space-y-4">
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> {session.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
