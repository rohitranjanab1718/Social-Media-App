import React, { useState } from "react";
import "../styles/PostForm.css";
import { createPost, updatePost } from "../api/api";
const PostForm = ({ postToEdit, fetchPosts }) => {
    const [form, setForm] = useState(postToEdit || { title: "", content: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (postToEdit) {
                await updatePost(postToEdit._id, form);
            } else {
                await createPost(form);
            }
            fetchPosts();
            setForm({ title: "", content: "" });
        } catch (error) {
            console.error("Post Error:", error.response?.data?.message || error.message);
        }
    };

    return (
        <form className="post-form" onSubmit={handleSubmit}>
            <h3>{postToEdit ? "Edit Post" : "Create Post"}</h3>
            <input
                type="text"
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
                required
            />
            <textarea
                name="content"
                placeholder="Content"
                value={form.content}
                onChange={handleChange}
                required
            ></textarea>
            <button type="submit">{postToEdit ? "Update Post" : "Create Post"}</button>
        </form>
    );
};

export default PostForm;
