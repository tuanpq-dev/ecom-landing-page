import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { StarFilled, HeartOutlined, ShoppingCartOutlined, ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { Spin, message } from "antd";
import { parseProductImage, type ApiProduct } from "../index";
import { URL } from "../../../config/apiUrl";
import axiosClient from "../../../api/axiosClient";
import { addToCartApi } from "../../../api/cartApi";
import './DetailProduct.css';
import ProductReviewSection from "./ProductReviewSection";

function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [product, setProduct] = useState<ApiProduct | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedColor, setSelectedColor] = useState<string>("");
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
    const [qty, setQty] = useState<number>(1);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProductDetail = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const res: ApiProduct = await axiosClient.get(`${URL}/product/${id}`);
                if (res) {
                    setProduct(res);
                }
            } catch (err) {
                console.error("Fetch product detail error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetail();
    }, [id]);

    // Extract Options (Sizes and Colors) from options object
    const colorOption: any = product?.options
        ? Object.values(product.options).find((opt: any) => opt.name?.toLowerCase().includes("màu"))
        : null;

    const sizeOption: any = product?.options
        ? Object.values(product.options).find((opt: any) => opt.name?.toLowerCase().includes("kích") || opt.name?.toLowerCase().includes("size"))
        : null;

    const colorList: string[] = colorOption?.values?.map((v: any) => v.value) || [];
    const sizeList: string[] = sizeOption?.values?.map((v: any) => v.value) || [];

    // Pre-select default variant
    useEffect(() => {
        if (product) {
            const firstAvailableVar = product.variants?.find((v) => v.stock > 0) || product.variants?.[0];
            if (firstAvailableVar && firstAvailableVar.attributes?.comboKey && product.options) {
                const valueIds = String(firstAvailableVar.attributes.comboKey).split("-");
                Object.values(product.options).forEach((opt: any) => {
                    const optName = opt.name?.toLowerCase() || "";
                    const matchedVal = opt.values?.find((val: any) => valueIds.includes(String(val.id)));
                    if (matchedVal) {
                        if (optName.includes("màu")) {
                            setSelectedColor(matchedVal.value);
                        } else if (optName.includes("kích") || optName.includes("size")) {
                            setSelectedSize(matchedVal.value);
                        }
                    }
                });
            } else {
                if (colorList.length > 0 && !selectedColor) setSelectedColor(colorList[0]);
                if (sizeList.length > 0 && !selectedSize) setSelectedSize(sizeList[0]);
            }
        }
    }, [product]);

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 36, color: "#c89968" }} spin />} />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="detail-not-found">
                <div className="detail-not-found-title">Không tìm thấy sản phẩm</div>
                <button className="detail-back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeftOutlined /> Quay lại
                </button>
            </div>
        );
    }

    // Extract images
    const mainImage = parseProductImage(product.image, product.id);
    let galleryImages: string[] = [mainImage];
    try {
        if (product.image && product.image.trim().startsWith("[")) {
            const parsed = JSON.parse(product.image);
            if (Array.isArray(parsed) && parsed.length > 0) {
                galleryImages = parsed;
            }
        }
    } catch {
        galleryImages = [mainImage];
    }

    // Helper: Find matching variant based on selected size & color
    const findMatchingVariant = () => {
        if (!product?.variants || product.variants.length === 0 || !product.options) {
            return null;
        }

        let selectedColorValId: string | null = null;
        if (colorOption && selectedColor) {
            const valObj = colorOption.values?.find((v: any) => v.value === selectedColor);
            if (valObj) selectedColorValId = String(valObj.id);
        }

        let selectedSizeValId: string | null = null;
        if (sizeOption && selectedSize) {
            const valObj = sizeOption.values?.find((v: any) => v.value === selectedSize);
            if (valObj) selectedSizeValId = String(valObj.id);
        }

        return product.variants.find((v) => {
            if (!v.attributes?.comboKey) return false;
            const comboIds = String(v.attributes.comboKey).split("-");
            let matchColor = true;
            let matchSize = true;

            if (selectedColorValId) {
                matchColor = comboIds.includes(selectedColorValId);
            }
            if (selectedSizeValId) {
                matchSize = comboIds.includes(selectedSizeValId);
            }

            return matchColor && matchSize;
        });
    };

    const currentVariant = findMatchingVariant();

    const priceNum = currentVariant && currentVariant.price
        ? parseFloat(String(currentVariant.price)) || 0
        : (typeof product.basePrice === "string" ? parseFloat(product.basePrice) || 0 : product.basePrice);

    const originalPrice = Math.round(priceNum * 1.15);
    const discount = Math.round((1 - priceNum / (originalPrice || 1)) * 100);

    const currentStock = currentVariant
        ? currentVariant.stock
        : (product.variants && product.variants.length > 0
            ? product.variants.reduce((acc, v) => acc + (v.stock || 0), 0)
            : 50);

    // Handle Add to Cart
    const handleAddToCart = async () => {
        if (!product) return;

        const targetVariant = currentVariant || (product.variants && product.variants[0]);

        if (currentStock <= 0) {
            message.error("Biến thể sản phẩm này đã hết hàng!");
            return;
        }

        const existingCartStr = localStorage.getItem("cart");
        let cartItems: any[] = [];
        if (existingCartStr) {
            try {
                cartItems = JSON.parse(existingCartStr);
            } catch {
                cartItems = [];
            }
        }

        const variantLabel = [
            selectedSize ? `Size ${selectedSize}` : "",
            selectedColor ? `Màu ${selectedColor}` : ""
        ].filter(Boolean).join(" / ") || "Mặc định";

        const cartItemId = targetVariant?.id
            ? `prod_${product.id}_var_${targetVariant.id}`
            : `prod_${product.id}_${variantLabel}`;

        const existingItemIndex = cartItems.findIndex((item: any) =>
            item.cartItemId === cartItemId || (item.id === product.id && item.variant === variantLabel)
        );

        let currentQtyInCart = 0;
        if (existingItemIndex > -1) {
            currentQtyInCart = cartItems[existingItemIndex].quantity || 0;
        }

        if (currentQtyInCart + qty > currentStock) {
            message.warning(`Tồn kho chỉ còn ${currentStock} sản phẩm (bạn đã có ${currentQtyInCart} trong giỏ)!`);
            return;
        }

        const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
        if (token && targetVariant?.id) {
            try {
                await addToCartApi({
                    variantId: targetVariant.id,
                    quantity: qty,
                });
            } catch (err: any) {
                message.error(typeof err === "string" ? err : "Thêm vào giỏ hàng thất bại!");
                return;
            }
        }

        if (existingItemIndex > -1) {
            cartItems[existingItemIndex].quantity += qty;
            cartItems[existingItemIndex].stock = currentStock;
        } else {
            cartItems.push({
                cartItemId,
                id: product.id,
                variantId: targetVariant?.id,
                name: product.name,
                variant: variantLabel,
                price: priceNum,
                originalPrice: originalPrice,
                quantity: qty,
                image: galleryImages[activeImageIndex] || mainImage,
                selected: true,
                stock: currentStock,
            });
        }

        localStorage.setItem("cart", JSON.stringify(cartItems));
        window.dispatchEvent(new Event("cart-change"));
        message.success(`Đã thêm ${qty} sản phẩm (${variantLabel}) vào giỏ hàng!`);
    };

    return (
        <div className="detail-product">
            {/* Breadcrumb */}
            <div className="detail-breadcrumb">
                <span className="detail-breadcrumb-link" onClick={() => navigate(-1)}>
                    <ArrowLeftOutlined style={{ marginRight: 6 }} />
                    Sản phẩm
                </span>
                <span className="detail-breadcrumb-sep">/</span>
                <span className="detail-breadcrumb-current">{product.name}</span>
            </div>

            <div className="detail-product-body">
                {/* Left: Image */}
                <div className="detail-product-image-col">
                    <div className="detail-product-image-wrap">
                        <img
                            src={galleryImages[activeImageIndex] || mainImage}
                            alt={product.name}
                            className="detail-product-img"
                            draggable={false}
                        />
                        <span className="detail-badge-new">Mới</span>
                        <span className="detail-badge-discount">-{discount}%</span>
                    </div>
                    {/* Thumbnail row */}
                    {galleryImages.length > 1 && (
                        <div className="detail-thumbnails">
                            {galleryImages.map((imgUrl, i) => (
                                <div
                                    key={i}
                                    className={`detail-thumbnail${i === activeImageIndex ? ' active' : ''}`}
                                    onClick={() => setActiveImageIndex(i)}
                                >
                                    <img
                                        src={imgUrl}
                                        alt=""
                                        draggable={false}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Info */}
                <div className="detail-info">
                    <div className="detail-category">{product.category?.name || "Thời trang"}</div>
                    <h1 className="detail-title">{product.name}</h1>

                    {/* Rating */}
                    <div className="detail-rating">
                        <div className="detail-stars">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <StarFilled
                                    key={s}
                                    className={`detail-star${s <= 5 ? ' filled' : ''}`}
                                />
                            ))}
                        </div>
                        <span className="detail-rating-value">5.0</span>
                        <span className="detail-review-count">(16 đánh giá)</span>
                    </div>

                    {/* Price */}
                    <div className="detail-price-row">
                        <span className="detail-price">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(priceNum)}</span>
                        <span className="detail-original-price">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(originalPrice)}</span>
                        <span className="detail-discount-tag">-{discount}%</span>
                    </div>

                    <div className="detail-divider" />

                    {/* Description */}
                    <p className="detail-description">
                        {product.description || "Sản phẩm cao cấp được làm từ chất liệu cao cấp, thoáng mát và tôn dáng. Thích hợp cho nhiều dịp từ đi làm đến dạo phố."}
                    </p>

                    {/* Color selector */}
                    {colorList.length > 0 && (
                        <div className="detail-option-section">
                            <div className="detail-option-label">
                                Màu sắc:
                            </div>
                            <div className="detail-color-list">
                                {colorList.map((c) => (
                                    <button
                                        key={c}
                                        className={`detail-color-btn${selectedColor === c ? ' active' : ''}`}
                                        onClick={() => setSelectedColor(c)}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Size selector */}
                    {sizeList.length > 0 && (
                        <div className="detail-option-section">
                            <div className="detail-option-label">
                                Kích cỡ:
                            </div>
                            <div className="detail-size-list">
                                {sizeList.map((s) => (
                                    <button
                                        key={s}
                                        className={`detail-size-btn${selectedSize === s ? ' active' : ''}`}
                                        onClick={() => setSelectedSize(s)}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity + Stock */}
                    <div className="detail-qty-row">
                        <div className="detail-qty-control">
                            <button
                                className="detail-qty-btn"
                                onClick={() => setQty((q) => Math.max(1, q - 1))}
                                disabled={currentStock <= 0}
                            >
                                −
                            </button>
                            <span className="detail-qty-value">{qty}</span>
                            <button
                                className="detail-qty-btn"
                                onClick={() => setQty((q) => Math.min(currentStock, q + 1))}
                                disabled={currentStock <= 0 || qty >= currentStock}
                            >
                                +
                            </button>
                        </div>
                        <span className={`detail-stock${currentStock <= 20 ? ' low' : ''}`}>
                            {currentStock > 0 ? `Còn ${currentStock} sản phẩm` : 'Hết hàng'}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="detail-actions">
                        <button
                            className="detail-btn-cart"
                            disabled={currentStock <= 0}
                            onClick={handleAddToCart}
                        >
                            <ShoppingCartOutlined style={{ marginRight: 8 }} />
                            {currentStock > 0 ? "Thêm vào giỏ" : "Hết hàng"}
                        </button>
                        <button className="detail-btn-wishlist" aria-label="Yêu thích">
                            <HeartOutlined />
                        </button>
                    </div>
                </div>
            </div>

            {/* Product Review Section */}
            <ProductReviewSection productId={product?.id} />
        </div>
    );
}

export default ProductDetail;