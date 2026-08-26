export interface FormatDateOptions {
    includeTime?: boolean;
    fallback?: string;
    locale?: string;
}

export function formatDateTime(
    dateValue?: string | Date | number | null,
    options: FormatDateOptions = {}
): string {
    const { includeTime = true, fallback = "Mới đây", locale = "vi-VN" } = options;

    if (!dateValue) return fallback;

    try {
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) return fallback;

        const dateOptions: Intl.DateTimeFormatOptions = {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            ...(includeTime ? { hour: "2-digit", minute: "2-digit" } : {}),
        };

        return date.toLocaleDateString(locale, dateOptions);
    } catch (error) {
        console.error("formatDateTime error:", error);
        return fallback;
    }
}

export function formatDate(
    dateValue?: string | Date | number | null,
    fallback: string = "Mới đây"
): string {
    return formatDateTime(dateValue, { includeTime: false, fallback });
}
