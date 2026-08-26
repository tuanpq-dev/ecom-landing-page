import { useState } from "react";
import { Breadcrumb, Button, Tag, Popconfirm, message } from "antd";
import {
    HeartFilled,
    HeartOutlined,
    ShoppingCartOutlined,
    DeleteOutlined,
    StarFilled,
    CheckOutlined,
    ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import config from "../../config/config";
import "./Wishlist.css";

export interface WishlistItem {
    id: number;
    name: string;
    category: string;
    price: number;
    originalPrice?: number;
    discountPercent?: number;
    rating: number;
    reviewsCount: number;
    inStock: boolean;
    image: string;
}

const initialWishlistItems: WishlistItem[] = [
    {
        id: 201,
        name: "Áo Polo Nam Premium Cotton Cao Cấp",
        category: "Áo nam",
        price: 35,
        originalPrice: 45,
        discountPercent: 22,
        rating: 4.9,
        reviewsCount: 128,
        inStock: true,
        image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: 202,
        name: "Quần Jeans Slim-Fit Co Giãn Thời Trang",
        category: "Quần Jeans",
        price: 58,
        originalPrice: 72,
        discountPercent: 19,
        rating: 4.8,
        reviewsCount: 96,
        inStock: true,
        image: "https://images.unsplash.com/photo-1542272604-780c36856d60?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: 203,
        name: "Áo Khoác Blazer Nam Form Rộng Hàn Quốc",
        category: "Áo khoác",
        price: 89,
        originalPrice: 110,
        discountPercent: 19,
        rating: 5.0,
        reviewsCount: 64,
        inStock: true,
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: 204,
        name: "Áo Thun Basic Oversize Unisex Premium",
        category: "Áo thun",
        price: 25,
        originalPrice: 32,
        discountPercent: 21,
        rating: 4.7,
        reviewsCount: 215,
        inStock: false,
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80",
    },
];

function Wishlist() {
    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState<WishlistItem[]>(initialWishlistItems);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
    };

    // Remove single item
    const handleRemoveItem = (id: number, name: string) => {
        setWishlist((prev) => prev.filter((item) => item.id !== id));
        message.success(`Đã xóa "${name}" khỏi danh sách yêu thích`);
    };

    // Add single item to cart
    const handleAddToCart = (item: WishlistItem) => {
        if (!item.inStock) {
            message.warning("Sản phẩm hiện đang tạm hết hàng!");
            return;
        }
        message.success(`Đã thêm "${item.name}" vào giỏ hàng!`);
    };

    // Add all in-stock items to cart
    const handleAddAllToCart = () => {
        const inStockItems = wishlist.filter((item) => item.inStock);
        if (inStockItems.length === 0) {
            message.warning("Không có sản phẩm nào còn hàng để thêm vào giỏ!");
            return;
        }
        message.success(`Đã thêm tất cả ${inStockItems.length} sản phẩm còn hàng vào giỏ hàng!`);
        navigate(`/${config.routes.CART}`);
    };

    // Clear all items
    const handleClearWishlist = () => {
        setWishlist([]);
        message.info("Đã xóa tất cả sản phẩm khỏi danh sách yêu thích");
    };

    // Empty Wishlist View
    if (wishlist.length === 0) {
        return (
            <div className="wishlist-page-container">
                <Breadcrumb
                    items={[
                        { title: <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Trang chủ</span> },
                        { title: "Sản phẩm yêu thích" },
                    ]}
                    style={{ marginBottom: 20 }}
                />
                <div className="empty-wishlist-card">
                    <HeartOutlined className="empty-wishlist-icon" />
                    <h2 className="empty-wishlist-title">Danh sách yêu thích của bạn đang trống</h2>
                    <p className="empty-wishlist-desc">
                        Hãy bấm vào biểu tượng trái tim trên các sản phẩm bạn yêu thích để lưu lại xem sau nhé!
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
        <div className="wishlist-page-container">
            {/* Header Bar */}
            <div className="wishlist-header-bar">
                <div>
                    <Breadcrumb
                        items={[
                            { title: <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Trang chủ</span> },
                            { title: "Sản phẩm yêu thích" },
                        ]}
                    />
                    <h1 className="wishlist-title">
                        <span>Sản Phẩm Yêu Thích</span>
                        <span className="wishlist-count-badge">{wishlist.length} sản phẩm</span>
                    </h1>
                </div>

                {/* Top Action Buttons */}
                <div className="wishlist-actions-top">
                    <Button
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        onClick={handleAddAllToCart}
                        style={{ backgroundColor: "#22242a", borderColor: "#22242a", borderRadius: 8 }}
                    >
                        Thêm Tất Cả Vào Giỏ Hàng
                    </Button>

                    <Popconfirm
                        title="Xóa tất cả yêu thích?"
                        description="Bạn có chắc muốn xóa toàn bộ danh sách sản phẩm yêu thích?"
                        onConfirm={handleClearWishlist}
                        okText="Xóa tất cả"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Button danger icon={<DeleteOutlined />}>
                            Xóa tất cả
                        </Button>
                    </Popconfirm>
                </div>
            </div>

            {/* Product Cards Grid */}
            <div className="wishlist-grid">
                {wishlist.map((item) => (
                    <div
                        key={item.id}
                        className={`wishlist-card ${!item.inStock ? "out-of-stock" : ""}`}
                    >
                        {/* Image & Overlay Badges */}
                        <div
                            className="wishlist-img-wrapper"
                            onClick={() => navigate(`/${config.routes.PRODUCT}`)}
                        >
                            <img src={item.image} alt={item.name} className="wishlist-img" />

                            {item.discountPercent && (
                                <div className="wishlist-badge-discount">-{item.discountPercent}%</div>
                            )}

                            {/* Delete Heart Button */}
                            <button
                                className="wishlist-remove-btn"
                                title="Bỏ yêu thích"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveItem(item.id, item.name);
                                }}
                            >
                                <HeartFilled />
                            </button>
                        </div>

                        {/* Card Details */}
                        <div className="wishlist-card-content">
                            <div>
                                <div className="wishlist-category">{item.category}</div>
                                <div
                                    className="wishlist-name"
                                    onClick={() => navigate(`/${config.routes.PRODUCT}`)}
                                >
                                    {item.name}
                                </div>

                                <div className="wishlist-rating">
                                    <StarFilled />
                                    <span style={{ fontWeight: 600, color: "#333" }}>{item.rating}</span>
                                    <span style={{ color: "#888", fontSize: 11 }}>({item.reviewsCount})</span>
                                </div>

                                <div className="wishlist-price-row">
                                    <span className="wishlist-price-current">
                                        {formatCurrency(item.price)}
                                    </span>
                                    {item.originalPrice && (
                                        <span className="wishlist-price-original">
                                            {formatCurrency(item.originalPrice)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Stock Status & Action */}
                            <div>
                                <div style={{ marginBottom: 10 }}>
                                    {item.inStock ? (
                                        <Tag icon={<CheckOutlined />} color="success" style={{ borderRadius: 10 }}>
                                            Còn hàng
                                        </Tag>
                                    ) : (
                                        <Tag color="default" style={{ borderRadius: 10 }}>
                                            Tạm hết hàng
                                        </Tag>
                                    )}
                                </div>

                                <Button
                                    type="primary"
                                    className="wishlist-add-btn"
                                    disabled={!item.inStock}
                                    icon={<ShoppingCartOutlined />}
                                    onClick={() => handleAddToCart(item)}
                                >
                                    {item.inStock ? "Thêm vào giỏ" : "Hết hàng"}
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Back to Products Footer Button */}
            <div style={{ marginTop: 36, textAlign: "center" }}>
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(`/${config.routes.PRODUCT}`)}
                    style={{ color: "#666e7a" }}
                >
                    Khám phá thêm các sản phẩm khác
                </Button>
            </div>
        </div>
    );
};

export default Wishlist;
