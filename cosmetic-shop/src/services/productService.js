import axios from "axios";

const API_URL = "http://localhost:5114/api/Products";

export const getProducts = (params = {}) => {
    return axios.get(API_URL, { params });
};

export const getProductById = (id) => {
    return axios.get(`${API_URL}/${id}`);
};