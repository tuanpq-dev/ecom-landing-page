import axiosClient from "./axiosClient";
import { URL } from "../config/apiUrl";

export interface CreateReplyPayload {
    productId: number | string;
    reviewId: number;
    content: string;
}

export const createReplyApi = async (payload: CreateReplyPayload) => {
    return axiosClient.post(`${URL}/review/replies`, payload);
};

export const getReviewsByProductIdApi = async (productId: number | string) => {
    return axiosClient.get(`${URL}/review/${productId}`);
};
