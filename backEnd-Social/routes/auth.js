const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// REGISTER
router.post('/register', async (req, res) => {
    try {
        // Generate Hashed Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create New User
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        // Save User
        const user = await newUser.save();
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json(error);
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if(!user) res.status(404).json('This User Does Not Exists');
        // !user && res.status(404).json('this blablabla...')

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword) res.status(400).json('Wrong Password');

        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;