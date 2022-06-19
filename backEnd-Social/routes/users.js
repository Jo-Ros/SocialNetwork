const User = require('../models/User');
const router = require('express').Router();
const bcrypt = require('bcrypt');

// Update User
router.put('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }
            catch (error) {
                return res.status(500).json(error);
            }
        }

        try {
            await User.findByIdAndUpdate(req.params.id, { $set: req.body });
            res.status(200).json('Account has been Updated')
        }
        catch (error) {
            return res.status(500).json(error);
        }
    }
    else {
        return res.status(403).json('You Can Only Update Your Account:')
    }
});

// Delete User
router.delete('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            await User.findByIdAndDelete( req.params.id );
            res.status(200).json('Account has been Deleted')
        }
        catch (error) {
            return res.status(500).json(error);
        }
    }
    else {
        return res.status(403).json('You Can Delete Only Your Account:')
    }
});

// Get One User
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const {password, updatedAt, isAdmin, ...shownDatas} = user._doc;

        res.status(200).json(shownDatas);
    }
    catch (error) {
        res.status(500).json(error);
    }
});

// Follow a User
router.put('/:id/follow', async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { followings: req.params.id } });

                res.status(200).json("user has been followed");
            } 
            else {
                res.status(403).json("you allready follow this user");
            }
        } 
        catch (error) {
            res.status(500).json(error);
        }
    } 
    else {
        res.status(403).json("you cant follow yourself");
    }
});

// Unfollow a User
router.put('/:id/unfollow', async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { followings: req.params.id } });

                res.status(200).json("User Has Been Unfollowed");
            } 
            else {
                res.status(403).json("You are Not Following This User");
            }
        } 
        catch (error) {
          res.status(500).json(error);
        }
    } 
    else {
        res.status(403).json("you cant unfollow yourself");
    }
})


module.exports = router;