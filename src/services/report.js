import { objDateTo } from "@common-ui/Calendar/utils";
import { API_GREEN3S } from "@configs/end-points-url";
import { noCache, useAPIFetcher } from "@hooks/useAPIFetcher";
import { useEffect, useState } from "react";

export const useReportPlantYield = ({ startDate, endDate, plant }) => {
    const [isReady, setIsReady] = useState(false);

    const res = useAPIFetcher(
        API_GREEN3S.REPORT_PLANT_YIELD(objDateTo(endDate, "YYYY-MM-DD"), objDateTo(startDate, "YYYY-MM-DD"), plant.stationCode),
        {
            revalidateIfStale: true,
            dedupingInterval: 60000,
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

export const useReportPlantMaterial = ({ startDate, endDate, plant }) => {
    const [isReady, setIsReady] = useState(false);

    const res = useAPIFetcher(
        API_GREEN3S.REPORT_PLANT_MATERIAL(
            objDateTo(endDate, "YYYY-MM-DD"),
            objDateTo(startDate, "YYYY-MM-DD"),
            plant.stationCode
        ),
        {
            revalidateIfStale: true,
            dedupingInterval: 60000,
            use: [noCache],
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
        API_GREEN3S.REPORT_PLANT_LOG_REPAIR(
            objDateTo(endDate, "YYYY-MM-DD"),
            objDateTo(startDate, "YYYY-MM-DD"),
            plant.stationCode
        ),
        {
            revalidateIfStale: true,
            dedupingInterval: 60000,
            use: [noCache],
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
            objDateTo(endDate, "YYYY-MM-DD"),
            objDateTo(startDate, "YYYY-MM-DD"),
            plant.stationCode
        ),
        {
            revalidateIfStale: true,
            dedupingInterval: 60000,
            use: [noCache],
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
