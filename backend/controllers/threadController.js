import openai from 'openai';
import Thread from '../models/ThreadSchema.js';
import User from '../models/UserSchema.js';

export const createThread = async (req, res) => {
    // Implementation for creating a new thread for a user
    try {
        const userId = req.body.userId;

        // Check if the user exists
        const existingUser = await User.findOne({ userId });

        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create a new thread
        const thread = await openai.beta.threads.create();

        // Get the thread ID
        const threadId = thread.id;

        // Create a new user without threadId
        const newThread = new Thread({
            threadId,
        });

        // Save the user to the database
        const savedThread = await newThread.save();

        // Update the user's threadId array
        const updatedUser = await User.findOneAndUpdate(
            { userId },
            { $push: { threadId: threadId } },
            { new: true } // Return the updated document
        );

        res.status(200).json({
            status: 'success',
            message: 'Thread created successfully',
            threadId,
            updatedUser
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creating thread' });
    }
};

export const getUserThreads = async (req, res) => {
    // Implementation for getting all threads for a user
    try {
        const userId = req.params.userId;

        // Find the user by userId
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return the threadId array
        res.status(200).json({ threadId: user.threadId });
    } catch (error) {
        console.error('Error getting user threads:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteThread = async (req, res) => {
    // Implementation for deleting a thread by ID for a user
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

        // Delete the thread
        // await openai.beta.threads.delete(threadId);
        await Thread.deleteOne({ threadId });

        // Remove the threadId from the user
        await User.findOneAndUpdate(
            { userId },
            { $pull: { threadId: threadId } }
        );

        res.status(200).json({
            status: 'success',
            message: 'Thread deleted successfully',
            userId,
            threadId
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error deleting thread' });
    }
};
