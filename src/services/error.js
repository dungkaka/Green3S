import { API_GREEN3S } from "@configs/end-points-url";
import { noCache, useAPIFetcher } from "@hooks/useAPIFetcher";
import { format } from "@utils/helps/time";
import { useEffect, useState } from "react";

export const useFetchErrorAC = ({ startDate, endDate, stationCode, error, status, page }) => {
    const [isReady, setIsReady] = useState(false);

    const res = useAPIFetcher(
        API_GREEN3S.ERROR_AC(format(startDate, "YYYY-MM-DD"), format(endDate, "YYYY-MM-DD"), stationCode, status, error, page),
        {
            revalidateIfStale: true,
            dedupingInterval: 300000,
            use: [noCache],
        }
    );

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

export const useFetchErrorDC = ({ startDate, endDate, stationCode, status, page }) => {
    const [isReady, setIsReady] = useState(false);

    const res = useAPIFetcher(
        API_GREEN3S.ERROR_DC(format(startDate, "YYYY-MM-DD"), format(endDate, "YYYY-MM-DD"), stationCode, status, page),
        {
            revalidateIfStale: true,
            dedupingInterval: 300000,
            use: [noCache],
        }
    );

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

export const useFetchPerformance = ({ startDate, endDate, stationCode, status, page }) => {
    const [isReady, setIsReady] = useState(false);

    const res = useAPIFetcher(
        API_GREEN3S.PERFOMANCE(format(startDate, "YYYY-MM-DD"), format(endDate, "YYYY-MM-DD"), stationCode, status, page),
        {
            revalidateIfStale: true,
            dedupingInterval: 300000,
            use: [noCache],
        }
    );

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

export const useFetchPotentialError = ({ month, year, stationCode, name }) => {
    const [isReady, setIsReady] = useState(false);

    const res = useAPIFetcher(API_GREEN3S.POTENTIAL_ERROR(`${(month < 10 ? "0" : "") + month}`, year, stationCode, name), {
        revalidateIfStale: true,
        dedupingInterval: 300000,
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

export const useFetchErrorResistor = ({ startDate, endDate, stationCode, status, page }) => {
    const [isReady, setIsReady] = useState(false);

    const res = useAPIFetcher(
        API_GREEN3S.ERROR_RESISTOR(format(startDate, "YYYY-MM-DD"), format(endDate, "YYYY-MM-DD"), stationCode, status, page),
        {
            revalidateIfStale: true,
            dedupingInterval: 300000,
            use: [noCache],
        }
    );

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

export const useFetchErrorDisconnect = ({ stationCode }) => {
    const [isReady, setIsReady] = useState(false);

    const res = useAPIFetcher(API_GREEN3S.ERROR_DISCONNECT(stationCode), {
        revalidateIfStale: true,
        dedupingInterval: 300000,
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

export const useFetchPreViewAllError = () => {
    const [isReady, setIsReady] = useState(false);

    const res = useAPIFetcher(API_GREEN3S.ERROR_PREVIEW_ALL(), {
        revalidateIfStale: true,
        dedupingInterval: 300000,
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
