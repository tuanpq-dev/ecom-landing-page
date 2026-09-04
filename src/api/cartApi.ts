import axiosClient from "./axiosClient";
import { URL } from "../config/apiUrl";

export interface AddToCartPayload {
    variantId: number;
    quantity: number;
}

export interface CartItem {
    cartItemId?: string;
    id: number;
    variantId?: number;
    name: string;
    variant: string;
    price: number;
    originalPrice?: number;
    quantity: number;
    image: string;
    selected: boolean;
    stock?: number;
    userId?: number;
}

export const addToCartApi = async (payload: AddToCartPayload) => {
    return axiosClient.post(`${URL}/cart/create`, payload);
};

export const getMyCartApi = async () => {
    return axiosClient.get(`${URL}/cart/my-cart`);
};

export const parseProductImage = (image: any): string => {
    if (!image) return "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400&q=80";
    if (typeof image === "string") {
        try {
            const parsed = JSON.parse(image);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
        } catch {
            if (image.includes(",")) return image.split(",")[0].trim();
            return image;
        }
    }
    if (Array.isArray(image) && image.length > 0) return image[0];
    return "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400&q=80";
};

export const formatVariantLabel = (variant: any): string => {
    if (!variant) return "";
    if (variant.attributes?.comboKey) return variant.attributes.comboKey;
    if (variant.attributes && typeof variant.attributes === "object") {
        const attrs = Object.values(variant.attributes).filter(Boolean);
        if (attrs.length > 0) return attrs.join(" / ");
    }
    return variant.id ? `Biến thể #${variant.id}` : "";
};

export const mapServerCartItemToLocal = (item: any, prevSelectedMap?: Record<string, boolean>): CartItem => {
    const product = item.variant?.product;
    const variant = item.variant;
    const prodId = product?.id || item.id;
    const varId = item.variantId || variant?.id;
    const variantLabel = formatVariantLabel(variant);
    const cartItemId = varId ? `prod_${prodId}_var_${varId}` : `item_${item.id}`;
    const price = Number(variant?.price ?? product?.basePrice ?? 0);
    const originalPrice = Math.round(price * 1.15);

    return {
        cartItemId,
        id: prodId,
        variantId: varId,
        name: product?.name || "Sản phẩm",
        variant: variantLabel,
        price,
        originalPrice,
        quantity: item.quantity || 1,
        image: parseProductImage(product?.image),
        selected: prevSelectedMap && prevSelectedMap[cartItemId] !== undefined ? prevSelectedMap[cartItemId] : true,
        stock: variant?.stock ?? 50,
        userId: item.cart?.userId,
    };
};

/**
 * Gọi API getMyCartApi lấy giỏ hàng từ BE (BE tự lấy userId từ JWT).
 * Đối chiếu với giỏ hàng và userId hiện tại ở localStorage.
 * Nếu không khớp hoặc cần đồng bộ, cập nhật lại đúng giỏ hàng và id người dùng.
 */
export const syncCartWithServer = async (): Promise<CartItem[]> => {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    if (!token) return [];

    try {
        const res: any = await getMyCartApi();
        const cartData = res?.data || res;
        if (!cartData) return [];

        const serverUserId = cartData.userId;
        const currentCartUserId = localStorage.getItem("cartUserId");
        if (serverUserId && currentCartUserId !== String(serverUserId)) {
            console.log(`Cart user ID mismatch: local was ${currentCartUserId}, server is ${serverUserId}. Cập nhật lại giỏ hàng cho đúng user.`);
        }
        const serverItems = Array.isArray(cartData.items) ? cartData.items : [];

        let prevSelectedMap: Record<string, boolean> = {};
        const localCartStr = localStorage.getItem("cart");
        if (localCartStr) {
            try {
                const localItems: CartItem[] = JSON.parse(localCartStr);
                localItems.forEach((it) => {
                    if (it.cartItemId) prevSelectedMap[it.cartItemId] = it.selected;
                });
            } catch {
                // Ignore
            }
        }

        const mappedItems: CartItem[] = serverItems.map((item: any) =>
            mapServerCartItemToLocal(item, prevSelectedMap)
        );

        // Lưu vào localStorage và khớp đúng id người dùng
        localStorage.setItem("cart", JSON.stringify(mappedItems));
        if (serverUserId) {
            localStorage.setItem("cartUserId", String(serverUserId));
        }

        window.dispatchEvent(new Event("cart-change"));
        return mappedItems;
    } catch (err) {
        console.error("Lỗi đồng bộ giỏ hàng với máy chủ:", err);
        return [];
    }
};
