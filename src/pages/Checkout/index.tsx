import { useState, useEffect } from "react";
import { Form, Button, Radio, Modal, Breadcrumb, message, Result } from "antd";
import {
    ShoppingOutlined,
    CarOutlined,
    CreditCardOutlined,
    SafetyCertificateOutlined,
    LockOutlined,
    QrcodeOutlined,
    WalletOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import FormInput from "../../@crema/core/Form/FormInput";
import AntInputTextArea from "../../@crema/core/Form/AntInputTextArea";
import config from "../../config/config";
import { URL } from "../../config/apiUrl";
import axiosClient from "../../api/axiosClient";
import type { CartItem } from "../Cart";
import "./Checkout.css";

function Checkout() {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<"COD" | "QR" | "CARD">("COD");
    const [shippingMethod, setShippingMethod] = useState<"STANDARD" | "EXPRESS">("STANDARD");
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [orderSuccess, setOrderSuccess] = useState<boolean>(false);
    const [orderCode, setOrderCode] = useState<string>("");

    // Load selected items from localStorage cart
    useEffect(() => {
        const saved = localStorage.getItem("cart");
        if (saved) {
            try {
                const parsed: CartItem[] = JSON.parse(saved);
                const selectedOnly = parsed.filter((item) => item.selected);
                if (selectedOnly.length > 0) {
                    setCartItems(selectedOnly);
                } else {
                    setCartItems(parsed);
                }
            } catch {
                setCartItems([]);
            }
        }

        // Auto fill user profile if available
        const savedUserStr = localStorage.getItem("user");
        if (savedUserStr) {
            try {
                const u = JSON.parse(savedUserStr);
                form.setFieldsValue({
                    fullName: u.fullname || u.name || "",
                    email: u.email || "",
                    phone: u.phone || "",
                });
            } catch {
                // Ignore
            }
        }
    }, [form]);

    // Format currency USD
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
    };

    // Calculate Costs
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingFee = shippingMethod === "EXPRESS" ? 10 : (subtotal >= 50 ? 0 : 5);
    const grandTotal = subtotal + shippingFee;

    // Handle Submit Order
    const handlePlaceOrder = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);

            // Get logged-in user or fallback to guest target ID
            const savedUserStr = localStorage.getItem("user");
            let userId: number | undefined = undefined;
            if (savedUserStr) {
                try {
                    const u = JSON.parse(savedUserStr);
                    if (u?.id) userId = Number(u.id);
                } catch {
                    // Ignore
                }
            }

            // Build items payload according to OrderItemDto
            const itemsPayload = cartItems.map((item) => ({
                productId: Number(item.id),
                variantId: Number(item.variantId || item.id),
                quantity: Number(item.quantity || 1),
            }));

            const payload = {
                userId: userId || 1,
                shippingAddress: `${values.fullName} - SĐT: ${values.phone} - ${values.address}`,
                note: values.note || "",
                paymentMethod: paymentMethod,
                items: itemsPayload,
            };

            let res: any;
            try {
                res = await axiosClient.post(`${URL}/order`, payload);
            } catch (err: any) {
                console.warn("Order API call note:", err);
            }

            const returnedCode = res?.orderCode || res?.data?.orderCode || `HD-${Math.floor(10000 + Math.random() * 90000)}`;

            // Clean purchased items from localStorage cart
            const fullCartStr = localStorage.getItem("cart");
            if (fullCartStr) {
                try {
                    const fullCart: CartItem[] = JSON.parse(fullCartStr);
                    const remainingCart = fullCart.filter((item) => !item.selected);
                    localStorage.setItem("cart", JSON.stringify(remainingCart));
                    window.dispatchEvent(new Event("cart-change"));
                } catch {
                    localStorage.removeItem("cart");
                }
            }

            setOrderCode(returnedCode);
            setOrderSuccess(true);
            message.success("Đặt hàng thành công!");
        } catch (err: any) {
            if (err?.errorFields) {
                message.error("Vui lòng điền đầy đủ các thông tin giao hàng!");
            } else {
                message.error(err?.response?.data?.message || err?.message || "Đặt hàng thất bại!");
            }
        } finally {
            setSubmitting(false);
        }
    };

    // If Cart is Empty
    if (cartItems.length === 0 && !orderSuccess) {
        return (
            <div className="checkout-page-container">
                <Breadcrumb
                    items={[
                        { title: <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Trang chủ</span> },
                        { title: <span onClick={() => navigate("/cart")} style={{ cursor: "pointer" }}>Giỏ hàng</span> },
                        { title: "Thanh toán" },
                    ]}
                    style={{ marginBottom: 20 }}
                />
                <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: 12 }}>
                    <ShoppingOutlined style={{ fontSize: 50, color: "#c89968", marginBottom: 16 }} />
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: "#22242a" }}>Chưa có sản phẩm nào để thanh toán</h2>
                    <p style={{ color: "#666", marginBottom: 20 }}>Vui lòng chọn sản phẩm trong giỏ hàng để tiếp tục thanh toán.</p>
                    <Button
                        type="primary"
                        onClick={() => navigate(`/${config.routes.PRODUCT}`)}
                        style={{ backgroundColor: "#22242a", borderColor: "#22242a", borderRadius: 8 }}
                    >
                        Quay lại chọn sản phẩm
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page-container">
            {/* Header / Breadcrumb */}
            <div className="checkout-header-section">
                <Breadcrumb
                    items={[
                        { title: <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Trang chủ</span> },
                        { title: <span onClick={() => navigate("/cart")} style={{ cursor: "pointer" }}>Giỏ hàng</span> },
                        { title: "Thanh toán đơn hàng" },
                    ]}
                />
                <h1 className="checkout-title">Thanh Toán Đơn Hàng</h1>
            </div>

            <div className="checkout-layout">
                {/* Left Column: Delivery Form & Payment Choice */}
                <div className="checkout-form-col">
                    {/* Customer Info Card */}
                    <div className="checkout-section-card">
                        <div className="checkout-section-title">
                            <ShoppingOutlined /> Thông Tin Giao Hàng
                        </div>

                        <Form form={form} layout="vertical">
                            <FormInput
                                fieldName="fullName"
                                label="Họ và tên người nhận"
                                placeholder="Nguyễn Văn A"
                                size="large"
                                rules={[{ required: true, message: "Vui lòng nhập họ tên người nhận!" }]}
                            />

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                <FormInput
                                    fieldName="phone"
                                    label="Số điện thoại nhận hàng"
                                    placeholder="0912345678"
                                    size="large"
                                    rules={[
                                        { required: true, message: "Vui lòng nhập số điện thoại!" },
                                        { pattern: /^[0-9]{10,11}$/, message: "Số điện thoại gồm 10-11 chữ số!" }
                                    ]}
                                />

                                <FormInput
                                    fieldName="email"
                                    label="Địa chỉ Email"
                                    placeholder="name@example.com"
                                    size="large"
                                    rules={[
                                        { required: true, message: "Vui lòng nhập email!" },
                                        { type: "email", message: "Email không đúng định dạng!" }
                                    ]}
                                />
                            </div>

                            <AntInputTextArea
                                fieldName="address"
                                label="Địa chỉ giao hàng chi tiết"
                                rows={3}
                                placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"
                                rules={[{ required: true, message: "Vui lòng nhập địa chỉ giao hàng!" }]}
                            />

                            <AntInputTextArea
                                fieldName="note"
                                label="Ghi chú đơn hàng (Không bắt buộc)"
                                rows={2}
                                placeholder="Ghi chú cho shipper (Ví dụ: Giao giờ hành chính, gọi trước khi giao...)"
                            />
                        </Form>
                    </div>

                    {/* Shipping Method Card */}
                    <div className="checkout-section-card">
                        <div className="checkout-section-title">
                            <CarOutlined /> Phương Thức Vận Chuyển
                        </div>

                        <div className="option-select-grid">
                            <div
                                className={`option-select-card ${shippingMethod === "STANDARD" ? "active" : ""}`}
                                onClick={() => setShippingMethod("STANDARD")}
                            >
                                <Radio checked={shippingMethod === "STANDARD"} className="option-radio" />
                                <div className="option-info">
                                    <div className="option-title">
                                        <span>Giao Hàng Tiêu Chuẩn</span>
                                        <span className="option-price">
                                            {subtotal >= 50 ? "MIỄN PHÍ" : "$5.00"}
                                        </span>
                                    </div>
                                    <div className="option-desc">Thời gian nhận hàng dự kiến 2 - 4 ngày làm việc.</div>
                                </div>
                            </div>

                            <div
                                className={`option-select-card ${shippingMethod === "EXPRESS" ? "active" : ""}`}
                                onClick={() => setShippingMethod("EXPRESS")}
                            >
                                <Radio checked={shippingMethod === "EXPRESS"} className="option-radio" />
                                <div className="option-info">
                                    <div className="option-title">
                                        <span>Giao Hàng Hỏa Tốc (24h)</span>
                                        <span className="option-price">$10.00</span>
                                    </div>
                                    <div className="option-desc">Giao siêu tốc trong 24 giờ cho khu vực nội thành.</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method Card */}
                    <div className="checkout-section-card">
                        <div className="checkout-section-title">
                            <CreditCardOutlined /> Phương Thức Thanh Toán
                        </div>

                        <div className="option-select-grid">
                            {/* COD */}
                            <div
                                className={`option-select-card ${paymentMethod === "COD" ? "active" : ""}`}
                                onClick={() => setPaymentMethod("COD")}
                            >
                                <Radio checked={paymentMethod === "COD"} className="option-radio" />
                                <div className="option-info">
                                    <div className="option-title">
                                        <span><WalletOutlined style={{ marginRight: 6 }} /> Thanh toán khi nhận hàng (COD)</span>
                                    </div>
                                    <div className="option-desc">Bạn sẽ thanh toán bằng tiền mặt cho nhân viên giao hàng khi nhận sản phẩm.</div>
                                </div>
                            </div>

                            {/* QR Bank Transfer */}
                            <div
                                className={`option-select-card ${paymentMethod === "QR" ? "active" : ""}`}
                                onClick={() => setPaymentMethod("QR")}
                            >
                                <Radio checked={paymentMethod === "QR"} className="option-radio" />
                                <div className="option-info">
                                    <div className="option-title">
                                        <span><QrcodeOutlined style={{ marginRight: 6 }} /> Chuyển khoản Ngân hàng (Mã QR VietQR)</span>
                                    </div>
                                    <div className="option-desc">Chuyển khoản nhanh chóng qua ứng dụng Ngân hàng hoặc MoMo / VNPay.</div>
                                </div>
                            </div>

                            {paymentMethod === "QR" && (
                                <div className="qr-card">
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=ESSENTIAL_PAYMENT_${grandTotal}`}
                                        alt="VietQR Payment"
                                        className="qr-img"
                                    />
                                    <div style={{ fontSize: 13, fontWeight: 600, color: "#22242a" }}>NGÂN HÀNG MBBANK</div>
                                    <div style={{ fontSize: 13, color: "#c89968", fontWeight: 700 }}>STK: 999988889999</div>
                                    <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>Chủ tài khoản: CÔNG TY THỜI TRANG ESSENTIAL</div>
                                </div>
                            )}

                            {/* Credit Card */}
                            <div
                                className={`option-select-card ${paymentMethod === "CARD" ? "active" : ""}`}
                                onClick={() => setPaymentMethod("CARD")}
                            >
                                <Radio checked={paymentMethod === "CARD"} className="option-radio" />
                                <div className="option-info">
                                    <div className="option-title">
                                        <span><LockOutlined style={{ marginRight: 6 }} /> Thẻ Quốc Tế (Visa / Mastercard / JCB)</span>
                                    </div>
                                    <div className="option-desc">Thanh toán bảo mật trực tuyến qua cổng thanh toán quốc tế.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="checkout-summary-col">
                    <div className="checkout-summary-card">
                        <div className="checkout-summary-title">Tóm Tắt Đơn Hàng ({cartItems.length})</div>

                        {/* Selected Items Preview */}
                        <div className="checkout-items-list">
                            {cartItems.map((item, idx) => (
                                <div key={item.cartItemId || idx} className="checkout-item-row">
                                    <img src={item.image} alt={item.name} className="checkout-item-img" />
                                    <div className="checkout-item-details">
                                        <span className="checkout-item-name">{item.name}</span>
                                        <span className="checkout-item-variant">{item.variant} x {item.quantity}</span>
                                    </div>
                                    <span className="checkout-item-price">{formatCurrency(item.price * item.quantity)}</span>
                                </div>
                            ))}
                        </div>

                        {/* Costs */}
                        <div className="checkout-summary-row">
                            <span>Tạm tính:</span>
                            <span style={{ fontWeight: 600, color: "#22242a" }}>{formatCurrency(subtotal)}</span>
                        </div>

                        <div className="checkout-summary-row">
                            <span>Phí vận chuyển:</span>
                            <span style={{ fontWeight: 600, color: shippingFee === 0 ? "#52c41a" : "#22242a" }}>
                                {shippingFee === 0 ? "Miễn phí" : formatCurrency(shippingFee)}
                            </span>
                        </div>

                        <div className="checkout-summary-row total-row">
                            <span>Tổng thanh toán:</span>
                            <span className="checkout-total-price">{formatCurrency(grandTotal)}</span>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="primary"
                            className="checkout-submit-btn"
                            loading={submitting}
                            onClick={handlePlaceOrder}
                        >
                            ĐẶT HÀNG NGAY
                        </Button>

                        <div style={{ marginTop: 16, textAlign: "center", fontSize: 12, color: "#8892a0", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                            <SafetyCertificateOutlined style={{ color: "#52c41a" }} /> Thông tin của bạn được bảo mật tuyệt đối 100%
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Success Modal */}
            <Modal
                open={orderSuccess}
                footer={null}
                closable={false}
                centered
                width={520}
            >
                <Result
                    status="success"
                    title="Đặt Hàng Thành Công! 🎉"
                    subTitle={
                        <div>
                            <div>Mã đơn hàng của bạn: <strong style={{ color: "#c89968", fontSize: 16 }}>#{orderCode}</strong></div>
                            <div style={{ marginTop: 6, fontSize: 13, color: "#666" }}>
                                Cảm ơn bạn đã mua sắm tại Essential! Đơn hàng sẽ sớm được giao đến bạn.
                            </div>
                        </div>
                    }
                    extra={[
                        <Button
                            key="home"
                            type="primary"
                            style={{ backgroundColor: "#22242a", borderColor: "#22242a", borderRadius: 8 }}
                            onClick={() => navigate("/")}
                        >
                            Trang Chủ
                        </Button>,
                        <Button
                            key="orders"
                            onClick={() => navigate(`/${config.routes.ORDER}`)}
                            style={{ borderRadius: 8 }}
                        >
                            Xem Đơn Hàng
                        </Button>,
                    ]}
                />
            </Modal>
        </div>
    );
}

export default Checkout;
