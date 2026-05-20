import axios from "axios";

const API_URL = "http://localhost:5114/api/Promotions";

export const getPromotions = () => {
    return axios.get(API_URL);
};

export const getPromotionById = (id) => {
    return axios.get(`${API_URL}/${id}`);
};