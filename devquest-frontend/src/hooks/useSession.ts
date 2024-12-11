
import { useEffect, useState } from 'react'; 
import { UserSession } from '../types/index';

export const useSession = () => {
    const [session, setSession] = useState<UserSession | null>(null); // Use the custom type
      const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
   useEffect(() => {
     const fetchSession = async () => {
       try {
         const res = await fetch('http://localhost:5002/api/auth/session', {
             method: 'GET',
             credentials: 'include', // Ensure cookies are sent
             headers: {
               'Accept': 'application/json',
             }
         });

         console.log('Response status:', res.status);
         
         if (res.ok) {
           const data = await res.json();
           console.log(data.user);
           setSession(data.user); // Use data.user from your backend response
           setStatus('authenticated');
         } else {
           // Handle non-OK responses
           const errorText = await res.text();
           console.error('Session fetch error:', errorText);
           setSession(null);
           setStatus('unauthenticated');
         }
       } catch (error) {
         console.error('Error fetching session:', error);
         setSession(null);
         setStatus('unauthenticated');
       }
     };

     fetchSession();
   }, []);

   return { session, status };
};