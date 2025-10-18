'use client';
/* eslint-disable react/no-unescaped-entities */

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { assets } from "../../assets/assets";
import Sidebar from "../../components/Sidebar";
import PromptBox from "../../components/PromptBox";
import Message from "../../components/Message";
import { useAppContext } from "../../context/AppContext";
import { useRouter } from "next/navigation";
import { Code } from "lucide-react";


export default function Home() {
   
  const [expand,setExpand] = useState(false);
  const [messages,setMessages] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const {selectedChat} = useAppContext();
  const containerRef = useRef(null);
  const router = useRouter();

  useEffect(()=>{
    if(selectedChat){
      setMessages(selectedChat?.messages || []);
    }
  },[selectedChat])

  useEffect(()=>{
    if(containerRef.current){
      containerRef.current.scrollTo({
        top:containerRef.current.scrollHeight,
        behavior:"smooth",
    })
    }
  },[messages])


 
  return (
    <div>
     <div className="flex h-screen bg-blue-50"> {/* page background */}
  <Sidebar expand={expand} setExpand={setExpand} />
  <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 bg-white text-gray-900 relative"> {/* main chat area */}
    
    <div className="md:hidden absolute px-4 top-6 flex items-center justify-between w-full">
      <Image 
        onClick={()=> (expand ? setExpand(false):setExpand(true))} 
        className="rotate-180" 
        src={assets.menu_icon} 
        alt="" 
      />
      <Image className="opacity-70" src={assets.chat_icon} alt="" />
    </div>

    {messages.length == 0 ? (
      <>
      <div className="flex items-center gap-3">
        <Image src={assets.logo_icon} alt="" className="h-16" />
        {/* <div className="w-7 h-7 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Code className="h-4 w-4 text-white" />
            </div> */}
        <p className="text-2xl font-medium text-blue-700">Hi, I'm Code Gen.</p> {/* title blue */}
      </div>
      <p className="text-sm mt-2 text-gray-700" >How can I help you today?</p>
      <div className="hidden lg:flex flex-wrap gap-4 justify-center mt-8">
  {/* Each image card */}
  <div className="w-60 h-80 relative rounded-lg overflow-hidden shadow-lg">
    <img
      src="/images/101.jpeg"// replace with your actual image path
      alt="Instant Film"
      className="w-full h-full object-cover"
    />
    <p className="absolute bottom-2 left-2 text-white bg-black/50 px-2 py-1 rounded text-sm">
      Instant Film
    </p>
  </div>

  <div className="w-60 h-80 relative rounded-lg overflow-hidden shadow-lg">
    <img
      src="/images/103.jpeg"
      alt="Professional Headshot"
      className="w-full h-full object-cover"
    />
    <p className="absolute bottom-2 left-2 text-white bg-black/50 px-2 py-1 rounded text-sm">
      Pro Headshot
    </p>
  </div>

  <div className="w-60 h-80 relative rounded-lg overflow-hidden shadow-lg">
    <img
      src="/images/104.jpeg"
      alt="Custom Mini Figure"
      className="w-50 h-50 object-cover"
    />
    <p className="absolute bottom-2 left-2 text-white bg-black/50 px-2 py-1 rounded text-sm">
      Custom Mini Figure
    </p>
  </div>

  <div className="w-60 h-80 relative rounded-lg overflow-hidden shadow-lg">
    <img
      src="/images/105.webp"
      alt="90s Pixie Cut"
      className="w-full h-full object-cover"
    />
    <p className="absolute bottom-2 left-2 text-white bg-black/50 px-2 py-1 rounded text-sm">
      90s Pixie Cut
    </p>
  </div>
</div>

      </>
    ) : (
      <div ref={containerRef} 
           className="relative flex flex-col items-center justify-start w-full mt-20 max-h-screen overflow-y-auto bg-blue-50 p-4 rounded-lg"> {/* message container soft blue */}
        <p className="fixed top-8 border border-transparent hover:border-blue-300/50 py-1 px-2 rounded-lg font-semibold mb-6 text-blue-800">
          {selectedChat.name}
        </p>
        {messages.map((msg,index) => (
          <Message key={index} role={msg.role} content={msg.content} />
        ))}
        
        {isLoading && (
          <div className="flex gap-4 max-w-3xl w-full py-3">
            <Image className="h-9 w-9 p-1 border border-blue-200 rounded-full" src={assets.logo_icon} alt="Logo"/>
            <div className="loader flex justify-center items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-blue-400 animate-bounce"></div>
              <div className="w-1 h-1 rounded-full bg-blue-400 animate-bounce"></div>
              <div className="w-1 h-1 rounded-full bg-blue-400 animate-bounce"></div>
            </div>
          </div>
        )}

      </div>
    )}

    <PromptBox isLoading={isLoading} setIsLoading={setIsLoading} />
    <p className="text-xs absolute bottom-1 text-gray-500">AI-generated, for reference only</p>

  </div>
</div>

    </div>
  );
}
