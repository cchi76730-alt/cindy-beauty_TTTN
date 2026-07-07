import axios from "axios";

const API_URL = "https://localhost:7019/api/Products";

export const getProducts = (params = {}) => {
    return axios.get(API_URL, { params });
};

export const getProductById = (id) => {
    return axios.get(`${API_URL}/${id}`);
};