'use client';
import React, { useState } from 'react';
import { assets } from '../assets/assets';
import Image from 'next/image';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";



const PromptBox = ({ setIsLoading, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const { user, chats, setChats, selectedChat, setSelectedChat } = useAppContext();
  const [listening, setListening] = useState(false);


  //speech to text
  const startListening = () => {
  resetTranscript();
  setListening(true);
  SpeechRecognition.startListening({ continuous: false, language: "en-US" });
};

const stopListening = () => {
  SpeechRecognition.stopListening();
  setListening(false);
  setPrompt(transcript);
};

const { transcript, resetTranscript } = useSpeechRecognition();


  // Don't render if no chat is selected
  //if (!selectedChat) return null;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendPrompt(e);
    }
  };

  const sendPrompt = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Login to send message');
    if (isLoading) return toast.error('Wait for the previous prompt response');

    

    const promptCopy = prompt;
    if (!promptCopy.trim()) return;

    setIsLoading(true);
    setPrompt('');

    // 1️⃣ Create user message
    const userMessage = {
      role: 'user',
      content: promptCopy,
      timestamp: Date.now(),
    };

    // 2️⃣ Update context immediately
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat._id === selectedChat._id
          ? { ...chat, messages: [...chat.messages, userMessage] }
          : chat
      )
    );
    setSelectedChat((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }));

    try {
      // 3️⃣ Send prompt to AI backend
      const { data } = await axios.post('/api/chat/ai', {
        chatId: selectedChat._id,
        prompt: promptCopy,
      });

      if (!data.success) {
        toast.error(data.message || 'AI failed to respond');
        return;
      }

      // 4️⃣ Add empty assistant message first
      setSelectedChat((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          { role: 'assistant', content: '', timestamp: Date.now() },
        ],
      }));

      // 5️⃣ Animate assistant typing
      const messageTokens = data.data.content.split('');
      messageTokens.forEach((_, i) => {
        setTimeout(() => {
          setSelectedChat((prev) => {
            const updatedMessages = prev.messages.map((msg, idx) =>
              idx === prev.messages.length - 1
                ? { ...msg, content: messageTokens.slice(0, i + 1).join('') }
                : msg
            );
            return { ...prev, messages: updatedMessages };
          });
        }, i * 10); // typing speed (adjust as needed)
      });

      // 6️⃣ Update chats array as well
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === selectedChat._id
            ? { ...chat, messages: [...chat.messages, data.data] }
            : chat
        )
      );
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
      setPrompt(promptCopy);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <form
  onSubmit={sendPrompt}
  // className={`w-full ${selectedChat?.messages.length > 0 ? "max-w-3xl" : "max-w-2xl"} bg-blue-50 border-slate-200 shadow-md p-4 rounded-3xl mt-4 transition-all`}
  className={`w-full ${
  selectedChat?.messages.length > 0 ? "max-w-3xl" : "max-w-2xl"
} bg-blue-50 border border-transparent hover:border-blue-300 p-4 rounded-3xl mt-4 transition-all shadow-sm`}

>
  <textarea
    onKeyDown={handleKeyDown}
    className="outline-none w-full resize-none overflow-hidden break-words bg-transparent text-gray-900"
    rows={2}
    placeholder="Message DeepSeek"
    required
    onChange={(e) => setPrompt(e.target.value)}
    value={prompt}
  />

  <div className="flex items-center justify-between text-black text-sm mt-2">
    <div className="flex items-center gap-2">
      <p className="flex items-center gap-2 text-black text-xs border border-blue-200 px-2 py-1 rounded-full cursor-pointer hover:bg-blue-100 transition">
        <Image src={assets.deepthink_icon} alt="" />
        DeepThink (R1)
      </p>
      <p className="flex items-center gap-2 text-xs border border-blue-200 px-2 py-1 rounded-full cursor-pointer hover:bg-blue-100 transition">
        <Image src={assets.search_icon} alt="" />
        Search
      </p>
    </div>

    <div className="flex items-center gap-2">
      {/* <Image className="w-4 cursor-pointer" src={assets.pin_icon} alt="" /> */}

      {/* Mic button */}
  <button
    type="button"
    onClick={listening ? stopListening : startListening}
    className="flex items-center gap-1 text-xs border border-blue-200 px-2 py-1 rounded-full cursor-pointer hover:bg-blue-100 transition"
  >
    <Image src={assets.mic_icon} alt="Mic" className="w-5 h-5" />
    {listening ? "Listening..." : "Voice"}
  </button>


      <button
        type="submit"
        className={`${prompt ? 'bg-blue-500' : 'bg-blue-200'} rounded-full p-2 cursor-pointer`}
      >
        <Image
          className="w-3.5 aspect-square"
          src={prompt ? assets.arrow_icon : assets.arrow_icon_dull}
          alt=""
        />
      </button>
    </div>
  </div>
</form>


{/* Fullscreen Listening Animation */}
{listening && (
  <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md h-1/2 bg-slate-900 bg-opacity-90 backdrop-blur-md flex flex-col items-center justify-center z-50 transition-all duration-500 ease-in-out rounded-2xl shadow-xl p-4">
    
    {/* Aurora Wave Bars */}
    <div className="flex items-end justify-center space-x-2 h-32">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-4 h-10 rounded-full bg-gradient-to-t from-cyan-400 via-fuchsia-500 to-purple-600 shadow-lg animate-wave"
          style={{ animationDelay: `${-0.4 + i * 0.2}s` }}
        ></div>
      ))}
    </div>

    {/* Live Speech Text */}
    <p className="mt-4 text-slate-200 text-lg font-medium tracking-wide animate-fade-in text-center px-4">
      {transcript || "Speak your prompt now..."}
    </p>

    {/* Stop Button */}
    <button
      onClick={stopListening}
      className="mt-4 px-6 py-2 bg-red-600 rounded-full text-white font-semibold hover:bg-red-700 transition-all transform hover:scale-105 shadow-lg"
    >
      Stop
    </button>
  </div>
)}


</>
  );
};

export default PromptBox;
