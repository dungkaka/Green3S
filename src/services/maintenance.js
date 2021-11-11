import { API_GREEN3S } from "@configs/end-points-url";
import { noCache, useAPIFetcher } from "@hooks/useAPIFetcher";
import { useEffect, useState } from "react";

export const useListWorkMaintainance = ({ stationCode, month, year, nameWork, page }) => {
    const [isReady, setIsReady] = useState(false);
    const key = API_GREEN3S.MAINTAINANCE_LIST_WORK(stationCode, month, year, nameWork, page);
    const res = useAPIFetcher(key, {
        revalidateIfStale: true,
        dedupingInterval: 240000,
        use: [noCache],
    });

    useEffect(() => {
        setTimeout(() => {
            setIsReady(true);
        }, 500);
    }, []);

    return {
        ...res,
        rData: isReady ? res.data : undefined,
        rIsValidating: isReady ? res.isValidating : true,
    };
};

export const useCategoryMaintainance = () => {
    const [isReady, setIsReady] = useState(false);
    const key = API_GREEN3S.MAINTAINANCE_CATEGORY();
    const res = useAPIFetcher(key, {
        revalidateIfStale: true,
        dedupingInterval: 60000,
        use: [noCache],
    });

    useEffect(() => {
        setTimeout(() => {
            setIsReady(true);
        }, 500);
    }, []);

    return {
        ...res,
        rData: isReady ? res.data : undefined,
        rIsValidating: isReady ? res.isValidating : true,
    };
};
