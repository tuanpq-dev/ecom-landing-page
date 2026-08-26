interface ReviewFilterTabsProps {
    activeFilter: string;
    onSelectFilter: (filter: string) => void;
    totalCount: number;
    count5: number;
    count4: number;
    count3: number;
}

export function ReviewFilterTabs({
    activeFilter,
    onSelectFilter,
    totalCount,
    count5,
    count4,
    count3,
}: ReviewFilterTabsProps) {
    return (
        <div className="review-filter-tabs">
            <button
                className={`review-filter-btn ${activeFilter === "all" ? "active" : ""}`}
                onClick={() => onSelectFilter("all")}
            >
                Tất cả ({totalCount})
            </button>
            <button
                className={`review-filter-btn ${activeFilter === "5star" ? "active" : ""}`}
                onClick={() => onSelectFilter("5star")}
            >
                5 Sao ({count5})
            </button>
            <button
                className={`review-filter-btn ${activeFilter === "4star" ? "active" : ""}`}
                onClick={() => onSelectFilter("4star")}
            >
                4 Sao ({count4})
            </button>
            <button
                className={`review-filter-btn ${activeFilter === "3star" ? "active" : ""}`}
                onClick={() => onSelectFilter("3star")}
            >
                3 Sao ({count3})
            </button>
        </div>
    );
}

export default ReviewFilterTabs;
