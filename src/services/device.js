import { API_GREEN3S } from "@configs/end-points-url";
import { noCache, timeInterval, useAPIFetcher } from "@hooks/useAPIFetcher";
import { useEffect, useState } from "react";
import { format } from "@utils/helps/time";
import { requester } from "@utils/helps/request";
import { auth } from "./user";

export const useListDevice = ({ stationCode = "" } = {}) => {
    return useAPIFetcher(API_GREEN3S.FETCH_LIST_DEVICE(stationCode));
};

export const useDeviceOverview = ({ deviceId, date }) => {
    const [isReady, setIsReady] = useState(false);
    const key = API_GREEN3S.DEVICE_OVERVIEW(deviceId, format(date, "DD/MM/YYYY"), format(date, "H:M:S"));

    const res = useAPIFetcher(
        key,
        {
            dedupingInterval: timeInterval.LONG,
            use: [noCache, auth],
        },
        requester({
            handleData: (data) => {
                const firmId = data.device?.factory.cpt_firm_id;
                data.data_device = JSON.parse(data.data_device?.data || "{}");
                data.dataDevices = data.strings.map((string, i) => {
                    const numPV = i + 1;
                    let mttp = null;

                    if (firmId == 1) mttp = data.data_device["mppt" + "_" + (numPV + (numPV % 2)) / 2 + "_" + "cap"];
                    else if (firmId == 2) mttp = data.data_device["mppt" + "_" + numPV + "_" + "cap"];

                    return {
                        numPV: numPV,
                        name: string,
                        u: data.data_device["pv" + numPV + "_u"] || null,
                        i: data.data_device["pv" + numPV + "_i"] || null,
                        mttp: mttp,
                        numString: data.device.cpt_device_setting.filter((item) => item.string == "pv" + numPV)[0]?.value || 0,
                    };
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

export const useFetchError = ({ deviceId, date, error }) => {
    const [isReady, setIsReady] = useState(false);

    const res = useAPIFetcher(
        API_GREEN3S.ALL_ERROR(format(date, "YYYY-MM-DD"), format(date, "YYYY-MM-DD"), "", deviceId, "", "", error),
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

export const useFetchDevicePower = ({ deviceId, date }) => {
    const [isReady, setIsReady] = useState(false);

    const res = useAPIFetcher(API_GREEN3S.FETCH_DEVICE_POWER(deviceId, format(date, "DD/MM/YYYY")), {
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
