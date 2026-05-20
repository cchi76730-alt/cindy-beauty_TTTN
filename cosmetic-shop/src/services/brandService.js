import axios from "axios";

const API_URL = "http://localhost:5114/api/Brands";

export const getBrands = () => {
    return axios.get(API_URL);
};