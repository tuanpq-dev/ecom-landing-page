import { useEffect, useRef, useState } from "react";

interface CounterProps {
    target: number;
    decimals?: number;
    suffix?: string;
    className?: string;
}

function Counter({ target, decimals, suffix = "", className = "about-stat-number" }: CounterProps) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const started = useRef(false);

    const decimalPlaces = decimals !== undefined
        ? decimals
        : (!Number.isInteger(target) ? 1 : 0);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    const duration = 1400;
                    const stepsCount = duration / 16;
                    const step = target / stepsCount;
                    let current = 0;

                    const timer = setInterval(() => {
                        current = Math.min(current + step, target);
                        setCount(current);
                        if (current >= target) clearInterval(timer);
                    }, 16);
                }
            },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target]);

    const formattedValue = decimalPlaces > 0
        ? count.toFixed(decimalPlaces)
        : Math.round(count).toLocaleString("vi-VN");

    return (
        <div ref={ref} className={className}>
            {formattedValue}{suffix}
        </div>
    );
}

export default Counter;