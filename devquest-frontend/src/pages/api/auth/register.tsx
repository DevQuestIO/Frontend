import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import prisma from '../../../lib/prisma';

const registerUser = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    // Check if body is present and valid
    console.log("Received request body:", req.body);

    // Destructure body variables
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password || password.trim() === '') {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Check if the username or email already exists in the database
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ username: username }, { email: email }],
        },
      });

      if (existingUser) {
        return res.status(400).json({
          error: 'Username or Email already in use',
        });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("before")
      // Create the user in the database
      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword, // Save the hashed password
        },
      });
      console.log("after")
      console.log(user)

      // Return the created user info (exclude password for security)
      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
  } else {
    // Method not allowed for any method other than POST
    res.status(405).json({ error: 'Method not allowed' });
  }
};

export default registerUser;
