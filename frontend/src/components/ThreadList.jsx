import React from 'react';
import { Trash2 } from 'react-feather';

const ThreadList = ({ threads, selectedThread, setSelectedThread, handleCreateThread, handleThreadDelete, handleThreadClick, handlePresetPromptClick, fetchData, presetPrompts, interested }) => {
    return (
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
    );
};

export default ThreadList;
