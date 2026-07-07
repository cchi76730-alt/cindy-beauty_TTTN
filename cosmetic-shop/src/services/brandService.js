import axios from "axios";

const API_URL = "https://localhost:7019/api/admin/brands";

export const getBrands = () => {
    return axios.get(API_URL);
};