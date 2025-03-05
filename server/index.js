import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import multer from 'multer';
import { bucket } from './utils/firebase.js';
import { transcribeAudio } from './services/openaiService.js';
import notyetRoutes from './api/notyetRoutes.js';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'X-API-Key', 'Authorization'],
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Multer setup (Store files in memory)
const upload = multer({ storage: multer.memoryStorage() });

// 🎤 Voice Assistant API: Upload & Process Audio
app.post('/api/process-audio', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    // Step 1: Upload Audio to Firebase Cloud Storage
    const fileName = `uploads/${uuidv4()}-${req.file.originalname}`;
    const fileRef = bucket.file(fileName);

    // Upload file buffer to Firebase Cloud Storage
    await fileRef.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype,
      },
    });
    console.log('✅ File uploaded to Firebase Storage:', fileName);
    // Generate a public URL for the file
    const [url] = await fileRef.getSignedUrl({
      action: 'read',
      expires: '03-09-2491',
    });

    console.log('File uploaded to:', url);

    // Step 2: Convert Speech to Text
    const userInput = await transcribeAudio(url);
    console.log('User said:', userInput);

    if (!userInput) {
      return res.status(400).json({ error: 'Could not transcribe audio' });
    }

    // Return AI-generated speech URL or text response
    res.json({ message: 'Audio processed successfully', text: userInput });
  } catch (error) {
    console.error('❌ Error processing audio:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Using OCR and other API routes
app.use('/api', notyetRoutes);
app.use('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});
// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});