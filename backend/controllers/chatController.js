const Message = require('../models/Message');

exports.getMessages = async (req, res) => {
    try {
        const { roomId } = req.params;
        const messages = await Message.find({ room: roomId }).populate('user', 'username');
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving messages', error });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { roomId, content } = req.body;
        const message = new Message({
            user: req.userId,
            room: roomId,
            content,
        });
        await message.save();
        res.status(201).json({ message: 'Message sent' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending message', error });
    }
};
