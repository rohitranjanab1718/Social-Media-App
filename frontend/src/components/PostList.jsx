import React, { useEffect, useState } from "react";
import { getPosts, createPost, deletePost, likePost } from "../api/api";

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [form, setForm] = useState({ title: "", content: "" });
    const [comment, setComment] = useState("");

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        const { data } = await getPosts();
        setPosts(data);
    };

    const handleLike = async (postId) => {
        await likePost(postId);
        fetchPosts();
    };

    const handleComment = async (postId) => {
        await addComment(postId, { text: comment });
        setComment("");
        fetchPosts();
    };

    return (
        <div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    createPost(form).then(fetchPosts);
                }}
            >
                <input
                    name="title"
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                />
                <textarea
                    name="content"
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    required
                />
                <button type="submit">Create Post</button>
            </form>
            <ul>
                {posts.map((post) => (
                    <li key={post._id}>
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>
                        <button onClick={() => handleLike(post._id)}>
                            {post.likes.includes(userId) ? "Unlike" : "Like"} ({post.likes.length})
                        </button>
                        <ul>
                            {post.comments.map((comment) => (
                                <li key={comment._id}>{comment.text}</li>
                            ))}
                        </ul>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleComment(post._id);
                            }}
                        >
                            <input
                                placeholder="Add a comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <button type="submit">Comment</button>
                        </form>
                        <button onClick={() => deletePost(post._id).then(fetchPosts)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
