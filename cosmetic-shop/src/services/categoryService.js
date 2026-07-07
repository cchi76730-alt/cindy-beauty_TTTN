import axios from "axios";

const API_URL = "https://localhost:7019/api/categories";

export const getCategories = () => {
    return axios.get(API_URL);
};