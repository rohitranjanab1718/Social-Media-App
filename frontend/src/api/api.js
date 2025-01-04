import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// Add auth token to every request
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

export const loginUser = (data) => API.post("/login", data);
export const registerUser = (data) => API.post("/signup", data);

export const createPost = (user,data) => API.post("/posts", user,data);
export const getPosts = () => API.get("/posts");
export const updatePost = (id, data) => API.put(`/posts/${id}`, data);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const addComment = (postId, comment) => API.post(`/posts/${postId}/comments`, comment);
export const likePost = (postId,userId) => API.post(`/posts/${postId}/like`,{userId});

