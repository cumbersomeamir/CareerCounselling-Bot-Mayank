import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2 } from 'react-feather';
import ThreadList from './ThreadList';
import Messages from './Messages';

const API_BASE_URL = 'http://localhost:5000/api'; // Change this to your API URL

const Threads = () => {
    const [threads, setThreads] = useState([]); //Fetching all the threads for a user
    const [selectedThread, setSelectedThread] = useState(null); // For selecting thread
    const [messages, setMessages] = useState([]); //For messages
    const [inputPrompt, setInputPrompt] = useState(''); // For input prompt
    const [isSending, setIsSending] = useState(false); // For handling onyl a single click on send button
    const [interested, setInterested] = useState([]); // Keep the notes of the conversation
    const userId = localStorage.getItem('userId'); //Getting the user id

    const [presetPrompts, setPresetPrompts] = useState([
        "Hi, my name is ..",
        "I am currently pursuing ..",
        "I have interest in ..",
        "What is the roadmap to become..",
        "How can I find a job?",
        "How can I find a internships?",
        "What career path can I choose if I know..?",
    ]);

    const techStack = ["JavaScript", "React", "Node.js", "Python", "Java", "HTML", "CSS"];

    const fetchData = async () => {
        try {
            if (userId) {
                const response = await axios.get(`${API_BASE_URL}/thread/${userId}`);
                setThreads(response.data.threadId);
            }
        } catch (error) {
            console.error('Error fetching threads:', error);
        }
    };

    //  Sets the prompt in the input field
    //  Removed the searching once the preset is clicked 
    const handlePresetPromptClick = async (presetPrompt) => {
        try {
            // Set the sending state to true to disable the button
            // setIsSending(true);

            // Also set the input prompt
            setInputPrompt(presetPrompt);

            // Make a request to send the preset prompt
            // const response = await axios.post(`${API_BASE_URL}/messages/create`, {
            //     userId,
            //     threadId: selectedThread,
            //     prompt: presetPrompt,
            // });

            // After sending the prompt, update the messages
            // const updatedMessages = await axios.get(`${API_BASE_URL}/messages/getAll/${userId}/${selectedThread}`);
            // setMessages(updatedMessages.data.messagesList);

            // Clear the input prompt
            // setInputPrompt('');

            // Remove the selected preset prompt from the list
            setPresetPrompts((prevPrompts) => prevPrompts.filter((prompt) => prompt !== presetPrompt));
        } catch (error) {
            console.error('Error sending preset prompt:', error);
        }
    };


    const handleCreateThread = async () => {
        try {
            // Show a confirmation dialog
            const confirmed = window.confirm('You want to create a new thread?');

            if (!confirmed) {
                return; // Return nothing if not confirmed
            }

            const response = await axios.post(`${API_BASE_URL}/thread/create`, { userId });
            const newThreadId = response.data.threadId;

            // Update the state with the newly created thread
            setThreads([...threads, newThreadId]);
            setSelectedThread(newThreadId);
        } catch (error) {
            console.error('Error creating thread:', error);
        }
    };

    const handleThreadClick = (threadId) => {
        // Set the selected thread when a thread is clicked
        setSelectedThread(threadId);
    };

    const handleSendPrompt = async () => {
        try {
            if (selectedThread && inputPrompt) {

                // Set the sending state to true to disable the button
                setIsSending(true);

                const response = await axios.post(`${API_BASE_URL}/message/create`, {
                    userId,
                    threadId: selectedThread,
                    prompt: inputPrompt,
                });

                // After sending the prompt, update the messages
                const updatedMessages = await axios.get(`${API_BASE_URL}/message/getAll/${userId}/${selectedThread}`);
                setMessages(updatedMessages.data.messagesList);

                // Clear the input prompt
                setInputPrompt('');
            }
        } catch (error) {
            console.error('Error sending prompt:', error);
        } finally {
            // Reset the sending state to enable the button
            setIsSending(false);
        }
    };


    // Delete the thread
    const handleThreadDelete = async (threadId) => {
        try {
            // Show a confirmation dialog
            const confirmed = window.confirm('Are you sure you want to delete this thread?');

            if (!confirmed) {
                return; // Return nothing if not confirmed
            }

            // Make a request to your backend to delete the thread
            await axios.delete(`${API_BASE_URL}/thread/delete/${userId}/${threadId}`);

            // Update the state to remove the deleted thread
            setThreads(threads.filter(id => id !== threadId));

            // If the deleted thread was the selectedThread, reset selectedThread to null
            if (selectedThread === threadId) {
                setSelectedThread(null);
            }

            // Clear the messages
            setMessages([]);

            fetchData();
        } catch (error) {
            console.error('Error deleting thread:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [userId]);

    useEffect(() => {
        // Check if it's currently sending and the inputPrompt is not an empty string
        if (isSending && inputPrompt.trim() !== '') {
            // Use a Set to keep track of unique technologies
            const uniqueTechnologies = new Set(interested);

            // Check if each technology in techStack is present in the inputPrompt
            techStack.forEach((tech) => {
                const regex = new RegExp(`\\b${tech}\\b`, 'i'); // \b ensures a whole word match, 'i' for case-insensitivity

                // Check if the technology appears in the inputPrompt
                if (regex.test(inputPrompt)) {
                    // If found and not already in the uniqueTechnologies set, update the interested state
                    if (!uniqueTechnologies.has(tech)) {
                        uniqueTechnologies.add(tech);
                        setInterested((prevInterested) => {
                            const newInterested = [...prevInterested, tech];
                            console.log('New interested technologies:', newInterested);
                            return newInterested;
                        });
                    }
                }
            });
        }
    }, [isSending]);






    useEffect(() => {
        const fetchMessages = async () => {
            try {
                if (selectedThread) {
                    const response = await axios.get(`${API_BASE_URL}/message/getAll/${userId}/${selectedThread}`);
                    setMessages(response.data.messagesList);
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, [userId, selectedThread]);

    // return (
    //     <div className="flex h-screen">
    //       {/* Left Column (Threads) */}
    //       <ThreadList
    //         threads={threads}
    //         selectedThread={selectedThread}
    //         setSelectedThread={setSelectedThread}
    //         handleCreateThread={handleCreateThread}
    //         handleThreadDelete={handleThreadDelete}
    //         handleThreadClick={handleThreadClick}
    //         handlePresetPromptClick={handlePresetPromptClick}
    //         fetchData={fetchData}
    //         presetPrompts={presetPrompts}
    //         interested={interested}
    //       />
    
    //       {/* Right Column (Messages) */}
    //       <Messages
    //         selectedThread={selectedThread}
    //         inputPrompt={inputPrompt}
    //         setInputPrompt={setInputPrompt}
    //         isSending={isSending}
    //         handleSendPrompt={handleSendPrompt}
    //         messages={messages}
    //         interested={interested}
    //         techStack={techStack}
    //         handlePresetPromptClick={handlePresetPromptClick}
    //       />
    //     </div>
    //   );

    return (
        <div className="flex h-screen">
            {/* Left Column (Threads) */}
            <div className="w-1/4 p-6 border-r">
                <h2 className="text-2xl font-bold mb-4">Career Counselor</h2>


                {/* Preset Prompts */}
                <h3 className="text-lg font-bold mb-2">Preset Prompts:</h3>
                <div className="mt-4 h-[25%] overflow-x-auto">

                    <ul>
                        {presetPrompts.map((presetPrompt, index) => (
                            <li
                                key={index}
                                className="mb-2 cursor-pointer p-2 rounded bg-gray-300"
                                onClick={() => handlePresetPromptClick(presetPrompt)}
                            >
                                {presetPrompt}
                            </li>
                        ))}
                    </ul>
                </div>


                <br />
                <button className="bg-[#37a462] text-white px-4 py-2 rounded mb-4" onClick={handleCreateThread}>
                    Create Conversation
                </button>

                <div className='h-[30%] overflow-y-auto'>
                    <ul>
                        {threads.slice().reverse().map((threadId) => (
                            <li
                                key={threadId}
                                className={`mb-2 p-2 rounded cursor-pointer flex items-center justify-between ${selectedThread === threadId ? 'bg-blue-300' : 'bg-gray-200'}`}
                                onClick={() => handleThreadClick(threadId)}
                            >
                                {threadId.slice(8)}

                                <Trash2
                                    className='hover:text-red-500 pl-1'
                                    onClick={() => handleThreadDelete(threadId)}
                                />

                            </li>
                        ))}
                    </ul>
                </div>
                
                <h3 className="text-md font-bold mt-4">Converstation Highlights:</h3>
                {/* Interested Keywords */}
                <div className="flex flex-wrap">
                    {interested.map((keyword, index) => (
                        <div key={index} className="bg-gray-300 p-2 rounded m-1 flex items-center">
                            <span className="mr-2 text-sm font-bold">{keyword}</span>
                        </div>
                    ))}
                </div>
            </div>




            {/* Right Column (Messages) */}
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
        </div>
    );


};

export default Threads;
