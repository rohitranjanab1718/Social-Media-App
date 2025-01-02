import React, { useEffect, useState } from "react";
import "../styles/Home.css";
import { getPosts, createPost, deletePost, likePost, addComment } from "../api/api";
const Home = () => {
    const [posts, setPosts] = useState([]);
    const [form, setForm] = useState({ title: "", content: "" });
    const [comment, setComment] = useState("");
    const [userId, setUserId] = useState(""); // Assume user ID is stored after login/signup
    
    useEffect(() => {
        fetchPosts();
        const user = JSON.parse(localStorage.getItem("user"));
        setUserId(user);
    }, []);

    const fetchPosts = async () => {
        const { data } = await getPosts();
        setPosts(data);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        await createPost({...form,userId});
        setForm({ title: "", content: "" });
        fetchPosts();
    };

    const handleLike = async (postId,userId) => {
        await likePost(postId,userId);
        fetchPosts();
    };

    const handleComment = async (postId,userId) => {
        await addComment(postId, {userId:userId, text: comment });
        setComment("");
        fetchPosts();
    };

    return (
        <div className="container">
        <div className="home">
            <h1>Welcome to Social Media App</h1>
            <form className="post-form" onSubmit={handleCreate}>
                <input
                    type="text"
                    placeholder="Post Title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                />
                <textarea
                    placeholder="Post Content"
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    required
                ></textarea>
                <button type="submit">Create Post</button>
            </form>
            <div className="post-list">
                {posts.map((post) => (
                    <div key={post._id} className="post">
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>
                        <button onClick={() => handleLike(post._id,userId)}>
                            {post.likes.includes(userId) ? "Unlike" : "Like"} ({post.likes.length})
                        </button>
                        <ul className="comments">
                            {post.comments.map((comment) => (
                                <li key={comment._id}>{comment.text}</li>
                            ))}
                        </ul>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleComment(post._id,userId);
                            }}
                        >
                            <input
                                type="text"
                                placeholder="Add a comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                            />
                            <button type="submit">Comment</button>
                        </form>
                        <button onClick={() => deletePost(post._id).then(fetchPosts)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
};

export default Home;
