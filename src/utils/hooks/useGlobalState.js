import useSWR, { useSWRConfig } from "swr";
import { useWillMountEffect } from "./useWillMountEffect";

export const useGlobalState = (
    key,
    { initData = null, handleValidating = false, handleError = false, handleData = true, ...options } = {}
) => {
    const { cache } = useSWRConfig();

    useWillMountEffect(() => {
        if (cache.get(key) == undefined) cache.set(key, initData);
    });

    const swr = useSWR(key, () => initData, {
        compare: (a, b) => a == b,
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: true,
        errorRetryInterval: 1000,
        errorRetryCount: 2,
        dedupingInterval: 10000,
        isPaused: () => (handleData ? false : true),
        ...options,
    });

    return {
        data: handleData ? swr.data : cache.get(key),
        isValidating: handleValidating ? swr.isValidating : null,
        error: handleError ? swr.error : null,
        mutate: (newData) => swr.mutate(newData, false),
        reset: () => swr.mutate(initData, false),
    };
};
