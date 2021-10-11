import { objDateTo } from "@common-ui/Calendar/utils";
import { API_GREEN3S } from "@configs/end-points-url";
import { noCache, useAPIFetcher } from "@hooks/useAPIFetcher";
import { useEffect, useState } from "react";

export const useFetchErrorAC = ({ startDate, endDate, stationCode, error, status }) => {
    const [isReady, setIsReady] = useState(false);

    const res = useAPIFetcher(
        API_GREEN3S.ERROR_AC(objDateTo(startDate, "YYYY-MM-DD"), objDateTo(endDate, "YYYY-MM-DD"), stationCode, status, error),
        {
            revalidateIfStale: true,
            dedupingInterval: 60000,
            use: [noCache],
        }
    );

    useEffect(() => {
        setTimeout(() => {
            setIsReady(true);
        }, 300);
    }, []);

    return {
        ...res,
        rData: isReady ? res.data : undefined,
        rIsValidating: isReady ? res.isValidating : true,
    };
};

export const useFetchErrorDC = ({ startDate, endDate, stationCode, status }) => {
    const [isReady, setIsReady] = useState(false);

    const res = useAPIFetcher(
        API_GREEN3S.ERROR_DC(objDateTo(startDate, "YYYY-MM-DD"), objDateTo(endDate, "YYYY-MM-DD"), stationCode, status),
        {
            revalidateIfStale: true,
            dedupingInterval: 60000,
            use: [noCache],
        }
    );

    useEffect(() => {
        setTimeout(() => {
            setIsReady(true);
        }, 300);
    }, []);

    return {
        ...res,
        rData: isReady ? res.data : undefined,
        rIsValidating: isReady ? res.isValidating : true,
    };
};

export const useFetchPerformance = ({ startDate, endDate, stationCode, status }) => {
    const [isReady, setIsReady] = useState(false);

    const res = useAPIFetcher(
        API_GREEN3S.PERFOMANCE(objDateTo(startDate, "YYYY-MM-DD"), objDateTo(endDate, "YYYY-MM-DD"), stationCode, status),
        {
            revalidateIfStale: true,
            dedupingInterval: 60000,
            use: [noCache],
        }
    );

    useEffect(() => {
        setTimeout(() => {
            setIsReady(true);
        }, 300);
    }, []);

    return {
        ...res,
        rData: isReady ? res.data : undefined,
        rIsValidating: isReady ? res.isValidating : true,
    };
};

export const useFetchPotentialError = ({ month, year, stationCode, name }) => {
    const [isReady, setIsReady] = useState(false);

    const res = useAPIFetcher(API_GREEN3S.POTENTIAL_ERROR(`${(month < 10 ? "0" : "") + month}`, year, stationCode, name), {
        revalidateIfStale: true,
        dedupingInterval: 60000,
        use: [noCache],
    });

    useEffect(() => {
        setTimeout(() => {
            setIsReady(true);
        }, 300);
    }, []);

    return {
        ...res,
        rData: isReady ? res.data : undefined,
        rIsValidating: isReady ? res.isValidating : true,
    };
};
