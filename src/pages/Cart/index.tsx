import { useState, useEffect } from "react";
import { Breadcrumb, Button, Checkbox, Input, Popconfirm, message } from "antd";
import {
    DeleteOutlined,
    ShoppingCartOutlined,
    ArrowLeftOutlined,
    CarOutlined,
    SafetyCertificateOutlined,
    SyncOutlined,
    TagOutlined,
    CheckOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import config from "../../config/config";
import "./Cart.css";

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
}

const initialCartItems: CartItem[] = [
    {
        cartItemId: "item_101",
        id: 101,
        name: "Áo Polo Nam Premium Cotton Cao Cấp",
        variant: "Màu Trắng / Size L",
        price: 35,
        originalPrice: 45,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=200&q=80",
        selected: true,
        stock: 20,
    },
    {
        cartItemId: "item_102",
        id: 102,
        name: "Quần Jeans Slim-Fit Co Giãn Thời Trang",
        variant: "Màu Xanh Đen / Size 31",
        price: 58,
        originalPrice: 72,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1542272604-780c36856d60?auto=format&fit=crop&w=200&q=80",
        selected: true,
        stock: 15,
    },
];

const FREESHIP_THRESHOLD = 50; // $50 for free shipping
const DEFAULT_SHIPPING_FEE = 5;

