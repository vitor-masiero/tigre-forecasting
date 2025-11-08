import axios from "axios";

// Vercel: https://python-api-virid-five.vercel.app

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export default api;
