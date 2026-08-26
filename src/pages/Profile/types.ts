import dayjs from "dayjs";

export interface UserProfileData {
    fullName: string;
    email: string;
    phone: string;
    gender: "male" | "female" | "other";
    dob?: dayjs.Dayjs;
    avatar: string;
}

export interface AddressItem {
    id: number;
    name: string;
    phone: string;
    address: string;
    isDefault: boolean;
}

export interface OrderProductItem {
    id: number;
    quantity: number;
    price: string | number;
    productName: string;
    variantSku?: string;
    variantId?: number;
}

export interface CustomerOrder {
    id: number;
    orderCode: string;
    paymentMethod: string;
    paymentStatus: string;
    shippingStatus: string;
    status: string;
    shippingAddress?: string;
    note?: string;
    createdAt: string;
    updatedAt?: string;
    items: OrderProductItem[];
}
