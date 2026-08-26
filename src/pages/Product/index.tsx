import React, { useState, useEffect } from "react";
import { DownOutlined, RightOutlined, StarFilled, LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Product.css";
import { colors, priceRanges, sizes } from "./productFilterConfig";
import config from "../../config/config";
import { URL } from "../../config/apiUrl";
import axiosClient from "../../api/axiosClient";
import { searchProductsApi } from "../../api/productApi";

export type ApiProduct = {
    id: number;
    sku: string;
    name: string;
    basePrice: string | number;
    description: string;
    image?: string;
    status: string;
    options?: any;
    categoryId: number;
    category?: {
        id: number;
        name: string;
        slug: string;
    };
    variants?: Array<{
        id: number;
        sku: string;
        stock: number;
        price: string | number;
        image?: string | null;
        attributes?: any;
    }>;
    createdAt?: string;
};

export type CategoryItem = {
    id: number;
    name: string;
    children?: CategoryItem[];
};

export function parseProductImage(imageStr?: string, idSeed: number | string = 1): string {
    if (imageStr) {
        try {
            if (imageStr.trim().startsWith("[")) {
                const arr = JSON.parse(imageStr);
                if (Array.isArray(arr) && arr.length > 0 && arr[0]) {
                    return arr[0];
                }
            } else if (imageStr.trim().startsWith("http")) {
                return imageStr.trim();
            }
        } catch {
            if (imageStr.startsWith("http")) return imageStr;
        }
    }
    return `https://picsum.photos/seed/${idSeed}/400/300`;
}

function FilterBlock({
    title,
    children,
    defaultOpen = false,
}: {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="filter-block">
            <div className="filter-block-title" onClick={() => setOpen((v) => !v)}>
                <span>{title}</span>
                <DownOutlined className={`filter-block-title-icon${open ? " open" : ""}`} />
            </div>
            <div className={`filter-block-body${open ? "" : " collapsed"}`}>
                {children}
            </div>
        </div>
    );
}

function ProductSidebar({
    categoriesList,
    activeCategory,
    onCategoryChange,
}: {
    categoriesList: CategoryItem[];
    activeCategory: number | string;
    onCategoryChange: (id: number | string) => void;
}) {
    const [checkedPrices, setCheckedPrices] = useState<string[]>([]);
    const [activeColors, setActiveColors] = useState<string[]>([]);
    const [activeSizes, setActiveSizes] = useState<string[]>([]);
    const [expandedParents, setExpandedParents] = useState<Record<number | string, boolean>>({});

    const toggleExpand = (catId: number | string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setExpandedParents((prev) => ({
            ...prev,
            [catId]: prev[catId] === undefined ? true : !prev[catId],
        }));
    };

    const handleParentClick = (cat: CategoryItem) => {
        onCategoryChange(cat.id);
        if (cat.children && cat.children.length > 0) {
            setExpandedParents((prev) => ({
                ...prev,
                [cat.id]: true,
            }));
        }
    };

    const togglePrice = (id: string) =>
        setCheckedPrices((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );

    const toggleColor = (id: string) =>
        setActiveColors((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        );

    const toggleSize = (s: string) =>
        setActiveSizes((prev) =>
            prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
        );

    const resetAll = () => {
        setCheckedPrices([]);
        setActiveColors([]);
        setActiveSizes([]);
        onCategoryChange("all");
    };

    const hasFilter =
        checkedPrices.length > 0 ||
        activeColors.length > 0 ||
        activeSizes.length > 0 ||
        activeCategory !== "all";

    return (
        <aside className="product-sidebar">
            <FilterBlock title="Danh Mục Sản Phẩm" defaultOpen={false}>
                <ul className="filter-category-list">
                    <li
                        key="all"
                        className={`filter-category-item${activeCategory === "all" ? " active" : ""}`}
                        onClick={() => onCategoryChange("all")}
                    >
                        <span className="cat-icon-slot">
                            {activeCategory === "all" && <RightOutlined />}
                        </span>
                        <span>Tất cả sản phẩm</span>
                    </li>
                    {categoriesList.map((cat) => {
                        const hasChildren = Boolean(cat.children && cat.children.length > 0);
                        const isParentActive = Number(activeCategory) === Number(cat.id);
                        const isChildActive = hasChildren && cat.children!.some((sub) => Number(activeCategory) === Number(sub.id));

                        const isExpanded = expandedParents[cat.id] !== undefined
                            ? expandedParents[cat.id]
                            : (isChildActive || isParentActive);

                        return (
                            <React.Fragment key={cat.id}>
                                <li
                                    className={`filter-category-item filter-category-parent${isParentActive ? " active" : ""}`}
                                    onClick={() => handleParentClick(cat)}
                                >
                                    <span
                                        className="cat-icon-slot"
                                        onClick={hasChildren ? (e) => toggleExpand(cat.id, e) : undefined}
                                    >
                                        {hasChildren ? (
                                            <RightOutlined style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                                        ) : isParentActive ? (
                                            <RightOutlined />
                                        ) : null}
                                    </span>
                                    <span>{cat.name}</span>
                                </li>
                                {hasChildren &&
                                    isExpanded &&
                                    cat.children!.map((sub) => {
                                        const isSubActive = Number(activeCategory) === Number(sub.id);
                                        return (
                                            <li
                                                key={sub.id}
                                                className={`filter-category-item filter-category-child${isSubActive ? " active" : ""}`}
                                                onClick={() => onCategoryChange(sub.id)}
                                            >
                                                <span className="cat-icon-slot">
                                                    {isSubActive && <RightOutlined />}
                                                </span>
                                                <span>{sub.name}</span>
                                            </li>
                                        );
                                    })}
                            </React.Fragment>
                        );
                    })}
                </ul>
            </FilterBlock>

            <FilterBlock title="Mức Giá">
                <ul className="filter-check-list">
                    {priceRanges.map((p) => (
                        <li
                            key={p.id}
                            className="filter-check-item"
                            onClick={() => togglePrice(p.id)}
                        >
                            <input
                                id={`price-${p.id}`}
                                type="checkbox"
                                className="filter-check-input"
                                checked={checkedPrices.includes(p.id)}
                                onChange={() => togglePrice(p.id)}
                            />
                            <label htmlFor={`price-${p.id}`} style={{ cursor: "pointer" }}>
                                {p.label}
                            </label>
                        </li>
                    ))}
                </ul>
            </FilterBlock>

            <FilterBlock title="Màu Sắc">
                <div className="filter-color-grid">
                    {colors.map((c) => (
                        <div
                            key={c.id}
                            id={`color-${c.id}`}
                            className={`filter-color-swatch${activeColors.includes(c.id) ? " active" : ""}`}
                            data-color={c.id}
                            title={c.label}
                            style={{ background: c.hex }}
                            onClick={() => toggleColor(c.id)}
                            role="checkbox"
                            aria-checked={activeColors.includes(c.id)}
                            aria-label={c.label}
                        />
                    ))}
                </div>
            </FilterBlock>

            <FilterBlock title="Kích Cỡ">
                <div className="filter-size-grid">
                    {sizes.map((s) => (
                        <button
                            key={s}
                            id={`size-${s}`}
                            className={`filter-size-btn${activeSizes.includes(s) ? " active" : ""}`}
                            onClick={() => toggleSize(s)}
                            aria-pressed={activeSizes.includes(s)}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </FilterBlock>

            {hasFilter && (
                <button
                    id="filter-reset"
                    className="filter-reset-btn"
                    onClick={resetAll}
                >
                    Xóa bộ lọc
                </button>
            )}
        </aside>
    );
}

function formatPrice(n: number | string) {
    const num = typeof n === "string" ? parseFloat(n) || 0 : n;
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(num);
}

function ProductCard({ product, onDetail }: { product: ApiProduct; onDetail: (id: number) => void }) {
    const mainImage = parseProductImage(product.image, product.id);
    const priceNum = typeof product.basePrice === "string" ? parseFloat(product.basePrice) || 0 : product.basePrice;
    const originalPrice = Math.round(priceNum * 1.15); // Default display original price slightly higher
    const totalStock = product.variants && product.variants.length > 0
        ? product.variants.reduce((acc, v) => acc + (v.stock || 0), 0)
        : 50;

    return (
        <div className="product-card">
            <div className="product-card-image-wrap">
                <img
                    draggable={false}
                    alt={product.name}
                    src={mainImage}
                    className="product-card-img"
                />
                <span className="product-card-badge">Mới</span>
                <span className="product-card-discount">-10%</span>
                <div className="product-card-overlay">
                    <button className="product-card-btn" onClick={() => onDetail(product.id)}>Xem chi tiết</button>
                </div>
            </div>
            <div className="product-card-body">
                <div className="product-card-category">{product.category?.name || "Thời trang"}</div>
                <div className="product-card-title">{product.name}</div>
                <div className="product-card-rating">
                    <StarFilled className="product-card-star" />
                    <span className="product-card-rating-value">4.8</span>
                    <span className="product-card-review-count">(12 đánh giá)</span>
                </div>
                <div className="product-card-price-row">
                    <span className="product-card-price">{formatPrice(priceNum)}</span>
                    <span className="product-card-original-price">{formatPrice(originalPrice)}</span>
                </div>

                <div className="product-card-stock">
                    {totalStock <= 20
                        ? <span className="product-card-stock-low">Còn {totalStock} sản phẩm</span>
                        : <span className="product-card-stock-ok">Còn hàng</span>
                    }
                </div>
            </div>
        </div>
    );
}

function ProductGrid({ products, onDetail }: { products: ApiProduct[]; onDetail: (id: number) => void }) {
    if (products.length === 0) {
        return (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#888", width: "100%" }}>
                Không tìm thấy sản phẩm nào phù hợp.
            </div>
        );
    }

    return (
        <div className="product-grid">
            {products.map((p) => (
                <ProductCard key={p.id} product={p} onDetail={onDetail} />
            ))}
        </div>
    );
}

function Product() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const categoryParam = searchParams.get("category");

    const [activeCategory, setActiveCategory] = useState<number | string>(
        categoryParam ? (isNaN(Number(categoryParam)) ? categoryParam : Number(categoryParam)) : "all"
    );
    const [productsList, setProductsList] = useState<ApiProduct[]>([]);
    const [categoriesList, setCategoriesList] = useState<CategoryItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const cat = searchParams.get("category");
        if (cat) {
            setActiveCategory(isNaN(Number(cat)) ? cat : Number(cat));
        }
    }, [searchParams]);

    // Fetch Products from API
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const searchVal = searchParams.get("search");
                const payload: any = {
                    page: 1,
                    pageSize: 50,
                };
                if (searchVal && searchVal.trim()) {
                    payload.search = searchVal.trim();
                }
                const res: any = await searchProductsApi(payload);
                if (res && res.data) {
                    setProductsList(res.data);
                }
            } catch (err) {
                console.error("Fetch products error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchParams]);

    // Fetch Categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res: any = await axiosClient.post(`${URL}/category/search`, {});
                if (res && res.data) {
                    setCategoriesList(res.data);
                }
            } catch (err) {
                console.error("Fetch categories error:", err);
            }
        };

        fetchCategories();
    }, []);

    const targetCategoryIds = activeCategory === "all"
        ? []
        : (() => {
            const numId = Number(activeCategory);
            if (isNaN(numId)) return [];
            const result = [numId];
            const parent = categoriesList.find((c) => Number(c.id) === numId);
            if (parent && parent.children && parent.children.length > 0) {
                parent.children.forEach((child) => result.push(Number(child.id)));
            }
            return result;
        })();

    const filtered = activeCategory === "all"
        ? productsList
        : productsList.filter((p) => {
            const catId = Number(p.categoryId || p.category?.id);
            return targetCategoryIds.includes(catId);
        });

    const handleDetail = (id: number) => {
        navigate(config.routes.PRODUCT_DETAIL((id)));
    };

    return (
        <div className="product-page">
            <ProductSidebar
                categoriesList={categoriesList}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
            />
            <div className="product-content">
                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 36, color: "#c89968" }} spin />} />
                    </div>
                ) : (
                    <ProductGrid products={filtered} onDetail={handleDetail} />
                )}
            </div>
        </div>
    );
}

export default Product;