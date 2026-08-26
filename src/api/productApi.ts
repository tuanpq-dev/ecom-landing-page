import axiosClient from "./axiosClient";
import { URL } from "../config/apiUrl";

export interface SearchProductsPayload {
    search?: string;
    page?: number;
    pageSize?: number;
    categoryId?: number;
    exactCategoryOnly?: boolean;
}

export const searchProductsApi = async (payload: SearchProductsPayload = {}) => {
    return axiosClient.post(`${URL}/product/search`, payload);
};

export const getProductByIdApi = async (id: number | string) => {
    return axiosClient.get(`${URL}/product/${id}`);
};