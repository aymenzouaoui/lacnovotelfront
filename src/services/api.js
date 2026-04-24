import axios from "axios";

const API = axios.create({
  baseURL: "https://backendlac.novotellac.com/api", // your backend base URL
});

export default API;
