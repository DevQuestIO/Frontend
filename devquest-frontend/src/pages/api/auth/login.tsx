// pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import prisma from '../../../lib/prisma';

const loginUser = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Check if the user exists in the database
      const user = await prisma.user.findUnique({
        where: {
          username,
        },
      });

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate a JWT token or perform other authentication-related tasks
      // and return the appropriate response

      // For example, you could return the user object with a JWT token:
      const token = generateJwtToken(user); // Replace this with your actual token generation logic
      return res.status(200).json({ user, token });
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ error: 'Login failed. Please try again.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

// Helper function to generate a JWT token (replace this with your own implementation)
const generateJwtToken = (user: any) => {
  // Implement your JWT token generation logic here
  return 'example_jwt_token';
};

export default loginUser;