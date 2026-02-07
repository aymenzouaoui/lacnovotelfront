import axios from "axios";

const API = axios.create({
  baseURL: "https://lacbackend.novotel-tunis.com/api", // your backend base URL
});

export default API;
