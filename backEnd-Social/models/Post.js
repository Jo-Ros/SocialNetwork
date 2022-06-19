const mongoose = require('mongoose');
const Comment = require('../models/Comment');

const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        max: 50
    },
    text: {
        type: String,
        max: 500
    },
    image: {
        type: String,
    },
    likes: {
        type: [String],
    },
    comments: {
        type: [{}],
    },
    isAdmin: false,
    
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);