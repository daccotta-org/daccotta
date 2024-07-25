import express from "express";
import type { Request, Response } from 'express';
import dotenv from "dotenv";
import cors from "cors";
import admin from 'firebase-admin';
import User from './models/User';
import connectDatabase from "./connections/connectToDB";
import { PORT } from "./config";

dotenv.config();

const app = express();

connectDatabase();

app.use(cors());
app.use(express.json());

if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not defined in the environment');
}
// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '2749b84b3f82734f0e54b7b3b8236f2afdabde3b')),
});

interface CreateUserRequest {
  uid: string;
  email: string;
  userName: string;
  age: number;
}

// Route to create a new user
app.post('/api/users', async (req: Request<{}, {}, CreateUserRequest>, res: Response) => {
  try {
    const { uid, email, userName, age } = req.body;

    // Verify the Firebase ID token
    const authHeader = req.headers.authorization;
    const idToken = authHeader && authHeader.split('Bearer ')[1];
    
    if (!idToken) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);

    if (decodedToken.uid !== uid) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Check if username is already taken
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    // Create new user
    const newUser = new User({
      _id: uid,
      userName,
      email,
      age,
      groups: [],
      badges: [],
      lists: [],
      actor: [],
      directors: [],
      profile_image: '',
    });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Failed to create user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}!`);
});