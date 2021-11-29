import { Int } from "@utils/helps/number";
import { fetcher, requester } from "@utils/helps/request";
import { useEffect, useState } from "react";
import { auth } from "./user";
const { useAPIFetcher, saveActiveData, noCache, timeInterval } = require("@hooks/useAPIFetcher");
import useSWR, { useSWRConfig } from "swr";
import { API_GREEN3S } from "@configs/end-points-url";

export const keyListPlants = API_GREEN3S.LIST_PLANTS();
export const useListPlants = () => {
    const { data, isValidating, error } = useAPIFetcher(keyListPlants, {
        revalidateIfStale: false,
        use: [auth],
    });

    return { data, isValidating, error };
};

export const useSearchFactory = ({ station_name, firm } = {}) => {
    const key = API_GREEN3S.SEARCH_FACTORY(station_name, firm);
    const res = useAPIFetcher(key, {
        dedupingInterval: timeInterval.NORMAL,
        use: [saveActiveData, auth],
    });
    return res;
};

export const useFetchRealtimeDevices = ({ station_code } = {}) => {
    const key = API_GREEN3S.FETCH_REALTIME_DEVICES_FACTORY(station_code);
    const res = useAPIFetcher(station_code ? key : null, {
        dedupingInterval: timeInterval.NORMAL,
        use: [auth],
    });

    return res;
};

export const useFetchDetailPlant = ({ station_code } = {}) => {
    const key = API_GREEN3S.GET_DETAIL_PLANT(station_code);
    const res = useAPIFetcher(station_code ? key : null, {
        dedupingInterval: timeInterval.NORMAL,
        use: [auth],
    });

    return res;
};

export const useFetchYieldByTime = ({ stationCode, year, month } = {}) => {
    const key = API_GREEN3S.FETCH_YIELD_BY_TIME(stationCode, year, month);
    const res = useAPIFetcher(key, {
        dedupingInterval: timeInterval.NORMAL,
        use: [noCache, auth],
    });

    return res;
};

export const useFetchPowerByTime = ({ stationCode, date } = {}) => {
    const key = API_GREEN3S.FETCH_POWER_BY_TIME(stationCode, `${date.day}/${date.month}/${date.year}`);
    const res = useAPIFetcher(key, {
        dedupingInterval: timeInterval.NORMAL,
        use: [noCache, auth],
    });

    return res;
};

export const usePlantReport = ({ stationCode, date }) => {
    const [isReady, setIsReady] = useState(false);
    const key = API_GREEN3S.PLANT_REPORT(stationCode, date.month, date.year);
    const res = useAPIFetcher(key, {
        dedupingInterval: timeInterval.NORMAL,
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

export const usePlantReportInverter = ({ stationCode, date }) => {
    const [isReady, setIsReady] = useState(false);
    const key = API_GREEN3S.PLANT_REPORT_INVERTER(stationCode, date.month, date.year);
    const res = useAPIFetcher(
        key,
        {
            revalidateIfStale: true,
            dedupingInterval: timeInterval.NORMAL,
            use: [noCache, auth],
        },
        requester({
            handleData: (data) => {
                data.datas?.forEach((device) => {
                    const device_yields_byId = {};
                    device.device_yields.forEach((i) => {
                        i.intDate = Int(i.date.slice(8, 10)).toString();
                        device_yields_byId[i.intDate] = i;
                    });
                    device.device_yields_byId = device_yields_byId;
                });

                return data;
            },
        })
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

export const usePlantMaterial = ({ stationCode }) => {
    const [isReady, setIsReady] = useState(false);
    const key = API_GREEN3S.PLANT_MATERIAL(stationCode);
    const res = useAPIFetcher(
        key,
        {
            dedupingInterval: timeInterval.NORMAL,
            use: [noCache, auth],
        },
        requester({
            handleData: (data) => {
                data.data = JSON.parse(data.data.data || "{}");
                return data.data;
            },
        })
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
