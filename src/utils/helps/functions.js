import { Float, Int } from "./number";

export const objectClean = (object, allowNull = true) => {
    const newObject = { ...object };
    Object.keys(newObject).forEach(function (key) {
        if (newObject[key] == undefined || (!allowNull && object[key] == null)) {
            delete newObject[key];
        }
    });

    return newObject;
};

export const arrayClean = (array, allowNull = false) => {
    return array.filter((el) => {
        if (allowNull) return el !== undefined;
        else return el !== undefined && el !== null;
    });
};

export const emptyObject = {};

export const emptyFunc = () => {};

export function randomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
}

export function numberWithCommas(x, character = ".") {
    return Int(x)
        ?.toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, character);
}

export function round(x) {
    if (x != 0 && !x) return undefined;
    return Math.round(Float(x));
}

export function round2(x) {
    if (x != 0 && !x) return undefined;
    return Math.round(Float(x) * 100) / 100;
}

export function isUndefined(value) {
    return value !== undefined;
}

export function isString(obj) {
    return Object.prototype.toString.call(obj) === "[object String]";
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

export const throttle = (lockRef, callback, limit) => {
    if (lockRef.current) return;

    callback();
    lockRef.current = true;
    setTimeout(function () {
        lockRef.current = false;
    }, limit);
};

export const debounce = function (timeOutRef, callback, delay) {
    if (timeOutRef.current) clearTimeout(timeOutRef.current);
    timeOutRef.current = setTimeout(callback, delay);
};
