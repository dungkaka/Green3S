import { API_GREEN3S } from "@configs/end-points-url";
import { expiredTime, noCache, resetExpiredTime, saveActiveData, timeInterval, useAPIFetcher } from "@hooks/useAPIFetcher";
import { Request } from "@utils/helps/axios";
import { objectClean } from "@utils/helps/functions";
import { requester } from "@utils/helps/request";
import { format } from "@utils/helps/time";
import { useEffect, useState } from "react";
import { useSWRConfig } from "swr";
import { auth } from "./user";

export const useFetchAllError = ({ startDate, endDate, stationCode, deviceId, error, status, string, page }) => {
    const [isReady, setIsReady] = useState(false);

    const res = useAPIFetcher(
        API_GREEN3S.ALL_ERROR(
            format(startDate, "YYYY-MM-DD"),
            format(endDate, "YYYY-MM-DD"),
            stationCode,
            deviceId,
            status,
            error,
            string,
            page
        ),
        {
            dedupingInterval: timeInterval.LONG,
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

export class ErrorACService {
    static useFetchErrorAC = ({ startDate, endDate, stationCode, deviceId, error, status, page, pageSize }) => {
        const [isReady, setIsReady] = useState(false);

        const key = API_GREEN3S.ERROR_AC(
            format(startDate, "YYYY-MM-DD"),
            format(endDate, "YYYY-MM-DD"),
            stationCode,
            deviceId,
            status,
            error,
            page,
            pageSize
        );

        const res = useAPIFetcher(key, {
            use: [auth, expiredTime(timeInterval.NORMAL)],
        });

        useEffect(() => {
            setTimeout(() => {
                setIsReady(true);
            }, 500);
        }, []);

        return {
            ...res,
            key: res.key,
            rData: isReady ? res.data : undefined,
            rIsValidating: isReady ? res.isValidating : true,
        };
    };

    static useACErrorControl = ({ key }) => {
        const { cache, mutate } = useSWRConfig();

        const deleteErrors = async (errorIds) => {
            await requester({
                requestFunc: () =>
                    Request.Server.post(API_GREEN3S.DELETE_ERROR(), {
                        ids: errorIds,
                    }),
            })();

            if (!key) return;
            mutate(
                key,
                (data) => {
                    if (!data?.datas) return null;
                    console.log("_", errorIds);
                    data.datas = data.datas.filter((error) => !errorIds.includes(error.id.toString()));
                    return { ...data };
                },
                true
            );
            resetExpiredTime(cache, "/error/ac");
        };

        const updateError = async (newError) => {
            await requester({
                requestFunc: () =>
                    Request.Server.post(
                        API_GREEN3S.ERROR_UPDATE(),
                        objectClean(
                            {
                                ids: [newError.id],
                                reason: newError.reason || "",
                                solution: newError.solution || "",
                                status: newError.status,
                            },
                            false
                        )
                    ),
            })();

            if (!key) return;
            mutate(
                key,
                (data) => {
                    if (!data?.datas) return null;
                    const errorIndex = data.datas.findIndex((error) => error.id == newError.id);
                    if (errorIndex >= 0) data.datas[errorIndex] = { ...data.datas[errorIndex], ...newError };
                    return { ...data, datas: [...data.datas] };
                },
                false
            );
        };

        return {
            updateError,
            deleteErrors,
        };
    };
}

export const useFetchErrorDC = ({ startDate, endDate, stationCode, deviceId, status, page, pageSize }) => {
    const [isReady, setIsReady] = useState(false);

    const res = useAPIFetcher(
        API_GREEN3S.ERROR_DC(
            format(startDate, "YYYY-MM-DD"),
            format(endDate, "YYYY-MM-DD"),
            stationCode,
            deviceId,
            status,
            page,
            pageSize
        ),
        {
            dedupingInterval: timeInterval.LONG,
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

export const useFetchPerformance = ({ startDate, endDate, stationCode, deviceId, status, page, pageSize }) => {
    const [isReady, setIsReady] = useState(false);

    const res = useAPIFetcher(
        API_GREEN3S.PERFOMANCE(
            format(startDate, "YYYY-MM-DD"),
            format(endDate, "YYYY-MM-DD"),
            stationCode,
            deviceId,
            status,
            page,
            pageSize
        ),
        {
            dedupingInterval: timeInterval.LONG,
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

export const useFetchPotentialError = ({ month, year, stationCode, name }) => {
    const [isReady, setIsReady] = useState(false);

    const res = useAPIFetcher(API_GREEN3S.POTENTIAL_ERROR(`${(month < 10 ? "0" : "") + month}`, year, stationCode, name), {
        dedupingInterval: timeInterval.LONG,
        use: [noCache, auth],
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
            dedupingInterval: timeInterval.LONG,
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

export const useFetchErrorDisconnect = ({ stationCode }) => {
    const [isReady, setIsReady] = useState(false);

    const res = useAPIFetcher(API_GREEN3S.ERROR_DISCONNECT(stationCode), {
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

export const useFetchPreViewAllError = () => {
    const [isReady, setIsReady] = useState(false);

    const res = useAPIFetcher(API_GREEN3S.ERROR_PREVIEW_ALL(), {
        use: [auth, expiredTime(timeInterval.NORMAL)],
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
