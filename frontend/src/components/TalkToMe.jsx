import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaMicrophone, FaPlay, FaPause } from "react-icons/fa";
import WaveSurfer from "wavesurfer.js";
import { useUser } from "@clerk/clerk-react";

const TalkToMe = () => {
  const [isListening, setIsListening] = useState(false);
  const [responseAudio, setResponseAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const recognition = useRef(null);
  const audioRef = useRef(null);
  const waveSurferRef = useRef(null);
  const waveContainerRef = useRef(null);

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/getuser/${user.id}`);
        console.log(res.data);
        setUserData(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [user]);

  useEffect(() => {
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
      recognition.current.stop();
      setIsListening(false);
    };

    recognition.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };
  }, []);

  const sendToServer = async (text) => {
    console.log("Sending to server:", text);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/voice-assist",
        { text },
        {
          headers: { "Content-Type": "application/json" },
          responseType: "arraybuffer",
        }
      );

      console.log("Server response:", response);
      playAudio(response.data);
    } catch (error) {
      console.error("Error sending text to server:", error);
    }
  };

  const playAudio = (audioData) => {
    if (!audioData || audioData.byteLength === 0) {
      console.error("Received empty audio data from server.");
      return;
    }

    const audioUrl = URL.createObjectURL(new Blob([audioData], { type: "audio/mp3" }));
    setResponseAudio(audioUrl);
  };

  useEffect(() => {
    if (responseAudio) {
      if (!waveSurferRef.current) {
        waveSurferRef.current = WaveSurfer.create({
          container: waveContainerRef.current,
          waveColor: "#E5E4E2",
          progressColor: "#818589",
          barWidth: 2,
          height: 50,
          responsive: true,
          cursorWidth: 1,
          backend: "WebAudio",
        });

        waveSurferRef.current.load(responseAudio);

        waveSurferRef.current.on("ready", () => {
          waveSurferRef.current.play();
        });

        waveSurferRef.current.on("play", () => {
          setIsPlaying(true);
        });

        waveSurferRef.current.on("pause", () => {
          setIsPlaying(false);
        });

        waveSurferRef.current.on("finish", () => {
          setIsPlaying(false);
        });
      } else {
        waveSurferRef.current.load(responseAudio);
      }
    }
  }, [responseAudio]);

  const togglePlayPause = () => {
    if (!waveSurferRef.current) return;

    if (isPlaying) {
      waveSurferRef.current.pause();
    } else {
      waveSurferRef.current.play();
    }
  };

  if (loading) return <p className="text-center text-2xl">Loading user data...</p>;
  return (
    <div className="flex flex-col items-center justify-center p-20">
      <div className="flex flex-col justify-center items-center gap-6 mt-24">
        <h2 className="text-4xl text-center text-gray-900 -mt-8">
          <span className="text-xl">Hello {userData?.name},</span><br></br>  <span className="font-medium text-2xl">click the button and let's talk!</span> 
        </h2>
        <button
          onClick={() => recognition.current.start()}
          className={`relative flex items-center justify-center p-8 rounded-full shadow-md shadow-pink-300 transition-all duration-300 mt-8  
            ${isListening ? "animate-glow bg-gradient-to-r from-purple-700 via-pink-300 to-sky-300 shadow-xl shadow-neutral-700" : "bg-neutral"}
          `}
        >
          {!isListening && (
            <button className="p-4 rounded-full bg-indigo-900 border-2 border-indigo-800">
              <FaMicrophone size={28} className="text-accent" />
            </button>
          )}

          {isListening && (
            <>
              <span className="absolute animate-pulse-gradient w-24 h-24 bg-gradient-to-r from-purple-500 via-green-200 to-fuchsia-300 rounded-full opacity-50"></span>
              <div className="glass-blur motion-graphic"></div>
            </>
          )}
        </button>
        {isListening && <p className="text-lg text-gray-800 mt-14">I am Listening...❤️</p>}
      </div>

      {responseAudio && (
        <div className="flex items-center gap-4 mt-6 w-full">
          <button
            onClick={togglePlayPause}
            className="p-4 rounded-full bg-indigo-800 hover:bg-indigo-700 transition-all"
          >
            {isPlaying ? 
            <FaPause size={24} className="text-white" /> : <FaPlay size={24} className="text-white" />}
          </button>
          <div ref={waveContainerRef} className="w-full max-w-lg"></div>
          <audio ref={audioRef} />
        </div>
      )}
    </div>
  );
};

export default TalkToMe;