import { API_GREEN3S } from "@configs/end-points-url";
import { noCache, timeInterval, useAPIFetcher } from "@hooks/useAPIFetcher";
import { useEffect, useState } from "react";
import { auth } from "./user";

export const useFetchMaterial = ({ name }) => {
    const [isReady, setIsReady] = useState(false);

    const res = useAPIFetcher(API_GREEN3S.MATERIAL(name), {
        revalidateIfStale: true,
        dedupingInterval: timeInterval.LONG,
        use: [noCache, auth],
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
