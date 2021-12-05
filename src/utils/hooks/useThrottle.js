import { useRef } from "react";
import { throttle } from "@utils/helps/functions";

export const useThrottle = (callback, delay) => {
    const throttleRef = useRef();

    return (callback, delay) => throttle(throttleRef, callback, delay);
};
