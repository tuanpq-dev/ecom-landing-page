import { formatDateTime } from "../../../../utils/dateUtils";
import type { ReviewData, ReplyItem } from "../components/types";

export function mapRawReplyToReplyItem(rep: any, fallbackReviewId?: number): ReplyItem {
    const isSeller = Boolean(rep.isSeller || rep.admin || rep.seller);
    const userName =
        rep.userName ||
        rep.admin?.fullname ||
        rep.admin?.name ||
        (isSeller ? "Shop Phản Hồi" : rep.user?.fullname || rep.user?.name || "Khách hàng");
    const avatar = rep.avatar || rep.admin?.avatar || rep.user?.avatar || "";

    return {
        id: rep.id ?? (fallbackReviewId ? fallbackReviewId * 1000 + 1 : Date.now()),
        userName,
        avatar,
        isSeller,
        createdAt: formatDateTime(rep.createdAt || rep.updatedAt),
        content: rep.content || rep.reply || "",
        likesCount: rep.likesCount || 0,
        isLiked: Boolean(rep.isLiked),
    };
}

export function mapRawReviewToReviewData(item: any): ReviewData {
    const userName =
        item.userName ||
        item.user?.fullname ||
        item.user?.name ||
        item.user?.email?.split("@")[0] ||
        `Khách hàng #${item.userId || item.id || ""}`;

    const userAvatar = item.userAvatar || item.user?.avatar || "";

    let replies: ReplyItem[] = [];
    if (Array.isArray(item.replies)) {
        replies = item.replies.map((rep: any) => mapRawReplyToReplyItem(rep, item.id));
    } else if (item.reply) {
        replies = [
            mapRawReplyToReplyItem(
                {
                    id: (item.id || 0) * 1000 + 1,
                    userName: "Shop Phản Hồi",
                    isSeller: true,
                    updatedAt: item.updatedAt || item.createdAt,
                    content: item.reply,
                    likesCount: 0,
                },
                item.id
            ),
        ];
    }

    return {
        id: item.id,
        userName,
        userAvatar,
        isVerified: item.isVerified ?? true,
        rating: item.rating || 5,
        createdAt: formatDateTime(item.createdAt),
        variantInfo: item.variantInfo || "",
        content: item.content || "Người dùng không để lại bình luận.",
        images: item.images || [],
        likesCount: item.likesCount || 0,
        heartsCount: item.heartsCount || 0,
        userReaction: item.userReaction || null,
        replies,
    };
}
