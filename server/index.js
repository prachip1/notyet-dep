import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import http from 'http';
import multer from 'multer';
import { deleteFile } from './services/fileService.js';
import { transcribeAudio } from './services/openaiService.js';
import notyetRoutes from './api/notyetRoutes.js';

dotenv.config();

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

// Multer setup (Storing files temporarily)
const upload = multer({ dest: 'uploads/' });

// 🎤 Voice Assistant API: Upload & Process Audio
app.post('/api/process-audio', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    // Step 1: Convert Speech to Text
    const userInput = await transcribeAudio(req.file.path);
    console.log('User said:', userInput);

    if (!userInput) {
      await deleteFile(req.file.path);  // Cleanup file if processing failed
      return res.status(400).json({ error: 'Could not transcribe audio' });
    }

    // Step 2: Process AI Response (TTS can be added here if needed)
    // const speechAudio = await generateSpeech(userInput);  // Example

    // Step 3: Cleanup the uploaded file
    await deleteFile(req.file.path);

    // Return AI-generated speech URL or text response
    res.json({ message: 'Audio processed successfully', text: userInput });

  } catch (error) {
    console.error('❌ Error processing audio:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Using OCR and other API routes
app.use('/api', notyetRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
