import { API_GREEN3S } from "@configs/end-points-url";
import { noCache, timeInterval, useAPIFetcher } from "@hooks/useAPIFetcher";
import { format } from "@utils/helps/time";
import { useEffect, useState } from "react";
import { auth } from "./user";

export const useFetchAlarm = ({ startDate, endDate, stationCode, page }) => {
    const [isReady, setIsReady] = useState(false);

    const res = useAPIFetcher(
        API_GREEN3S.ALARM(format(startDate, "YYYY-MM-DD"), format(endDate, "YYYY-MM-DD"), stationCode, page),
        {
            dedupingInterval: timeInterval.NORMAL,
            use: [noCache, auth],
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
