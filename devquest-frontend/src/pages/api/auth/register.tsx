import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import prisma from '../../../lib/prisma';

const registerUser = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password || password.trim() === '') {
        return res.status(400).json({ error: 'Missing required fields' });
      }

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user in the database
      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword, // Save the hashed password
        },
      });

      // Return the created user info
      res.status(201).json(user);
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

export default registerUser;
