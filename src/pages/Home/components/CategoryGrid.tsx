import React, { useEffect, useState } from "react";
import { RightOutlined, LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import axiosClient from "../../../api/axiosClient";
import { URL } from "../../../config/apiUrl";
import { homeCategories } from "../homeData";

export interface CategoryItem {
    id: number | string;
    name?: string;
    label?: string;
    image?: string;
    img?: string;
    href?: string;
    children?: CategoryItem[];
}

const DEFAULT_IMAGES = [
    "/assets/banner-1.png",
    "/assets/banner-3.png",
    "/assets/banner-2.png",
];

const getCategoryImg = (cat: CategoryItem, index: number): string => {
    if (cat.img) return cat.img;
    if (cat.image) return cat.image;
    return DEFAULT_IMAGES[index % DEFAULT_IMAGES.length];
};

export const CategoryGrid: React.FC = () => {
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const res: any = await axiosClient.post(`${URL}/category/search`, {});
                const data = Array.isArray(res) ? res : (res && res.data ? res.data : []);
                if (data && data.length > 0) {
                    setCategories(data);
                } else {
                    setCategories(homeCategories);
                }
            } catch (err) {
                console.error("Fetch categories error:", err);
                setCategories(homeCategories);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <section className="home-categories" aria-label="Danh mục sản phẩm">
            <div className="home-section-header">
                <h2 className="home-section-title">Danh Mục Nổi Bật</h2>
                <a href="/product" className="home-section-link">
                    Xem tất cả <RightOutlined style={{ fontSize: 11 }} />
                </a>
            </div>
            {loading ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                </div>
            ) : (
                <div className="home-category-grid">
                    {categories.map((cat, index) => {
                        const title = cat.name || cat.label || `Danh mục ${cat.id}`;
                        const linkHref = cat.href || `/product?category=${cat.id}`;
                        const imgSrc = getCategoryImg(cat, index);

                        return (
                            <a
                                key={cat.id}
                                id={`category-${cat.id}`}
                                href={linkHref}
                                className="home-category-card"
                                aria-label={title}
                            >
                                <img
                                    className="home-category-img"
                                    src={imgSrc}
                                    alt={title}
                                    loading="lazy"
                                />
                                <div className="home-category-label">{title}</div>
                            </a>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default CategoryGrid;

