import axios from "axios";

// Vercel: https://python-api-virid-five.vercel.app

const api = axios.create({
  baseURL: "https://python-api-virid-five.vercel.app",
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export default api;
