import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_APP_SERVER_BASE_API}`,
  withCredentials: true,
});

export default API;
