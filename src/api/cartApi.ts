import axiosClient from "./axiosClient";
import { URL } from "../config/apiUrl";

export interface AddToCartPayload {
    variantId: number;
    quantity: number;
}

export const addToCartApi = async (payload: AddToCartPayload) => {
    return axiosClient.post(`${URL}/cart/create`, payload);
};
