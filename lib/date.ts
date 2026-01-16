type DateInput = string | number | Date;

export type DateFormatVariant =
    | "DDMMYYYY"
    | "YYYYMMDD"
    | "YYMMDD"
    | "DDMMMYYYY"
    | "YYYYMMMDD"
    | "YYMMMDD"
    | "MMMYY"
    | "MMMYYYY"
    | "DDMMM"
    | "DDMM";

export type DateSeparator = "/" | "-" | "." | " ";

/**
 * Formats a date into deterministic strings using Intl.DateTimeFormat parts.
 *
 * Supported formats:
 * - DDMMYYYY   → 16-01-2025
 * - YYYYMMDD   → 2025/01/16
 * - YYMMDD     → 25.01.16
 * - DDMMMYYYY  → 16-Jan-2025
 * - YYYYMMMDD  → 2025-Jan-16
 * - YYMMMDD    → 25-Jan-16
 * - MMMYY      → Jan-25
 * - MMMYYYY    → Jan-2025
 * - DDMMM      → 16-Jan
 * - DDMM       → 16-01
 *
 * @param date - Date object, ISO string, or timestamp
 * @param variant - Desired date format
 * @param separator - Separator between parts (`/`, `-`, `.`, or empty)
 * @param locale - BCP 47 locale string (default: "en-IN")
 *
 * @returns Formatted date string or empty string if invalid
 */
export function formatDate(
    date: DateInput,
    variant: DateFormatVariant,
    separator: DateSeparator = " ",
    locale = "en-IN",
): string {
    const d = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(d.getTime())) return "";

    const numericParts = new Intl.DateTimeFormat("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    })
        .formatToParts(d)
        .reduce<Record<string, string>>((acc, part) => {
            acc[part.type] = part.value;
            return acc;
        }, {});

    const MMM = new Intl.DateTimeFormat(locale, {
        month: "short",
    }).format(d);

    const DD = numericParts.day;
    const MM = numericParts.month;
    const YYYY = numericParts.year;
    const YY = YYYY.slice(-2);

    const join = (...parts: string[]) => parts.join(separator);

    switch (variant) {
        case "DDMMYYYY":
            return join(DD, MM, YYYY);
        case "YYYYMMDD":
            return join(YYYY, MM, DD);
        case "YYMMDD":
            return join(YY, MM, DD);
        case "DDMMMYYYY":
            return join(DD, MMM, YYYY);
        case "YYYYMMMDD":
            return join(YYYY, MMM, DD);
        case "YYMMMDD":
            return join(YY, MMM, DD);
        case "MMMYY":
            return join(MMM, YY);
        case "MMMYYYY":
            return join(MMM, YYYY);
        case "DDMMM":
            return join(DD, MMM);
        case "DDMM":
            return join(DD, MM);
    }
}
