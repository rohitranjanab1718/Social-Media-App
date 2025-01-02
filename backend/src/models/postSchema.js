const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        content: {
            type: String,
            required: [true, "Content is required"],
            trim: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        likes: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
            },
        ],
        comments: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                text: {
                    type: String,
                    required: [true, "Comment text is required"],
                    trim: true,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
