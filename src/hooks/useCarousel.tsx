import { useCallback, useEffect, useRef, useState } from "react";
import { slides } from "../pages/Home/homeData";

const loop = [slides[slides.length - 1], ...slides, slides[0]];
const LOOP_LEN = loop.length;
const INTERVAL_MS = 4500;

function useCarousel() {
    const [current, setCurrent] = useState(1);
    const [transition, setTransition] = useState(true);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const isAnimatingRef = useRef(false);

    const startTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            if (!isAnimatingRef.current) {
                isAnimatingRef.current = true;
                setCurrent((c) => c + 1);
            }
        }, INTERVAL_MS);
    }, []);

    useEffect(() => {
        startTimer();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [startTimer]);

    const go = useCallback(
        (delta: number) => {
            if (isAnimatingRef.current) return;
            isAnimatingRef.current = true;
            setCurrent((c) => c + delta);
            startTimer();
        },
        [startTimer]
    );

    const goTo = useCallback(
        (index: number) => {
            if (isAnimatingRef.current) return;
            isAnimatingRef.current = true;
            setCurrent(index + 1);
            startTimer();
        },
        [startTimer]
    );

    const handleTransitionEnd = useCallback(() => {
        setCurrent((cur) => {
            if (cur >= LOOP_LEN - 1) {
                setTransition(false);
                requestAnimationFrame(() =>
                    requestAnimationFrame(() => {
                        setTransition(true);
                        isAnimatingRef.current = false;
                    })
                );
                return 1;
            }
            if (cur <= 0) {
                setTransition(false);
                requestAnimationFrame(() =>
                    requestAnimationFrame(() => {
                        setTransition(true);
                        isAnimatingRef.current = false;
                    })
                );
                return LOOP_LEN - 2;
            }
            isAnimatingRef.current = false;
            return cur;
        });
    }, []);

    return { current, transition, go, goTo, handleTransitionEnd, loop };
}

export default useCarousel;