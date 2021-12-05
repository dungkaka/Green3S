import { useRef } from "react";
import { debounce } from "@utils/helps/functions";

export const useDebound = () => {
    const debounceRef = useRef();

    return (callback, delay) => debounce(debounceRef, callback, delay);
};
