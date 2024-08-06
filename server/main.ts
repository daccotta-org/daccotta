import express from "express";
import type { Request, Response } from 'express';
import dotenv from "dotenv";
import cors from "cors";
import admin from 'firebase-admin';
import User from './models/User';
import connectDatabase from "./connections/connectToDB";
import { PORT } from "./config";

import { userRoutes } from "./routes/userRoutes";
import { groupRoutes } from "./routes/groupRoutes";
import { listRoutes } from "./routes/listRoutes";

import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const app = express();

connectDatabase();
console.log("console log ho bhi rha h ya nhi ?");

app.use(cors());
app.use(express.json());

try {
  console.log("hello");
  
  const serviceAccount = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'firebases.json'), 'utf8')
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('Firebase Admin SDK initialized successfully');
} 
catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
}

interface CreateUserRequest {
  uid: string;
  email: string;
  userName: string;
  age: number;
}


// Route to create a new user
app.post('/api/users', async (req:Request, res: Response) => {

  try {
    const { uid, email, age } = req.body;
    console.log(uid, email, age);

    // Verify the Firebase ID token
    const authHeader = req.headers.authorization;
    const idToken = authHeader && authHeader.split('Bearer ')[1];
    
    if (!idToken) {
      console.log('No token provided');
      return res.status(401).json({ error: 'No token provided' });
    }
    
   console.log("token ko decode kr rha h ");
    const decodedToken = await admin.auth().verifyIdToken(idToken);
   

    console.log("decoded token ",decodedToken);
    
      console.log("user tho h hi glt");
    if (decodedToken.uid !== uid) {
       console.log('Unauthorized');
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Check if username is already taken
  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('email is already in use.');
      return res.status(400).json({ error: 'email is already in use.' });
    }

    // Create new user
    const newUser = new User({
      _id: uid,
      userName:"",
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
  } 
  catch (error) {
    console.error('Failed to create user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// app.post('/api/users', async (req:Request, res: Response) => {

//   console.log("call aa rhi h yaha");
//   try {
//     const { uid, email, userName, age } = req.body;
//     console.log(uid, email, userName, age);

//     // Verify the Firebase ID token
//     const authHeader = req.headers.authorization;
//     const idToken = authHeader && authHeader.split('Bearer ')[1];
    
//     if (!idToken) {
//       console.log('No token provided');
//       return res.status(401).json({ error: 'No token provided' });
//     }
    
//     console.log("token ko decode kr rha h ")
//      const decodedToken = await admin.auth().verifyIdToken(idToken);
   
//      console.log("user tho h hi glt")
//     if (decodedToken.uid !== uid) {
//        console.log('Unauthorized');
//       return res.status(403).json({ error: 'Unauthorized' });
//     }

//     // Check if username is already taken
//     console.log("username check kr rha h")
//     const existingUser = await User.findOne({ userName });
//     if (existingUser) {
//       console.log('Username is already taken');
//       return res.status(400).json({ error: 'Username is already taken' });
//     }

//     // Create new user
//     const newUser = new User({
//       _id: uid,
//       userName,
//       email,
//       age,
//       groups: [],
//       badges: [],
//       lists: [],
//       actor: [],
//       directors: [],
//       profile_image: '',
//     });
//     await newUser.save();

//     res.status(201).json({ message: 'User created successfully' });
//   }
   
//   catch (error) {
//     console.error('Failed to create user:', error);
//     res.status(500).json({ error: 'Failed to create user' });
//   }
// });


app.use('/api/user',userRoutes);
app.use('/api/group',groupRoutes);
app.use('/api/list',listRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});


app.listen(PORT, () => {
  console.log( `app listening on port ${PORT}! ⁠`);
});