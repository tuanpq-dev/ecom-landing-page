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

export interface LikeReviewPayload {
    reviewId: number;
    isLiked: boolean;
}

export const likeReviewApi = async (payload: LikeReviewPayload) => {
    return axiosClient.post(`${URL}/review/like`, payload);
};

