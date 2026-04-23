// utils/auth.js
export const setToken = (token) => localStorage.setItem("token", token);
export const getToken = () => localStorage.getItem("token");

// Save user info
export const setUser = (user) => localStorage.setItem("user", JSON.stringify(user));
export const getUser = () => JSON.parse(localStorage.getItem("user"));