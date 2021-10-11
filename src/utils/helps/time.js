import { isString } from "./functions";

class STimer {
    static now() {
        return Date.now();
    }

    static add(originTime, value = 0, unit = "s") {
        switch (unit) {
            case "s":
            case "seconds":
                return originTime + value * 1000;
            case "m":
            case "minutes":
                return originTime + value * 60000;
            case "h":
            case "hours":
                return originTime + value * 3600000;
            case "d":
            case "days":
                return originTime + value * 86400000;
            default:
                return originTime;
        }
    }

    static minus(originTime, value = 0, unit = "s") {
        switch (unit) {
            case "s":
            case "seconds":
                return originTime - value;
            case "m":
            case "minutes":
                return originTime - value * 60;
            case "h":
            case "hours":
                return originTime - value * 60 * 60;
            case "d":
            case "days":
                return originTime - value * 60 * 60 * 24;
            default:
                return originTime;
        }
    }

    static isBefore(originTime, desTime) {
        return originTime - desTime < 0;
    }

    static isAfter(originTime, desTime) {
        return originTime - desTime > 0;
    }

    static isEqual(originTime, desTime) {
        return originTime - desTime == 0;
    }
}

class Timer {
    constructor(time) {
        this.time = this.validateTime(time);
    }

    get() {
        return this.time;
    }

    getTime() {
        return this.time.getTime();
    }

    validateTime(time = new Date()) {
        if (isString(time)) return new Date(time);
        return time;
    }

    add(value, unit) {
        this.time.setTime(STimer.add(this.time.getTime(), value, unit));
        return this;
    }

    minus(value, unit) {
        this.time.setTime(STimer.minus(this.time.getTime(), value, unit));
        return this;
    }

    isBefore(time) {
        return STimer.isBefore(this.time.getTime(), this.validateTime(time).getTime());
    }

    isAfter(time) {
        return STimer.isAfter(this.time.getTime(), this.validateTime(time).getTime());
    }

    isEqual(time) {
        return STimer.isEqual(this.time.getTime(), this.validateTime(time).getTime());
    }

    valueOf() {
        return this.get();
    }

    toDateObject() {
        return {
            day: this.time.getDate(),
            month: this.time.getMonth() + 1,
            year: this.time.getFullYear(),
        };
    }
}

export const time = () => new Timer();

export const convertDateAndTime = (d) =>
    d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() + " - " + d.getHours() + ":" + d.getMinutes();
