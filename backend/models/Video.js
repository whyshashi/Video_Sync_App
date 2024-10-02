const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
    },
    duration: {
        type: Number, // Duration in seconds
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
    },
    timestamp: {
        type: Number, // Current playback time in seconds
        default: 0,
    },
    isPaused: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
