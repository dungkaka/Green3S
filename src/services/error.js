import { confirmAlert } from "@common-ui/Alert/ConfirmAlert";
import { showToast } from "@common-ui/ToastNotify/ToastManager";
import { API_GREEN3S } from "@configs/end-points-url";
import { expiredTime, noCache, resetExpiredTime, saveActiveData, timeInterval, useAPIFetcher } from "@hooks/useAPIFetcher";
import { closeIconLoadingOverlay, openIconLoadingOverlay } from "@redux/actions/app";
import { Request } from "@utils/helps/axios";
import { objectClean } from "@utils/helps/functions";
import { requester } from "@utils/helps/request";
import { format } from "@utils/helps/time";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSWRConfig } from "swr";
import { auth } from "./user";

export const useHintRS = () => {
    return {
        reason: `1. LỖI MẤT ĐIỆN LƯỚI:
        <br>- Mất điện từ lưới điện địa phương do Điện lực địa phương quản lý đóng cắt.
        <br>- Lỗi Máy biến áp 
        <br>- Lỗi đường dây điện AC trong hệ thống đến các thiết bị
        <br>
        2. LỖI MẤT CÂN BẰNG PHA:
        <br>- Chênh lệch điện áp trên lưới điện địa phương ( Trung thế ) cao 
        <br>- Chênh lệch điện áp hạ thế sau Máy Biến Áp cao.
        <br>
        3. CẢNH BÁO ĐIỆN ÁP CAO :
        <br>- Điện áp 3 pha tại thiết bị > 450 VAC
        <br>- Điện áp 1 pha tại thiết bị > 250VAC
        <br>
        4. CẢNH BÁO ĐIỆN ÁP THẤP
        <br>- Điện áp 3 pha tại thiết bị < 360 VAC
        <br>- Điện áp 3 pha tại thiết bị < 200VAC`.replace(/<br>|  +/g, "\r"),
        solution: `1. LỖI MẤT ĐIỆN LƯỚI:
        <br>- Kiểm tra lịch cắt điện, sự cố của lưới điện địa phương, liên hệ với Điện lực địa phương về sự cố ( nếu có ) 
        <br>- Kiểm tra cầu chì Trung thế tại cột của nhà máy và liên hệ với Điện lực địa phương ( nếu có )
        <br>- Kiểm tra tình trạng hoạt động của máy Biến Áp, nếu có lỗi liên hệ với nhà sản xuất, và Điện lực địa phương hỗ trợ. 
        <br>- Kiểm tra điện trở cách điện hệ thống đường dây AC. 
        <br>- Kiểm tra hoạt động của các thiết bị, ACB, MCCB, máy cắt, Inverter 
        <br>- Kiểm tra điện trở đất của các thiết bị nối đất. 
        <br>
        2. LỖI MẤT CÂN BẰNG PHA:
        <br>- Kiểm tra điện áp của các pha sau máy Biến áp
        <br>- Liên hệ với nhà sản xuất hoặc điện lực địa phương nếu sự chênh lệch điện áp cao
        <br>
        3. CẢNH BÁO ĐIỆN ÁP CAO.
        <br>- Kiểm tra điện áp 3 pha hạ thế nếu > 450 VAC , liên hệ Điện lực địa phương để điều chỉnh.
        <br>
        4. CẢNH BÁO ĐIỆN ÁP THẤP.
        <br>- Kiểm tra điện áp 3 pha hạ thế nếu < 360 VAC , liên hệ Điện lực địa phương để điều chỉnh.`.replace(
            /<br>|  +/g,
            "\r"
        ),
    };
};

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

export const useCommonErrorControl = ({ key, regExpKey = "/error/" }) => {
    const dispatch = useDispatch();
    const { cache, mutate } = useSWRConfig();

    const deleteErrors = async (errorIds) => {
        confirmAlert({
            title: "Xóa lỗi",
            content: `Bạn chắc chắn muốn xóa ${errorIds.length} lỗi này chứ, không thể khôi phục sau khi đã xóa !`,
            onOk: async (loading, unloading, close) => {
                try {
                    dispatch(openIconLoadingOverlay());
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
                            data.datas = data.datas.filter((error) => !errorIds.includes(error.id.toString()));
                            return { ...data };
                        },
                        true
                    );
                    resetExpiredTime(cache, regExpKey);
                    dispatch(closeIconLoadingOverlay);
                    close();
                    showToast({
                        type: "success",
                        title: "Xóa lỗi",
                        description: "Thành công !",
                    });
                } catch (e) {
                    dispatch(closeIconLoadingOverlay);
                    showToast({
                        type: "error",
                        title: "Xóa lỗi",
                        description: "Lỗi: " + e.message,
                    });
                }
            },
        });
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

    const updateMultipeRSError = async ({ errorIds, reason, solution }) => {
        await requester({
            requestFunc: () =>
                Request.Server.post(API_GREEN3S.ERROR_ADD_RS(), {
                    ids: errorIds,
                    reason: reason || "",
                    solution: solution || "",
                }),
        })();

        if (!key) return;
        mutate(
            key,
            (data) => {
                if (!data?.datas) return null;
                const newDatas = data.datas.map((error) => {
                    if (errorIds.some((id) => id == error.id))
                        return {
                            ...error,
                            reason: reason,
                            solution: solution,
                        };
                    else return error;
                });
                return { ...data, datas: newDatas };
            },
            false
        );
    };

    return {
        updateError,
        deleteErrors,
        updateMultipeRSError,
    };
};

export const useFetchErrorAC = ({ startDate, endDate, stationCode, deviceId, error, status, page, pageSize }) => {
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
        key: res.key,
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
        key: res.key,
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
