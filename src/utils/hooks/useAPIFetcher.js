import { fetcher as defaultFetcher } from "@utils/helps/request";
import { useEffect, useRef } from "react";
import useSWR, { useSWRConfig } from "swr";
import { usePrevious } from "./usePrevious";

export const useAPIFetcher = (key, options, fetcher) => {
    return useSWR(key, fetcher ? fetcher : defaultFetcher, {
        compare: (a, b) => a == b,
        revalidateIfStale: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: true,
        errorRetryInterval: 1000,
        errorRetryCount: 2,
        dedupingInterval: timeInterval.XX_SHORT,
        ...options,
    });
};

export const timeInterval = {
    XX_SHORT: 5000,
    X_SHORT: 15000,
    SHORT: 60000,
    NORMAL: 180000,
    LONG: 300000,
    X_LONG: 600000,
};

/*
    * key: can be url or array of key. "api/v1" or ["api/v1", param1, param2];

    * revalidateOnMount = false will prevent fetch API when component mounted, need to use mutate to force validate.
    In span time dedupingInterval, validate only happen with mutate(). That mean, if revalidateOnMount = true, and component A
    mount in time of dedupingInterval, it will not revalidate, just use old data from previous hook.

    * revalidateIfStale: if revalidateIfStale = false, don't declare revalidateOnMount, or make revalidateOnMount = false,

    * IN EACH TIME, useSWR always take data from cache if it already validate before, then revalidate and return new value.
    Even revalidateOnMount = false or isPaused() = true, it still follow this rule.

    * isPaused() : when isPaused return true, it will not revalidation even when you call mutate(). If you want to mutate work, you also need to change return value of isPaused() before; It is helpfull when you want to call add, delete method of list of your customhook but not want to re-render current component because mutate not working in THIS component.

    * dedupingInterval: determined should revalidate request in the next period of time. That mean, if you have component A with dedupingInterval = 5000 and component B with dedupingInterval = 1000 (A and B same key). When you are in component A, 
    after 3s go to component B, the request will not revalidate. But if you are in component B, after 3s go to component A, 
    the request will revalidate. 

    * All config value will keep until we call mutate(). That mean, if a config value depend on some state of component, when update state, config of useSWR not change; until you call mutate(), it will revalidate useSWR with new config value that depend on state.


*/

/* ----------------------------------------------------------------------------------------------- */

// Hook for middleware return addition activeData, that is lastest recently fetch success;
export const saveActiveData = (useSWRNext) => (key, fetcher, config) => {
    const lastWorkData = useRef();
    const swr = useSWRNext(key, fetcher, config);

    useEffect(() => {
        if (swr.data) lastWorkData.current = swr.data;
    }, [swr.data]);

    // activeData is the last recently data is not undefined (that mean the last success fetch data include current fetch)
    return {
        ...swr,
        activeData: swr.data ? swr.data : lastWorkData.current,
        data: swr.data,
    };
};

// Hook for middleware sure that cache is not avaiable when change key, but dedupingInterval still work;
export const noCache = (useSWRNext) => (key, fetcher, config) => {
    const { cache } = useSWRConfig();
    const preKey = usePrevious(key);

    if (key != preKey) cache.delete(key);

    const swr = useSWRNext(key, fetcher, config);

    return swr;
};
