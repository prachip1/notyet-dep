
import dotenv from 'dotenv';
dotenv.config();

import admin from "firebase-admin";

// Debugging: Print the value before parsing
console.log("FIREBASE_CREDENTIALS:", process.env.FIREBASE_CREDENTIALS);

const firebaseConfig = process.env.FIREBASE_CREDENTIALS;

if (!firebaseConfig) {
  throw new Error("❌ FIREBASE_CREDENTIALS environment variable is missing!");
}

const serviceAccount = JSON.parse(firebaseConfig); // This line is failing

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();
console.log(process.env.FIREBASE_STORAGE_BUCKET)
export { bucket };
