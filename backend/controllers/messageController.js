import { OpenAI } from 'openai';
import { v4 as uuidv4 } from 'uuid';
import Message from '../models/MessageSchema.js';
import dotenv from 'dotenv';
import Thread from '../models/ThreadSchema.js';
import User from '../models/UserSchema.js';
import linkedIn from 'linkedin-jobs-api'
import { careerAssistant } from '../index.js';

dotenv.config();

// Initialize OpenAI with your API key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


const queryLinkedIn = async (queryOptions) => {
    try {
        const response = await linkedIn.query(queryOptions);
        return response;
    } catch (error) {
        console.error('Error querying LinkedIn jobs', error);
        throw error;
    }
}

async function getLinkedInJobs() {
    const queryOptions = {
        keyword: 'software engineer',
        location: 'India',
        dateSincePosted: 'past Week',
        jobType: 'full time',
        remoteFilter: 'remote',
        salary: '100000',
        experienceLevel: 'entry level',
        limit: '5'
    };

    try {
        const response = await queryLinkedIn(queryOptions);
        return response;
    } catch (error) {
        console.error('Error getting LinkedIn jobs', error);
    }
}


export const createMessage = async (req, res) => {
    // Implementation for creating a new message in a thread
    try {
        const userId = req.body.userId;

        // Check if the user exists
        const existingUser = await User.findOne({ userId });
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the thread exists
        const targetThreadId = req.body.threadId;
        if (!existingUser.threadId.includes(targetThreadId)) {
            return res.status(404).json({ error: 'Thread not found' });
        }

        // Create a message
        const prompt = req.body.prompt;
        if (!prompt) {
            return res.status(400).json({ error: 'prompt not found' });
        }

        console.log("Verified all the entries");

        const message = await openai.beta.threads.messages.create(targetThreadId, {
            role: 'user',
            content: prompt
        });

        // Create a run
        // It only creates a queued message
        const run = await openai.beta.threads.runs.create(targetThreadId, {
            assistant_id: careerAssistant.id,
            instructions: 'Keep the chats open ended and ask questions to know more'
        });


        // Making a unique id for each message
        // As each id looks same for assistnat and user in the assistant data
        const messageId = uuidv4();

        const checkStatus = async (threadId, runId) => {
            let runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
            if (runStatus.status === 'completed') {
                let messages = await openai.beta.threads.messages.list(threadId);

                // Update the thread's messageId array
                const updatedThread = await Thread.findOneAndUpdate(
                    { threadId: threadId },
                    { $push: { messageId: messageId } },
                    { new: true } // Return the updated document
                );

                // Create a message in the Message schema
                const newMessage = new Message({
                    user_id: userId,
                    thread_id: targetThreadId,
                    message_id: messageId,
                    user: messages.data[1].content[0].text.value,
                    ai: messages.data[0].content[0].text.value,
                });

                // // // Save the message to the database
                await newMessage.save();

                const response = {
                    message_id: messages.data[0].id,
                    user: messages.data[0].role,
                    usercontent: messages.data[1].content[0].text.value,
                    ai: messages.data[1].role,
                    aicontent: messages.data[0].content[0].text.value
                };

                res.status(200).json({ success: true, response });

            }

            //New case for the function
            else if (runStatus.status === 'requires_action') {
                console.log("Requires action");

                const requiredActions = runStatus.required_action.submit_tool_outputs.tool_calls;
                console.log(requiredActions);

                let toolsOutput = [];

                for (const action of requiredActions) {
                    const funcName = action.function.name;
                    //const functionArguments = JSON.parse(action.function.arguments);

                    if (funcName === "getLinkedInJobs") {
                        const output = await getLinkedInJobs();

                        if (output && output.length > 0) {
                            console.log(output[0]);
                        } else {
                            console.log('No data returned from getLinkedInJobs');
                        }

                        toolsOutput.push({
                            tool_call_id: action.id,
                            output: JSON.stringify(output)
                        });
                    } else {
                        console.log("Function not found");
                    }
                }

                // Submit the tool outputs to Assistant API
                await openai.beta.threads.runs.submitToolOutputs(
                    targetThreadId,
                    run.id,
                    { tool_outputs: toolsOutput }
                );
            }


            else {
                console.log("Run is not completed yet");
                res.status(200).json({ success: false, message: "Run is not completed yet" });
            }
        }

        setTimeout(() => {
            checkStatus(targetThreadId, run.id)
        }, 15000);

    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
};

export const getAllMessages = async (req, res) => {
    // Implementation for getting all messages for a specific thread
    try {
        const { userId, threadId } = req.params;

        // Check if the user exists
        const existingUser = await User.findOne({ userId });
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the provided threadId matches any thread associated with the user
        if (!existingUser.threadId.includes(threadId)) {
            return res.status(404).json({ error: 'Thread not found for the user' });
        }

        // Retrieve all messages for the specified thread
        let messages = await openai.beta.threads.messages.list(threadId);
        res.status(200).json({ status: 'success', messagesList: messages.data });
    } catch (error) {
        console.error('Error getting all user threads:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
