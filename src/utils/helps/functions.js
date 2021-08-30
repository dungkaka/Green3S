export function randomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
}

export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function isUndefined(value) {
    return value !== undefined;
}

export const delay = (m) => new Promise((r) => setTimeout(r, m));

export const checkKeyMemo = (prevArray, nextArray) => {
    if (!Array.isArray(nextArray)) return false;
    for (let i = 0; i < nextArray.length; i++) {
        if (nextArray[i] != prevArray[i]) return false;
    }
    return true;
};

export const mergeStyle = (stylesOne, stylesTwo) => {
    const newStyle = {};
    for (let style in stylesOne) {
        newStyle[style] = { ...stylesOne[style], ...stylesTwo[style] };
    }
    return newStyle;
};
