export const objDateTo = (date, form = "YYYY-MM-DD") => {
    switch (form) {
        case "YYYY-MM-DD":
            return `${date.year}-${(date.month < 10 ? "0" : "") + date.month}-${(date.day < 10 ? "0" : "") + date.day}`;
        default:
            return undefined;
    }
};
