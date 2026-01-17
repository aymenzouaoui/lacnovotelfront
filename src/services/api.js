import axios from "axios";

const API = axios.create({
  baseURL: "https://api.novotel-tunis.com/api", // your backend base URL
});

export default API;
