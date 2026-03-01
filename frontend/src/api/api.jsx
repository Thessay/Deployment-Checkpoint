import axios from "axios";
const API = axios.create({ baseURL: "/api/users" });
export const getUsers = () => API.get("/");
export const addUser = (user) => API.post("/", user);