import { API_GREEN3S } from "@configs/end-points-url";
import { noCache, timeInterval, useAPIFetcher } from "@hooks/useAPIFetcher";
import { requester } from "@utils/helps/request";
import { format } from "@utils/helps/time";
import { useEffect, useState } from "react";
import { auth } from "./user";

export const useReportPlantYield = ({ startDate, endDate, plant }) => {
    const [isReady, setIsReady] = useState(false);

    const res = useAPIFetcher(
        API_GREEN3S.REPORT_PLANT_YIELD(format(endDate, "YYYY-MM-DD"), format(startDate, "YYYY-MM-DD"), plant.stationCode),
        {
            dedupingInterval: timeInterval.LONG,
            onSuccess: (data) => {
                if (data.datas)
                    for (let stationCode in data.datas) {
                        const detail_yield_per_day_by_date = {};
                        data.datas[stationCode].detail_yield_per_day.forEach((pD) => {
                            detail_yield_per_day_by_date[pD.date] = pD;
                        });

                        data.datas[stationCode].detail_yield_per_day_by_date = detail_yield_per_day_by_date;
                    }

                if (data.devices)
                    data.devices.forEach((d) => {
                        const device_yields_by_dates = {};
                        d.device_yields.forEach((dY) => {
                            device_yields_by_dates[dY.date] = dY;
                        });
                        d.device_yields_by_dates = device_yields_by_dates;
                    });
            },
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

export const useReportPlantMaterial = ({ startDate, endDate, plant }) => {
    const [isReady, setIsReady] = useState(false);

    const res = useAPIFetcher(
        API_GREEN3S.REPORT_PLANT_MATERIAL(format(endDate, "YYYY-MM-DD"), format(startDate, "YYYY-MM-DD"), plant.stationCode),
        {
            dedupingInterval: timeInterval.LONG,
            use: [noCache, auth],
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

export const useReportPlantLogRepair = ({ startDate, endDate, plant }) => {
    const [isReady, setIsReady] = useState(false);

    const res = useAPIFetcher(
        API_GREEN3S.REPORT_PLANT_LOG_REPAIR(format(endDate, "YYYY-MM-DD"), format(startDate, "YYYY-MM-DD"), plant.stationCode),
        {
            dedupingInterval: timeInterval.LONG,
            use: [noCache, auth],
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

export const useReportPlantPotentialError = ({ startDate, endDate, plant }) => {
    const [isReady, setIsReady] = useState(false);

    const res = useAPIFetcher(
        API_GREEN3S.REPORT_PLANT_POTENTIAL_ERROR(
            format(endDate, "YYYY-MM-DD"),
            format(startDate, "YYYY-MM-DD"),
            plant.stationCode
        ),
        {
            dedupingInterval: timeInterval.LONG,
            use: [noCache, auth],
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

export const useReportMaintainance = ({ stationCode, month, year }) => {
    const [isReady, setIsReady] = useState(false);
    const key = API_GREEN3S.REPORT_MAINTAINANCE(stationCode, month, year);
    const res = useAPIFetcher(
        key,
        {
            dedupingInterval: 30000,
            use: [noCache, auth],
        },
        requester({
            handleData: (data) => {
                try {
                    data.datas.forEach((item) => {
                        item.totalAmount = item.maintance_works.reduce((preV, currentI) => preV + (currentI.amount ? 1 : 0), 0);
                        item.length = item.maintance_works.length;
                        item.amount_percent_1 = item.totalAmount / item.length;
                        item.amount_percent = (item.totalAmount / item.length) * 100 + "%";
                        item.totalAmountError = item.maintance_works.reduce(
                            (preV, currentI) => preV + (currentI.amount_error || 0),
                            0
                        );
                    });
                    return data;
                } catch (e) {
                    throw new Error(e.message);
                }
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

export const useReportPlanMaintainance = ({ stationCode, month, year }) => {
    const [isReady, setIsReady] = useState(false);
    const key = API_GREEN3S.REPORT_PLAN_MAINTAINANCE(stationCode, month, year);
    const res = useAPIFetcher(key, {
        dedupingInterval: 30000,
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
