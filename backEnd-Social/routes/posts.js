const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');

// Create Post
router.post('/', async (req, res) => {
    const newPost = new Post(req.body);

    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    }
    catch (error) {
        res.status(500).json(error)
    }
});

// Update Post
router.put('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json('The post has been updated! :)')
        }
        else {
            res.status(403).json('You Can Only Update Your Posts');
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
});

// Delete Post
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId || req.body.isAdmin) {
            await post.deleteOne();
            res.status(200).json('The post has been deleted! :)')
        }
        else {
            res.status(403).json('You Can Only Delete Your Posts');
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
});

// Comment a Post 
router.post('/:id/comments', async (req, res) => {
    const newComment = new Comment(req.body);
    
    try {
        const post = await Post.findById(req.params.id); 
        
        await post.updateOne({ $push: { comments: newComment }});
        res.status(200).json('The Post Has Been Commented');
    }
    catch (error) {
        res.status(500).json(error)
    }
});

// Get Comments
// router.get('/:id/comments', async (req, res) => {
//     try {
//         const comments = await Comment.find();
//         res.status(200).json(comments);
//     }
//     catch (error) {
//         res.status(500).json(error);
//     }
// });

// Like / Unlike Post
router.put('/:id/like', async (req, res) =>  {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId }});
            res.status(200).json('The Post Has Been Liked');
        }
        else {
            await post.updateOne({ $pull: { likes: req.body.userId }});
            res.status(200).json('The Post Has Been UnLiked');
        }
    }
    catch (error) {
        res.status(500).json(error);
    }

});

// Get A Post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    }
    catch (error) {
        res.status(500).json(error);
    }
});

// Get Friends Timeline All Posts
router.get('/friends/timeline', async (req, res) => {
    try {
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({ userId: currentUser._id });
        const friendsPost = await Promise.all(
            currentUser.followings.map((friendsId) => {
                return Post.find({ userId: friendsId })
            })
        );
        res.status(200).json(userPosts.concat(...friendsPost));
    }
    catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;