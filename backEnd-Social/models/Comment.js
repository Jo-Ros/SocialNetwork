const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true,
        max: 500
    },
    likes: {
        type: [String],
    },
    isAdmin: false,
    
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);