function Cart() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem("cart");
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return initialCartItems;
            }
        }
        return initialCartItems;
    });

    const [promoInput, setPromoInput] = useState("");
    const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent?: number; freeShip?: boolean } | null>(null);

    // Sync with localStorage on cart-change event
    useEffect(() => {
        const syncCart = () => {
            const saved = localStorage.getItem("cart");
            if (saved) {
                try {
                    setCartItems(JSON.parse(saved));
                } catch {
                    // Ignore
                }
            } else {
                setCartItems([]);
            }
        };

        window.addEventListener("cart-change", syncCart);
        return () => {
            window.removeEventListener("cart-change", syncCart);
        };
    }, []);

    const updateAndSaveCart = (newItems: CartItem[]) => {
        setCartItems(newItems);
        localStorage.setItem("cart", JSON.stringify(newItems));
        window.dispatchEvent(new Event("cart-change"));
    };

    // Format currency USD
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
    };

    // Toggle single item selection
    const handleToggleSelect = (key: string | number) => {
        const next = cartItems.map((item) =>
            (item.cartItemId === key || item.id === key) ? { ...item, selected: !item.selected } : item
        );
        updateAndSaveCart(next);
    };

    // Toggle select all
    const allSelected = cartItems.length > 0 && cartItems.every((item) => item.selected);
    const handleToggleSelectAll = () => {
        const nextState = !allSelected;
        const next = cartItems.map((item) => ({ ...item, selected: nextState }));
        updateAndSaveCart(next);
    };

    // Change item quantity
    const handleUpdateQuantity = (itemTarget: CartItem, delta: number) => {
        const maxStock = itemTarget.stock !== undefined ? itemTarget.stock : 99;
        const newQty = itemTarget.quantity + delta;

        if (newQty > maxStock) {
            message.warning(`Sản phẩm này chỉ còn ${maxStock} trong kho!`);
            return;
        }

        if (newQty < 1) return;

        const next = cartItems.map((item) => {
            const isMatch = itemTarget.cartItemId
                ? item.cartItemId === itemTarget.cartItemId
                : item.id === itemTarget.id && item.variant === itemTarget.variant;

            if (isMatch) {
                return { ...item, quantity: newQty };
            }
            return item;
        });

        updateAndSaveCart(next);
    };

    // Remove single item
    const handleRemoveItem = (itemTarget: CartItem) => {
        const next = cartItems.filter((item) => {
            if (itemTarget.cartItemId) {
                return item.cartItemId !== itemTarget.cartItemId;
            }
            return !(item.id === itemTarget.id && item.variant === itemTarget.variant);
        });

        updateAndSaveCart(next);
        message.success("Đã xóa sản phẩm khỏi giỏ hàng");
    };

    // Clear selected items
    const handleClearSelected = () => {
        const next = cartItems.filter((item) => !item.selected);
        updateAndSaveCart(next);
        message.success("Đã xóa các sản phẩm đã chọn");
    };

    // Calculate Subtotals & Totals for Selected Items
    const selectedItems = cartItems.filter((item) => item.selected);
    const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Freeship calculations
    const isFreeshipQualified = subtotal >= FREESHIP_THRESHOLD || appliedPromo?.freeShip;
    const freeshipProgress = Math.min(100, Math.round((subtotal / FREESHIP_THRESHOLD) * 100));
    const remainingForFreeship = Math.max(0, FREESHIP_THRESHOLD - subtotal);

    // Discount calculations
    let discountAmount = 0;
    if (appliedPromo?.discountPercent) {
        discountAmount = Math.round((subtotal * appliedPromo.discountPercent) / 100);
    }

    const shippingFee = isFreeshipQualified || selectedItems.length === 0 ? 0 : DEFAULT_SHIPPING_FEE;
    const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

    // Apply Promo Code
    const handleApplyPromo = () => {
        const code = promoInput.trim().toUpperCase();
        if (!code) {
            message.warning("Vui lòng nhập mã giảm giá");
            return;
        }

        if (code === "ESSENTIAL10") {
            setAppliedPromo({ code: "ESSENTIAL10", discountPercent: 10 });
            message.success("Đã áp dụng mã ESSENTIAL10: Giảm 10% tổng đơn hàng!");
        } else if (code === "FREESHIP") {
            setAppliedPromo({ code: "FREESHIP", freeShip: true });
            message.success("Đã áp dụng mã FREESHIP: Miễn phí vận chuyển!");
        } else {
            message.error("Mã giảm giá không hợp lệ hoặc đã hết hạn!");
        }
        setPromoInput("");
    };

    const handleRemovePromo = () => {
        setAppliedPromo(null);
        message.info("Đã gỡ bỏ mã giảm giá");
    };

    // Handle Checkout
    const handleProceedToCheckout = () => {
        if (selectedItems.length === 0) {
            message.warning("Vui lòng chọn ít nhất 1 sản phẩm để tiến hành thanh toán!");
            return;
        }
        message.loading("Đang chuyển sang trang thanh toán...", 1);
        setTimeout(() => {
            navigate(`/${config.routes.CHECKOUT}`);
        }, 800);
    };

    // If Cart is Empty
    if (cartItems.length === 0) {
        return (
            <div className="cart-page-container">
                <Breadcrumb
                    items={[
                        { title: <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Trang chủ</span> },
                        { title: "Giỏ hàng" },
                    ]}
                    style={{ marginBottom: 20 }}
                />
                <div className="empty-cart-container">
                    <ShoppingCartOutlined className="empty-cart-icon" />
                    <h2 className="empty-cart-title">Giỏ hàng của bạn đang trống</h2>
                    <p className="empty-cart-desc">
                        Chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá bộ sưu tập thời trang mới nhất ngay!
                    </p>
                    <Button
                        type="primary"
                        size="large"
                        onClick={() => navigate(`/${config.routes.PRODUCT}`)}
                        style={{ backgroundColor: "#22242a", borderColor: "#22242a", borderRadius: 8 }}
                    >
                        Khám phá sản phẩm ngay
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page-container">
            {/* Breadcrumb Navigation */}
            <div className="cart-header-section">
                <Breadcrumb
                    items={[
                        { title: <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Trang chủ</span> },
                        { title: "Giỏ hàng" },
                    ]}
                />
                <h1 className="cart-title">
                    <span>Giỏ Hàng Của Bạn</span>
                    <span className="cart-title-count">{cartItems.length} sản phẩm</span>
                </h1>
            </div>

            {/* Free Shipping Progress Banner */}
            <div className="freeship-banner">
                <div className="freeship-header">
                    <span>
                        <CarOutlined style={{ color: "#c89968", fontSize: 16, marginRight: 6 }} />
                        {isFreeshipQualified ? (
                            <strong style={{ color: "#52c41a" }}>Bạn đủ điều kiện nhận MIỄN PHÍ VẬN CHUYỂN! 🎉</strong>
                        ) : (
                            <span>
                                Mua thêm <strong className="freeship-highlight">{formatCurrency(remainingForFreeship)}</strong> để được <strong className="freeship-highlight">FREESHIP</strong>
                            </span>
                        )}
                    </span>
                    <span style={{ fontWeight: 600, color: "#c89968" }}>{freeshipProgress}%</span>
                </div>
                <div className="freeship-progress-bar">
                    <div
                        className="freeship-progress-fill"
                        style={{ width: `${freeshipProgress}%` }}
                    />
                </div>
            </div>

            {/* Main Cart Grid */}
            <div className="cart-layout">
                {/* Left Column: Items List */}
                <div className="cart-items-card">
                    {/* Header Row */}
                    <div className="cart-table-header">
                        <Checkbox checked={allSelected} onChange={handleToggleSelectAll} />
                        <span>Sản phẩm</span>
                        <span>Đơn giá</span>
                        <span>Số lượng</span>
                        <span>Thành tiền</span>
                        <span></span>
                    </div>

                    {/* Cart Items Loop */}
                    {cartItems.map((item, idx) => {
                        const itemKey = item.cartItemId || `${item.id}_${idx}`;
                        return (
                            <div className="cart-item-row" key={itemKey}>
                                {/* Checkbox */}
                                <Checkbox
                                    checked={item.selected}
                                    onChange={() => handleToggleSelect(item.cartItemId || item.id)}
                                />

                                {/* Item Info */}
                                <div className="cart-item-info">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="cart-item-img"
                                        onClick={() => navigate(`/${config.routes.PRODUCT_DETAIL(String(item.id))}`)}
                                    />
                                    <div className="cart-item-details">
                                        <span
                                            className="cart-item-name"
                                            onClick={() => navigate(`/${config.routes.PRODUCT_DETAIL(String(item.id))}`)}
                                        >
                                            {item.name}
                                        </span>
                                        <span className="cart-item-variant">{item.variant}</span>
                                        {item.stock !== undefined && (
                                            <span style={{ fontSize: 11, color: item.stock <= 5 ? "#ff4d4f" : "#888" }}>
                                                {item.stock <= 5 ? `Kho còn: ${item.stock}` : `Tồn kho: ${item.stock}`}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Unit Price */}
                                <div className="cart-item-price">
                                    <span className="price-current">{formatCurrency(item.price)}</span>
                                    {item.originalPrice && item.originalPrice > item.price && (
                                        <span className="price-original">{formatCurrency(item.originalPrice)}</span>
                                    )}
                                </div>

                                {/* Quantity Control */}
                                <div className="quantity-control">
                                    <button
                                        className="qty-btn"
                                        onClick={() => handleUpdateQuantity(item, -1)}
                                        disabled={item.quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="text"
                                        className="qty-input"
                                        value={item.quantity}
                                        readOnly
                                    />
                                    <button
                                        className="qty-btn"
                                        onClick={() => handleUpdateQuantity(item, 1)}
                                        disabled={item.stock !== undefined && item.quantity >= item.stock}
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Total Item Price */}
                                <div className="price-total">
                                    {formatCurrency(item.price * item.quantity)}
                                </div>

                                {/* Delete Action */}
                                <Popconfirm
                                    title="Xóa sản phẩm này?"
                                    description="Bạn có chắc chắn muốn bỏ sản phẩm khỏi giỏ hàng?"
                                    onConfirm={() => handleRemoveItem(item)}
                                    okText="Xóa"
                                    cancelText="Hủy"
                                    okButtonProps={{ danger: true }}
                                >
                                    <div className="cart-item-delete">
                                        <DeleteOutlined />
                                    </div>
                                </Popconfirm>
                            </div>
                        );
                    })}

                    {/* Bottom Actions Bar */}
                    <div className="cart-actions-bar">
                        <Button
                            type="text"
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate(`/${config.routes.PRODUCT}`)}
                            style={{ color: "#555e6b", padding: 0 }}
                        >
                            Tiếp tục chọn sản phẩm
                        </Button>

                        {selectedItems.length > 0 && (
                            <Popconfirm
                                title="Xóa các sản phẩm đã chọn?"
                                onConfirm={handleClearSelected}
                                okText="Đồng ý xóa"
                                cancelText="Hủy"
                            >
                                <Button type="text" danger icon={<DeleteOutlined />}>
                                    Xóa ({selectedItems.length}) sản phẩm đã chọn
                                </Button>
                            </Popconfirm>
                        )}
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="order-summary-card">
                    <h3 className="summary-title">Tóm Tắt Đơn Hàng</h3>

                    {/* Subtotal */}
                    <div className="summary-row">
                        <span>Tạm tính ({selectedItems.length} sản phẩm):</span>
                        <span style={{ fontWeight: 600, color: "#22242a" }}>{formatCurrency(subtotal)}</span>
                    </div>

                    {/* Shipping Fee */}
                    <div className="summary-row">
                        <span>Phí vận chuyển:</span>
                        <span style={{ fontWeight: 600, color: shippingFee === 0 ? "#52c41a" : "#22242a" }}>
                            {shippingFee === 0 ? "Miễn phí" : formatCurrency(shippingFee)}
                        </span>
                    </div>

                    {/* Applied Discount */}
                    {discountAmount > 0 && (
                        <div className="summary-row" style={{ color: "#52c41a" }}>
                            <span>Giảm giá Voucher ({appliedPromo?.code}):</span>
                            <span style={{ fontWeight: 600 }}>-{formatCurrency(discountAmount)}</span>
                        </div>
                    )}

                    {/* Promo Code Box */}
                    <div className="promo-box">
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: "#333a44", marginBottom: 8 }}>
                            <TagOutlined style={{ marginRight: 4, color: "#c89968" }} /> Mã giảm giá / Voucher
                        </div>

                        {appliedPromo ? (
                            <div className="promo-tag-applied">
                                <span>
                                    <CheckOutlined style={{ marginRight: 6 }} /> Đã áp dụng: <strong>{appliedPromo.code}</strong>
                                </span>
                                <Button type="link" size="small" danger onClick={handleRemovePromo} style={{ padding: 0 }}>
                                    Bỏ mã
                                </Button>
                            </div>
                        ) : (
                            <div className="promo-input-group">
                                <Input
                                    placeholder="Nhập mã (VD: ESSENTIAL10)"
                                    value={promoInput}
                                    onChange={(e) => setPromoInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                                    size="middle"
                                />
                                <Button onClick={handleApplyPromo} style={{ backgroundColor: "#f0f3f7" }}>
                                    Áp dụng
                                </Button>
                            </div>
                        )}
                        <div style={{ fontSize: 11, color: "#8892a0", marginTop: 6 }}>
                            Gợi ý: Thử nhập <strong>ESSENTIAL10</strong> hoặc <strong>FREESHIP</strong>
                        </div>
                    </div>

                    {/* Grand Total */}
                    <div className="summary-row total-row">
                        <span>Tổng tiền thanh toán:</span>
                        <span className="summary-total-price">{formatCurrency(grandTotal)}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#8892a0", textAlign: "right", marginTop: -8, marginBottom: 20 }}>
                        (Đã bao gồm VAT nếu có)
                    </div>

                    {/* Checkout Button */}
                    <Button
                        type="primary"
                        className="checkout-btn"
                        onClick={handleProceedToCheckout}
                    >
                        TIẾN HÀNH THANH TOÁN
                    </Button>

                    {/* Trust Badges */}
                    <div className="trust-badges">
                        <div className="trust-badge-item">
                            <CarOutlined />
                            <span>Giao hàng toàn quốc</span>
                        </div>
                        <div className="trust-badge-item">
                            <SyncOutlined />
                            <span>Đổi trả 7 ngày</span>
                        </div>
                        <div className="trust-badge-item">
                            <SafetyCertificateOutlined />
                            <span>Thanh toán an toàn</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
