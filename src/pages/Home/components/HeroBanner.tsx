import React from "react";
import { useNavigate } from "react-router";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { slides } from "../homeData";
import useCarousel from "../../../hooks/useCarousel";

interface HeroDotsProps {
    current: number;
    onGoTo: (i: number) => void;
}

const HeroDots: React.FC<HeroDotsProps> = React.memo(({ current, onGoTo }) => {
    return (
        <div className="hero-dots" role="tablist">
            {slides.map((_, i) => (
                <button
                    key={i}
                    role="tab"
                    aria-selected={current - 1 === i}
                    className={`hero-dot${current - 1 === i ? " active" : ""}`}
                    onClick={() => onGoTo(i)}
                    aria-label={`Chuyển đến slide ${i + 1}`}
                />
            ))}
        </div>
    );
});

export const HeroBanner: React.FC = () => {
    const navigate = useNavigate();
    const { current, transition, go, goTo, handleTransitionEnd, loop } = useCarousel();

    return (
        <section className="hero-banner" aria-label="Ảnh nổi bật">
            <div
                className="hero-slides"
                onTransitionEnd={handleTransitionEnd}
                style={{
                    transform: `translateX(-${current * 100}%)`,
                    transition: transition ? "transform .6s ease" : "none",
                }}
            >
                {loop.map((slide, i) => (
                    <div className="hero-slide" key={i}>
                        <img
                            className="hero-slide-img"
                            src={slide.img}
                            alt={slide.label}
                            loading={i === 1 ? "eager" : "lazy"}
                        />
                        <div className={slide.overlayClass} />
                        <div className={`hero-copy ${slide.copyAlign}`}>
                            <div className="hero-label">{slide.label}</div>
                            <p className="hero-sub">{slide.sub}</p>
                            <button
                                className={`hero-cta${slide.ctaStyle === "dark" ? " dark" : ""}`}
                                onClick={() => navigate(slide.href)}
                            >
                                {slide.cta}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <button
                className="hero-arrow prev"
                onClick={() => go(-1)}
                aria-label="Slide trước"
            >
                <LeftOutlined />
            </button>

            <button
                className="hero-arrow next"
                onClick={() => go(1)}
                aria-label="Slide tiếp theo"
            >
                <RightOutlined />
            </button>

            <HeroDots current={current} onGoTo={goTo} />
        </section>
    );
};

export default HeroBanner;
