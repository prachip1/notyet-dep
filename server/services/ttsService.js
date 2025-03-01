import OpenAI from "openai";
import textToSpeech from "@google-cloud/text-to-speech";
import util from "util";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const client = new textToSpeech.TextToSpeechClient();

export const generateSpeech = async (text) => {
  try {
    // Step 1: Generate AI response from OpenAI
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: text }],
    });

    const aiText = aiResponse.choices[0].message.content;
    console.log("AI Response:", aiText); // Debugging

    // Step 2: Convert AI response to speech
    const request = {
      input: { text: aiText },
      voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
      audioConfig: { audioEncoding: "MP3" },
    };

    const [response] = await client.synthesizeSpeech(request);
    return response.audioContent; // Return the generated speech
  } catch (error) {
    console.error("Error generating speech:", error);
    throw error;
  }
};
