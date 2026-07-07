import axios from "axios";

const API_URL = "https://localhost:7019/api/Promotions";

export const getPromotions = () => {
    return axios.get(API_URL);
};

export const getPromotionById = (id) => {
    return axios.get(`${API_URL}/${id}`);
};