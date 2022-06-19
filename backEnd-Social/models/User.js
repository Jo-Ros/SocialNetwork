const mongoose = require('mongoose');

const UserShema = new mongoose.Schema({
    username: {
        type: String,
        min: 3,
        max: 20,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        min: 6,
        required: true,
    },
    profilePicture: {
        type: String,
        default: ''
    },
    followers: {
        type: [String],
    },
    followings: {
        type: [String],
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        max: 50
    },
}, { timestamps: true })

module.exports = mongoose.model('User', UserShema);