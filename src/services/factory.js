import { Int } from "@utils/helps/number";
import { requester } from "@utils/helps/request";
import { useEffect, useState } from "react";
const { API_GREEN3S } = require("@configs/end-points-url");
const { useAPIFetcher, saveActiveData, noCache } = require("@hooks/useAPIFetcher");

export const keyListPlants = API_GREEN3S.LIST_PLANTS();
export const useListPlants = () => {
    return useAPIFetcher(keyListPlants);
};

export const useSearchFactory = ({ station_name, firm } = {}) => {
    const key = API_GREEN3S.SEARCH_FACTORY(station_name, firm);
    const res = useAPIFetcher(
        key,
        {
            dedupingInterval: 15 * 1000,
            use: [saveActiveData],
        }
        // requestSyncCache({
        //     cache: true,
        //     expiredTime: 35,
        //     unit: "s",
        // })
    );

    return res;
};

export const useFetchRealtimeDevices = ({ station_code } = {}) => {
    const key = API_GREEN3S.FETCH_REALTIME_DEVICES_FACTORY(station_code);
    const res = useAPIFetcher(
        station_code ? key : null,
        {
            dedupingInterval: 60 * 1000,
        },
        requester({ ignoreStatus: true })
    );

    return res;
};

export const useFetchDetailPlant = ({ station_code } = {}) => {
    const key = API_GREEN3S.GET_DETAIL_PLANT(station_code);
    const res = useAPIFetcher(station_code ? key : null, {
        dedupingInterval: 60 * 1000,
    });

    return res;
};

export const useFetchYieldByTime = ({ stationCode, year, month } = {}) => {
    const key = API_GREEN3S.FETCH_YIELD_BY_TIME(stationCode, year, month);
    const res = useAPIFetcher(key, {
        dedupingInterval: 60 * 1000,
        use: [noCache],
    });

    return res;
};

export const useFetchPowerByTime = ({ stationCode, date } = {}) => {
    const key = API_GREEN3S.FETCH_POWER_BY_TIME(stationCode, `${date.day}/${date.month}/${date.year}`);
    const res = useAPIFetcher(key, {
        dedupingInterval: 60 * 1000,
        use: [noCache],
    });

    return res;
};

export const usePlantReport = ({ stationCode, date }) => {
    const [isReady, setIsReady] = useState(false);
    const key = API_GREEN3S.PLANT_REPORT(stationCode, date.month, date.year);
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

export const usePlantReportInverter = ({ stationCode, date }) => {
    const [isReady, setIsReady] = useState(false);
    const key = API_GREEN3S.PLANT_REPORT_INVERTER(stationCode, date.month, date.year);
    const res = useAPIFetcher(
        key,
        {
            revalidateIfStale: true,
            dedupingInterval: 60000,
            use: [noCache],
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
            revalidateIfStale: true,
            dedupingInterval: 60000,
            use: [noCache],
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
