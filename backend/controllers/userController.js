import User from '../models/UserSchema.js';

export const createUser = async (req, res) => {
    // Implementation for creating a new user
    try {
        const { userId } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ userId });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create a new user without threadId
        const newUser = new User({
            userId,
        });

        // Save the user to the database
        const savedUser = await newUser.save();

        res.status(201).json(savedUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const findUser = async (req, res) => {
    // Implementation for finding a user by ID
    try {
        const { userId } = req.params;

        // Find the user by userId
        const user = await User.findOne({ userId });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ userId: user.userId });
    } catch (error) {
        console.error('Error getting user info:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const listUsers = async (req, res) => {
    // Implementation for getting a list of all users
    try {
        const userList = await User.find();

        if (!userList) {
            return res.status(404).json({ error: 'UserList not found' });
        }

        res.status(200).json({ users: userList });
    } catch (error) {
        console.log("Error getting user list", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteUser = async (req, res) => {
    // Implementation for deleting a user by ID
    try {
        const { userId } = req.params;

        // Check if the user exists
        const existingUser = await User.findOne({ userId });
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Delete the user
        await User.deleteOne({ userId });

        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
