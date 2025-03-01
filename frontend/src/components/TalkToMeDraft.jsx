import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaMicrophone } from "react-icons/fa";

const TalkToMe = () => {
  const [isListening, setIsListening] = useState(false);
  const [responseAudio, setResponseAudio] = useState(null);
  const recognition = useRef(null); // Store recognition instance

  useEffect(() => {
    // Initialize SpeechRecognition once
    recognition.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.current.continuous = false;
    recognition.current.interimResults = false;
    recognition.current.lang = "en-US";

    recognition.current.onstart = () => {
      console.log("Listening...");
      setIsListening(true);
    };

    recognition.current.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("Recognized:", transcript);
      recognition.current.stop();
      setIsListening(false);
      sendToServer(transcript);
    };

    recognition.current.onspeechend = () => {
      console.log("Speech Ended, stopping recognition...");
      recognition.current.stop();
      setIsListening(false);
    };

    recognition.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };
  }, []);

  // 🚀 Function to send text to the backend
  const sendToServer = async (text) => {
    console.log("Sending to server:", text);

    try {
      const response = await axios.post("http://localhost:5000/api/voice-assist", { text }, {
        headers: { "Content-Type": "application/json" },
        responseType: "arraybuffer",
      });

      console.log("Server response:", response);
      playAudio(response.data);
    } catch (error) {
      console.error("Error sending text to server:", error);
    }
  };

  // 🔊 Function to play response audio
  const playAudio = (audioData) => {
    if (!audioData || audioData.byteLength === 0) {
      console.error("Received empty audio data from server.");
      return;
    }
  
    const audioUrl = URL.createObjectURL(new Blob([audioData], { type: "audio/mp3" }));
    setResponseAudio(audioUrl);
    const audio = new Audio(audioUrl);
    audio.play().catch((e) => console.error("Error playing audio:", e));
  };

  return (
    <div className="flex justify-center items-center flex-col m-8">
      <h2 className="text-lg">Hello Name, I am here!</h2>
      <button
  onClick={() => recognition.current.start()}
  className={p-4 rounded-full text-white font-semibold transition-all duration-300 hover:bg-pink-400 hover:animate-pulse
    ${
      isListening
        ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient"
        : "bg-indigo-700"
    }
  }
>
  {isListening ? "Listening..." : <FaMicrophone size={24} className=""/>}
</button>
      {responseAudio && (
        <audio controls autoPlay>
          <source src={responseAudio} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default TalkToMe;