import { requester, requestSyncCache } from "@utils/helps/request";
const { API_GREEN3S } = require("@configs/end-points-url");
const { useAPIFetcher, saveActiveData } = require("@hooks/useAPIFetcher");

export const useFetchFactory = ({ station_name, firm } = {}) => {
    const key = API_GREEN3S.SEARCH_FACTORY(station_name, firm);
    const res = useAPIFetcher(
        key,
        {
            dedupingInterval: 15 * 1000,
            use: [saveActiveData],
        }
        // requestSyncCache({
        //     cache: true,
        //     expiredTime: 1,
        //     unit: "d",
        // })
    );

    return res;
};

export const useFetchRealtimeDevices = ({ station_code } = {}) => {
    const key = API_GREEN3S.FETCH_REALTIME_DEVICES_FACTORY(station_code);
    const res = useAPIFetcher(
        station_code ? key : null,
        {
            dedupingInterval: 60 * 60 * 1000,
        },
        requester({ ignoreStatus: true })
    );

    return res;
};

export const useFetchDetailPlant = ({ station_code } = {}) => {
    const key = API_GREEN3S.GET_DETAIL_PLANT(station_code);
    const res = useAPIFetcher(station_code ? key : null, {
        dedupingInterval: 60 * 60 * 1000,
    });

    return res;
};
