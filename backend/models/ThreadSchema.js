import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({
    threadId: {
        type: String,
        required: true,
        unique: true,
    },
    messageId: [String],
});

const Thread = mongoose.model('Thread', threadSchema);

export default Thread;
