import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import Markdown from 'react-markdown';
import toast from 'react-hot-toast';

// --- PrismJS Imports ---
// 1. Import Prism core
import Prism from 'prismjs';

// 2. Import the languages you want to support
// (This is an example, add any other languages you need)
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-python';

// 3. Make sure you have imported a Prism theme CSS file in your main layout file (e.g., layout.tsx or _app.js)
// Example: import '../styles/prism-your-theme.css';
// --- End PrismJS Imports ---


const Message = ({ role, content }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // This effect runs once to get available voices for text-to-speech
    useEffect(() => {
        const handleVoicesChanged = () => {
            // setVoices(window.speechSynthesis.getVoices()); // You weren't using the voices state, so this is optional
        };
        window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);
        return () => {
            window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
        };
    }, []);

    const playVoice = (text) => {
        if (!text) return;

        if (isPaused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
            return;
        }

        if (isPlaying) {
            window.speechSynthesis.pause();
            setIsPaused(true);
            return;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.rate = 0.85;
        utterance.pitch = 1.1;

        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find((v) =>
            ["female", "woman", "girl", "samantha", "zira"].some((k) =>
                v.name.toLowerCase().includes(k)
            )
        );
        if (femaleVoice) utterance.voice = femaleVoice;

        utterance.onend = () => {
            setIsPlaying(false);
            setIsPaused(false);
        };

        setIsPlaying(true);
        setIsPaused(false);
        window.speechSynthesis.speak(utterance);
    };

    const copyMessage = () => {
        navigator.clipboard.writeText(content);
        toast.success('Message copied to clipboard');
    };

    return (
        <div className='flex flex-col bg-amber-50 items-center w-full max-w-3xl text-sm'>
            <div className={`flex flex-col w-full mb-8 ${role === 'user' && 'items-end'}`}>
                <div className={`group relative flex max-w-3xl py-3 rounded-xl ${role === 'user' ? 'bg-[#d6d6e3] px-5' : 'gap-3'} `}>
                    <div className={`opacity-0 group-hover:opacity-100 absolute ${role === 'user' ? '-left-16 top-2.5' : 'left-9 -bottom-6'} transition-all `}>
                        <div className='flex items-center gap-2 opacity-70'>
                            {role === 'user' ? (
                                <>
                                    <Image onClick={copyMessage} src={assets.copy_icon} alt='' className='w-4 cursor-pointer' />
                                    <Image src={assets.pencil_icon} alt='' className='w-4.5 cursor-pointer' />
                                </>
                            ) : (
                                <>
                                    <Image onClick={copyMessage} src={assets.copy_icon} alt='' className='w-4.5 cursor-pointer' />
                                    <Image src={assets.regenerate_icon} alt='' className='w-4 cursor-pointer' />
                                    <Image src={assets.like_icon} alt='' className='w-4 cursor-pointer' />
                                    <Image src={assets.dislike_icon} alt='' className='w-4 cursor-pointer' />
                                    <span
                                        className={`cursor-pointer w-6 h-5.8 transition-all ${isPlaying && !isPaused ? "animate-pulse" : ""} ${isPaused ? "opacity-70" : "hover:opacity-80"}`}
                                        onClick={() => playVoice(content)}
                                        dangerouslySetInnerHTML={{
                                            __html: isPaused
                                                ? `<svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" class="w-6 h-6"><path d="M6 19h4V5H6zm8-14v14h4V5h-4z"/></svg>` // pause icon
                                                : `<svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" class="w-6 h-6"><path d="M8 5v14l11-7z"/></svg>` // play icon
                                        }}
                                    ></span>
                                </>
                            )}
                        </div>
                    </div>
                    {role === 'user' ? (
                        <span className='text-black'>{content}</span>
                    ) : (
                        <>
                            <Image src={assets.logo_icon} alt='' className='h-9 w-9 p-1 border border-white/15 rounded-full' />
                            <div className="prose prose-md text-black break-words max-w-full  space-y-3 min-w-0">
                                <Markdown
                                    components={{
                                        pre({ node, ...props }) {
                                            // The 'code' renderer below will handle the children of pre
                                            return (
                                                <div className="relative bg-[#2d3140] p-4 rounded-md overflow-hidden">
                                                    <button
                                                        onClick={(e) => {
                                                            const codeElement = e.currentTarget.nextElementSibling?.querySelector('code');
                                                            if (codeElement) {
                                                                navigator.clipboard.writeText(codeElement.innerText);
                                                                toast.success("Code copied!");
                                                            }
                                                        }}
                                                        className="flex items-center gap-1.5 absolute top-2 right-2 px-2 py-1.5 text-xs text-white bg-[#757171] rounded hover:bg-[#555] transition"
                                                    >
                                                        <Image src={assets.copy_icon} alt="copy" className="w-4 h-4 invert" />
                                                        Copy code
                                                    </button>
                                                    <pre className="overflow-x-auto" {...props} />
                                                </div>
                                            );
                                        },
                                        code({ node, inline, className, children, ...props }) {
                                            if (inline) {
                                                return (
                                                    <code className="bg-[#272727] px-1 py-0.5 rounded text-white" {...props}>
                                                        {children}
                                                    </code>
                                                );
                                            }

                                            const match = /language-(\w+)/.exec(className || '');
                                            const lang = match ? match[1] : 'text';
                                            const code = String(children).replace(/\n$/, '');

                                            if (Prism.languages[lang]) {
                                                const highlightedHtml = Prism.highlight(code, Prism.languages[lang], lang);
                                                return (
                                                    <code
                                                        className={className}
                                                        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                                                        {...props}
                                                    />
                                                );
                                            } else {
                                                // Fallback for unsupported languages
                                                return <code className={className} {...props}>{children}</code>;
                                            }
                                        },
                                    }}
                                >
                                    {content}
                                </Markdown>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Message;