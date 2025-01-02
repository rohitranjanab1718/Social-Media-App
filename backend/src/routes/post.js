const express = require('express');
const postRouter = express.Router();
const User = require('../models/userSchema');
const Post = require('../models/postSchema');
postRouter.post("/posts", async (req, res) => {
    const { title, content, userId } = req.body;
    console.log(title);
    try {
        // Validate user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create and save post
        const post = new Post({ title, content, userId });
        await post.save();

        // Add post to user's post list
        user.posts.push(post._id);
        await user.save();

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: "Failed to create post", error: error.message });
    }
});

postRouter.get("/posts", async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("userId", "username email") // Populate user details
            .populate("comments.userId", "username email") // Populate comment user details
            .sort({ createdAt: -1 }); // Sort by newest first

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch posts", error: error.message });
    }
});

postRouter.get("/posts/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findById(id)
            .populate("userId", "username email")
            .populate("comments.userId", "username email");

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch post", error: error.message });
    }
});

postRouter.put("/posts/:id", async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Update fields
        post.title = title || post.title;
        post.content = content || post.content;

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: "Failed to update post", error: error.message });
    }
});

postRouter.delete("/posts/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Remove post reference from user's post list
        const user = await User.findById(post.userId);
        if (user) {
            user.posts = user.posts.filter((postId) => postId.toString() !== id);
            await user.save();
        }

        // Delete the post
        await Post.findByIdAndDelete(id);

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete post", error: error.message });
    }
});

postRouter.post("/posts/:id/like", async (req, res) => {
    const id  = req.params.id; // Post ID
    const { userId } = req.body; // User ID
    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        console.log(post);
        // Check if the user has already liked the post
        const likeIndex = post.likes.findIndex((like) =>like.userId.toString()===userId);
        console.log(likeIndex);
        if (likeIndex === -1) {
            // Add a like
            post.likes.push({ userId });
            await post.save();
            return res.status(200).json({ message: "Post liked", post });
        } else {
            // Remove the like
            post.likes.splice(likeIndex, 1);
            await post.save();
            return res.status(200).json({ message: "Post unliked", post });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to like/unlike post", error: error.message });
    }
});

postRouter.post("/posts/:id/comments", async (req, res) => {
    const { id } = req.params; // Post ID
    const { userId, text } = req.body; // User ID and comment text
    console.log(id);
    console.log(userId)
    console.log(text);
    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Validate the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Add a new comment
        const comment = {
            userId,
            text,
        };

        post.comments.push(comment);
        await post.save();

        res.status(201).json({ message: "Comment added", post });
    } catch (error) {
        res.status(500).json({ message: "Failed to add comment", error: error.message });
    }
});

postRouter.delete("/posts/:postId/comment/:commentId", async (req, res) => {
    const { postId, commentId } = req.params; // Post ID and Comment ID

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Find the comment index
        const commentIndex = post.comments.findIndex((comment) => comment._id.toString() === commentId);

        if (commentIndex === -1) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Remove the comment
        post.comments.splice(commentIndex, 1);
        await post.save();

        res.status(200).json({ message: "Comment deleted", post });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete comment", error: error.message });
    }
});

module.exports = postRouter;