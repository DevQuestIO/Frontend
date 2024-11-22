// components/LoginButton.tsx
import { signIn, signOut, useSession } from 'next-auth/react';

const LoginButton = () => {
  const { data: session } = useSession();

  return session ? (
    <button onClick={() => signOut()} className="bg-red-500 text-white p-2 rounded">
      Sign out
    </button>
  ) : (
    <button onClick={() => signIn('keycloak')} className="bg-blue-500 text-white p-2 rounded">
      Sign in with Keycloak
    </button>
  );
};

export default LoginButton;
