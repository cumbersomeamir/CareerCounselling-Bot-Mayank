import React, { useEffect } from 'react';

const Messages = ({ selectedThread, inputPrompt, setInputPrompt, isSending, handleSendPrompt, messages, interested, techStack, handlePresetPromptClick }) => {
    return (
        <div className="w-3/4 p-6">
            <div className='overflow-y-auto h-[90%]'>
                <ul>
                    {/* The order is basically -> 1. assistant, and 2.user, so need to reverse it out */}
                    {messages
                        .slice()
                        .reverse() // Reverse the order of messages
                        .map((message) => (
                            <li key={message.id} className="mb-2 p-2 rounded-lg bg-gray-200">
                                {message.role === 'user' ? 'User: ' : 'Assistant: '}{message.content[0].text.value}
                            </li>
                        ))}
                </ul>
            </div>
            {/* If possible use presets above of input, and with overflow-x */}
            {/* Input Bar for Sending Prompts */}
            <div className="mt-4 flex">
                <input
                    type="text"
                    value={inputPrompt}
                    onChange={(e) => setInputPrompt(e.target.value)}
                    className="p-2 border border-gray-300 flex-1 rounded-l"
                    placeholder="Take help you need from counsellor bot...."
                />
                <button
                    onClick={handleSendPrompt}
                    className={`bg-[#37a462] text-white p-2 rounded-r ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isSending}
                >
                    {isSending ? 'Sending...' : 'Send'}
                </button>
            </div>
        </div>
    );
};

export default Messages;
