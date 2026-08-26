export interface ReplyItem {
    id: number;
    userName: string;
    avatar?: string;
    isSeller?: boolean;
    createdAt: string;
    content: string;
    likesCount: number;
    isLiked?: boolean;
}

export interface ReviewData {
    id: number;
    userName: string;
    userAvatar?: string;
    isVerified?: boolean;
    rating: number;
    createdAt: string;
    variantInfo?: string;
    content: string;
    images?: string[];
    likesCount: number;
    heartsCount: number;
    userReaction?: "like" | "heart" | null;
    replies: ReplyItem[];
}
