import { useRef } from "react";
import { debounce } from "@utils/helps/functions";

export const useDebound = (callback, delay) => {
    const debounceRef = useRef();

    return () => debounce(debounceRef, callback, delay);
};
