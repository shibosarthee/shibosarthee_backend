import Message from "../Models/Message.js";
import User from "../Models/User.js";
// Store online users and their socket IDs
const onlineUsers = new Map();
// Store typing status
const typingUsers = new Map();

export const initializeSocket = (io) => {
    io.on('connection', (socket) => {
        // Handle user connection
        socket.on('user_connected', async (userId) => {
            onlineUsers.set(userId, socket.id);
            io.emit('user_status_change', { userId, status: 'online' });
        });

        // Handle private message
        socket.on('private_message', async (data) => {
            try {
                const { senderId, receiverId, content } = data;
                
                // Create a unique room name for the conversation
                const room = [senderId, receiverId].sort().join('-');
                
                // Save message to database
                const message = new Message({
                    sender: senderId,
                    receiver: receiverId,
                    content,
                    room,
                    status: 'sent'
                });
                await message.save();

                // Send to receiver if online
                const receiverSocketId = onlineUsers.get(receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('new_message', {
                        messageId: message._id,
                        senderId,
                        content,
                        timestamp: message.timestamp
                    });
                }

                // Confirm message sent to sender
                socket.emit('message_status', {
                    messageId: message._id,
                    status: 'sent'
                });
            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        // Handle typing status
        socket.on('typing_start', ({ senderId, receiverId }) => {
            const receiverSocketId = onlineUsers.get(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('typing_status', {
                    userId: senderId,
                    isTyping: true
                });
            }
        });

        socket.on('typing_end', ({ senderId, receiverId }) => {
            const receiverSocketId = onlineUsers.get(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('typing_status', {
                    userId: senderId,
                    isTyping: false
                });
            }
        });

        // Handle message status updates
        socket.on('message_delivered', async ({ messageId }) => {
            try {
                const message = await Message.findByIdAndUpdate(
                    messageId,
                    { status: 'delivered' },
                    { new: true }
                );
                if (message) {
                    const senderSocketId = onlineUsers.get(message.sender.toString());
                    if (senderSocketId) {
                        io.to(senderSocketId).emit('message_status', {
                            messageId,
                            status: 'delivered'
                        });
                    }
                }
            } catch (error) {
                console.error('Error updating message status:', error);
            }
        });

        socket.on('message_read', async ({ messageId }) => {
            try {
                const message = await Message.findByIdAndUpdate(
                    messageId,
                    { status: 'read' },
                    { new: true }
                );
                if (message) {
                    const senderSocketId = onlineUsers.get(message.sender.toString());
                    if (senderSocketId) {
                        io.to(senderSocketId).emit('message_status', {
                            messageId,
                            status: 'read'
                        });
                    }
                }
            } catch (error) {
                console.error('Error updating message status:', error);
            }
        });

        // Handle user disconnection
        socket.on('disconnect', () => {
            // Find and remove disconnected user
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    io.emit('user_status_change', { userId, status: 'offline' });
                    break;
                }
            }
        });
    });
};

// Controller methods for REST API endpoints
export const getChatHistory = async (req, res) => {
    try {
        const { userId, otherUserId } = req.params;
        const room = [userId, otherUserId].sort().join('-');

        const messages = await Message.find({ room })
            .sort({ createdAt: 1 })
            .populate('sender')
            .populate('receiver');

        res.status(200).json({
            success: true,
            data: messages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching chat history',
            error: error.message
        });
    }
};

export const getRecentChats = async (req, res) => {
    try {
        const { userId } = req.params;

        // Get the last message from each conversation where user is involved
        const recentChats = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: mongoose.Types.ObjectId(userId) },
                        { receiver: mongoose.Types.ObjectId(userId) }
                    ]
                }
            },
            {
                $sort: { timestamp: -1 }
            },
            {
                $group: {
                    _id: '$room',
                    lastMessage: { $first: '$$ROOT' }
                }
            }
        ]);

        // Populate user details
        const populatedChats = await Message.populate(recentChats, [
            { path: 'lastMessage.sender', select: 'name profilePic' },
            { path: 'lastMessage.receiver', select: 'name profilePic' }
        ]);

        res.status(200).json({
            success: true,
            data: populatedChats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching recent chats',
            error: error.message
        });
    }
};

