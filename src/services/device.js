import { API_GREEN3S } from "@configs/end-points-url";
import {
    expiredTime,
    noCache,
    resetExpiredTime,
    revalidateFocusEffect,
    timeInterval,
    useAPIFetcher,
} from "@hooks/useAPIFetcher";
import { useEffect, useState } from "react";
import { format } from "@utils/helps/time";
import { requester } from "@utils/helps/request";
import { auth } from "./user";
import { tempData } from "screen/Device/StringAnalysis/tempData";
import { useSWRConfig } from "swr";
import { useGlobalState } from "@hooks/useGlobalState";

export const useListDevice = ({ stationCode = "" } = {}) => {
    return useAPIFetcher(stationCode ? API_GREEN3S.FETCH_LIST_DEVICE(stationCode) : null, {
        revalidateIfStale: false,
        use: [auth],
    });
};

export const useDeviceOverview = ({ deviceId, date }) => {
    const [isReady, setIsReady] = useState(false);
    const key = API_GREEN3S.DEVICE_OVERVIEW(deviceId, format(date, "DD/MM/YYYY"), format(date, "H:M:S"));

    const res = useAPIFetcher(
        key,
        {
            use: [auth, expiredTime(timeInterval.SHORT), revalidateFocusEffect()],
        },
        requester({
            handleData: (data) => {
                const firmId = data.device?.factory.cpt_firm_id;
                data.data_device = JSON.parse(data.data_device?.data || "{}");
                data.dataDevices = data.strings.map((string, i) => {
                    const numPV = i + 1;
                    let mttp = null;

                    const status = [];

                    if (data.error_performance?.datas?.some((string) => string == "pv" + numPV))
                        status.push(data.error_performance?.name);
                    if (data.error_dc?.strings?.some((string) => string == "pv" + numPV)) status.push(data.error_dc?.name);

                    const numString =
                        data.device.cpt_device_setting.filter((item) => item.string == "pv" + numPV)[0]?.value || 0;
                    if (status.length == 0) {
                        status.push(numString == 0 ? "Không dùng" : "Bình thường");
                    }

                    if (firmId == 1) mttp = data.data_device["mppt" + "_" + (numPV + (numPV % 2)) / 2 + "_" + "cap"];
                    else if (firmId == 2) mttp = data.data_device["mppt" + "_" + numPV + "_" + "cap"];

                    return {
                        numPV: numPV,
                        name: string,
                        u: data.data_device["pv" + numPV + "_u"] || null,
                        i: data.data_device["pv" + numPV + "_i"] || null,
                        mttp: mttp,
                        status: status,
                        numString: numString,
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
            use: [auth, expiredTime(timeInterval.NORMAL)],
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

export const useStringAnalysis = ({ deviceId, date }) => {
    const [isReady, setIsReady] = useState(false);

    const res = useAPIFetcher(
        API_GREEN3S.DEVICE_STRING_ANALYSIS(deviceId, format(date, "YYYY-MM-DD")),
        {
            dedupingInterval: timeInterval.LONG,
            use: [auth, expiredTime(timeInterval.NORMAL)],
        },
        requester({
            handleData: (data) => {
                const { datas } = data;
                const { error_dc, name_string_value, total_performance_2pv, total_performance_1pv, firm } = datas;

                const arrayData = [];
                arrayData.push({
                    summary: true,
                    time: "Số lần Min 2PV",
                    string: total_performance_2pv,
                });

                arrayData.push({
                    summary: true,
                    time: "Số lần Min 1PV",
                    string: total_performance_1pv,
                });

                let i = 1;
                for (let time in datas.data_strings) {
                    const error = error_dc[time];
                    const errorList = error ? Object.keys(error) : [];
                    const _ = datas.data_strings[time];

                    arrayData.push({
                        order: i,
                        time: time,
                        errorPv2s: errorList.filter((string) => name_string_value[string] == 2),
                        errorPv1s: errorList.filter((string) => name_string_value[string] == 1),
                        ..._,
                    });
                    i++;
                }

                return { ...datas, arrayData: arrayData };
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

export const useSettingController = () => {
    const { cache } = useSWRConfig();

    const { data, mutate } = useGlobalState("KEY_TAB_DEVICE", {
        initData: Date.now(),
    });

    const updateStrings = () => {
        resetExpiredTime(cache, `/device/.+/(overview|analysis-string)`);
    };

    return {
        keyTab: data,
        updateStrings,
    };
};
