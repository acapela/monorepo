const localeOptions: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };

export const formatDate = (date?: string | null) => {
  return date && date.length > 0 ? new Date(date).toLocaleDateString(undefined, localeOptions) : "--";
};
