import { useState, useEffect, useCallback } from "react";
import { Breadcrumb, Button, Spin, message } from "antd";
import { ShoppingOutlined, LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import config from "../../config/config";
import { URL } from "../../config/apiUrl";
import axiosClient from "../../api/axiosClient";
import type { ApiOrder } from "./types";
import { parseOrderItemImage } from "./types";
import OrderFilterBar from "./components/OrderFilterBar";
import OrderCard from "./components/OrderCard";
import OrderDetailModal from "./components/OrderDetailModal";
import OrderReviewModal from "./components/OrderReviewModal";
import "./Order.css";

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
};

function Order() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<ApiOrder[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeStatus, setActiveStatus] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOrderDetail, setSelectedOrderDetail] = useState<ApiOrder | null>(null);
    const [selectedReviewOrder, setSelectedReviewOrder] = useState<ApiOrder | null>(null);

    const [currentUser, setCurrentUser] = useState<any>(() => {
        const saved = localStorage.getItem("user");
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return null;
            }
        }
        return null;
    });

    useEffect(() => {
        const fetchMe = async () => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                try {
                    const res: any = await axiosClient.get(`${URL}/auth/me`);
                    if (res) {
                        setCurrentUser(res);
                        localStorage.setItem("user", JSON.stringify(res));
                    }
                } catch {
                    // Ignore
                }
            }
        };
        fetchMe();
    }, []);

    // Fetch Orders from Backend API
    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const userId = currentUser?.id ? Number(currentUser.id) : undefined;
            const payload: any = { page: 1, limit: 50 };

            if (activeStatus !== "all") {
                payload.status = activeStatus;
            }

            const searchParam = searchQuery.trim() ? `?search=${encodeURIComponent(searchQuery.trim())}` : "";
            const endpoint = userId ? `${URL}/order/user/my-orders` : `${URL}/order/search${searchParam}`;

            const res: any = await axiosClient.post(endpoint, payload);

            let rawList: ApiOrder[] = [];
            if (res && res.data) {
                rawList = res.data;
            } else if (Array.isArray(res)) {
                rawList = res;
            }

            setOrders(rawList);
        } catch (err) {
            console.error("Fetch orders error:", err);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, [activeStatus, searchQuery, currentUser]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Re-order Action
    const handleReOrder = useCallback((order: ApiOrder) => {
        if (!order.items || order.items.length === 0) return;

        const existingCartStr = localStorage.getItem("cart");
        let cartItems: any[] = [];
        if (existingCartStr) {
            try {
                cartItems = JSON.parse(existingCartStr);
            } catch {
                cartItems = [];
            }
        }

        order.items.forEach((item) => {
            const itemPrice = typeof item.price === "string" ? parseFloat(item.price) || 0 : item.price;
            const itemImg = parseOrderItemImage(item);

            const cartItemId = item.variant?.id
                ? `prod_${item.variant?.product?.id || item.id}_var_${item.variant.id}`
                : `prod_${item.id}`;

            const existingIndex = cartItems.findIndex((c) => c.cartItemId === cartItemId);
            if (existingIndex > -1) {
                cartItems[existingIndex].quantity += item.quantity;
            } else {
                cartItems.push({
                    cartItemId,
                    id: item.variant?.product?.id || item.id,
                    variantId: item.variant?.id,
                    name: item.productName,
                    variant: item.variantSku || "Mặc định",
                    price: itemPrice,
                    originalPrice: Math.round(itemPrice * 1.15),
                    quantity: item.quantity,
                    image: itemImg,
                    selected: true,
                    stock: 50,
                });
            }
        });

        localStorage.setItem("cart", JSON.stringify(cartItems));
        window.dispatchEvent(new Event("cart-change"));
        message.success(`Đã thêm các sản phẩm từ đơn hàng #${order.orderCode} vào giỏ hàng!`);
        navigate(`/${config.routes.CART}`);
    }, [navigate]);

    // Cancel Order Action API
    const handleCancelOrder = useCallback(async (orderId: number) => {
        try {
            await axiosClient.patch(`${URL}/order/${orderId}`, { status: "CANCELLED" });
            message.success("Đã hủy đơn hàng thành công!");
            fetchOrders();
        } catch (err: any) {
            message.error(err?.response?.data?.message || "Không thể hủy đơn hàng này!");
        }
    }, [fetchOrders]);

    const handleViewDetail = useCallback((order: ApiOrder) => {
        setSelectedOrderDetail(order);
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedOrderDetail(null);
    }, []);

    const handleReview = useCallback((order: ApiOrder) => {
        setSelectedReviewOrder(order);
    }, []);

    const handleCloseReviewModal = useCallback(() => {
        setSelectedReviewOrder(null);
    }, []);

    return (
        <div className="order-page-container">
            {/* Breadcrumb Header */}
            <div className="order-header-section">
                <Breadcrumb
                    items={[
                        { title: <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Trang chủ</span> },
                        { title: "Đơn hàng của tôi" },
                    ]}
                />
                <h1 className="order-page-title">Đơn Hàng Của Tôi</h1>
            </div>

            {/* Filter Bar */}
            <OrderFilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                activeStatus={activeStatus}
                onStatusChange={setActiveStatus}
            />

            {/* Order Cards List */}
            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 36, color: "#c89968" }} spin />} />
                </div>
            ) : orders.length > 0 ? (
                <div className="order-list">
                    {orders.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onViewDetail={handleViewDetail}
                            onReOrder={handleReOrder}
                            onCancelOrder={handleCancelOrder}
                            onReview={handleReview}
                            formatCurrency={formatCurrency}
                        />
                    ))}
                </div>
            ) : (
                /* Empty Orders State */
                <div className="empty-orders-card">
                    <ShoppingOutlined className="empty-orders-icon" />
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#22242a", marginBottom: 6 }}>
                        Không tìm thấy đơn hàng nào
                    </h3>
                    <p style={{ fontSize: 13, color: "#778290", marginBottom: 20 }}>
                        Chưa có đơn hàng phù hợp với điều kiện tìm kiếm hoặc bộ lọc của bạn.
                    </p>
                    <Button
                        type="primary"
                        onClick={() => navigate(`/${config.routes.PRODUCT}`)}
                        style={{ backgroundColor: "#22242a", borderColor: "#22242a", borderRadius: 8 }}
                    >
                        Mua sắm ngay
                    </Button>
                </div>
            )}

            {/* Order Detail Modal */}
            <OrderDetailModal
                order={selectedOrderDetail}
                onClose={handleCloseModal}
                onReOrder={handleReOrder}
                formatCurrency={formatCurrency}
            />

            {/* Order Review Modal */}
            <OrderReviewModal
                order={selectedReviewOrder}
                onClose={handleCloseReviewModal}
            />
        </div>
    );
}

export default Order;
