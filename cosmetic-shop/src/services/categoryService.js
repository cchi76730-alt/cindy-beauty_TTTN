import axios from "axios";

const API_URL = "http://localhost:5114/api/categories";

export const getCategories = () => {
    return axios.get(API_URL);
};