import express from 'express';
import User from '../models/User.js';
import OpenAI from 'openai';  // Import OpenAI API
import fs from 'fs';  // For file system (to remove uploaded file)
import multer from 'multer';  // For file upload handling
import textToSpeech from '@google-cloud/text-to-speech'; // Import Google Cloud TTS
import util from 'util';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import dotenv from 'dotenv';

import { deleteFile } from '../services/fileService.js';
import { transcribeAudio, generateChatResponse } from '../services/openaiService.js';
import { generateSpeech } from '../services/ttsService.js';
import { resetConversation } from '../services/openaiService.js';





dotenv.config();

// ✅ Load Google Credentials
const googleCredentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const ttsClient = new textToSpeech.TextToSpeechClient({
  credentials: {
    client_email: googleCredentials.client_email,
    private_key: googleCredentials.private_key.replace(/\\n/g, '\n'),
  },
});


// OpenAI API key setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // Make sure the API key is set in your environment variables
});


const router = express.Router();

//ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `audio-${Date.now()}.webm`);  // Ensure correct file extension
  },
});

const upload = multer({ storage: storage });

// Saving user's name from the welcome.jsx
router.post('/savinguser', async (req, res) => {
  const { name,clerkUserId } = req.body;

  try {
    const newUser = new User({ name,clerkUserId });
    await newUser.save();
    res.status(201).json({ message: 'User saved successfully' });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: 'Failed to save user' });
  }
});


router.get('/getuser/:clerkUserId', async (req, res) => {
  try {
    const user = await User.findOne({ clerkUserId: req.params.clerkUserId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});






///const credential = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

//const client = new textToSpeech.TextToSpeechClient({
 // credentials:{
  //  private_key: credential.private_key.replace(/\\n/g, '\n'),
   // client_email: credential.client_email,
   
    

  //},
 // }  // Update with your actual path
//);


//router.post('/greet', async (req, res) => {
  ///try {
   /* const greetingText = 'Hello! How are you feeling today? I am here to listen and help you.';
    const request = {
      input: { text: greetingText },
      voice: { languageCode: 'en-US', ssmlGender: 'FEMALE' },
      audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await client.synthesizeSpeech(request);
    const audioContent = response.audioContent;

    res.set({
      'Content-Type': 'audio/mp3',
      'Content-Length': audioContent.length,
    });

    res.send(audioContent);
  } catch (error) {
    console.error('Error with greet route:', error);
    res.status(500).json({ error: 'Greeting generation failed' });
  }
});*/

router.post("/voice-assist", async (req, res) => {
  try {
    const { text } = req.body;
    console.log("User input:", text);

    // Step 1: Generate AI Response
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: text }],
    });

    const aiText = aiResponse.choices[0].message.content;
    console.log("AI Response:", aiText);

    // Step 2: Convert AI Response to Speech
    const request = {
      input: { text: aiText },
      voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
      audioConfig: { audioEncoding: "MP3" },
    };

    const [response] = await ttsClient.synthesizeSpeech(request);
    res.set({ "Content-Type": "audio/mpeg" });
    res.send(response.audioContent);
  } catch (error) {
    console.error("Error in voice assistant route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.post('/reset-conversation', async (req, res) => {
  resetConversation();
  res.json({ message: 'Conversation reset successfully' });
});

export default router;