import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { RightOutlined, StarFilled, LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import axiosClient from "../../../api/axiosClient";
import { URL } from "../../../config/apiUrl";
import { parseProductImage, type ApiProduct } from "../../Product";
import "../../Product/Product.css";
import config from "../../../config/config";

function formatPrice(n: number | string) {
    const num = typeof n === "string" ? parseFloat(n) || 0 : n;
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(num);
}

export const ProductGrid: React.FC = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<ApiProduct[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res: any = await axiosClient.post(`${URL}/product/search`, {
                    page: 1,
                    pageSize: 8,
                });
                if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
                    setProducts(res.data);
                } else {
                    setProducts(null);
                }
            } catch (err) {
                console.error("Fetch products home error:", err);
                setProducts(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleDetail = (id: number) => {
        navigate(`/${config.routes.PRODUCT_DETAIL(id)}`);
    };

    if (!loading && (!products || products.length === 0)) {
        return null;
    }

    return (
        <section className="home-categories" aria-label="Sản phẩm nổi bật">
            <div className="home-section-header">
                <h2 className="home-section-title">Sản Phẩm Nổi Bật</h2>
                <a href="/product" className="home-section-link">
                    Xem tất cả <RightOutlined style={{ fontSize: 11 }} />
                </a>
            </div>
            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 32, color: "#c89968" }} spin />} />
                </div>
            ) : (
                <div className="product-grid">
                    {products?.slice(0, 8).map((p) => {
                        const mainImage = parseProductImage(p.image, p.id);
                        const priceNum = typeof p.basePrice === "string" ? parseFloat(p.basePrice) || 0 : p.basePrice;
                        const originalPrice = Math.round(priceNum * 1.15);
                        return (
                            <div className="product-card" key={p.id} onClick={() => handleDetail(p.id)}>
                                <div className="product-card-image-wrap">
                                    <img
                                        draggable={false}
                                        alt={p.name}
                                        src={mainImage}
                                        className="product-card-img"
                                    />
                                    <span className="product-card-badge">Mới</span>
                                    <span className="product-card-discount">-10%</span>
                                    <div className="product-card-overlay">
                                        <button
                                            className="product-card-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDetail(p.id);
                                            }}
                                        >
                                            Xem chi tiết
                                        </button>
                                    </div>
                                </div>
                                <div className="product-card-body">
                                    <div className="product-card-category">{p.category?.name || "Thời trang"}</div>
                                    <div className="product-card-title">{p.name}</div>
                                    <div className="product-card-rating">
                                        <StarFilled className="product-card-star" />
                                        <span className="product-card-rating-value">4.8</span>
                                        <span className="product-card-review-count">(12 đánh giá)</span>
                                    </div>
                                    <div className="product-card-price-row">
                                        <span className="product-card-price">{formatPrice(priceNum)}</span>
                                        <span className="product-card-original-price">{formatPrice(originalPrice)}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default ProductGrid;