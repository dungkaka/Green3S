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

export const useHintRS = ({ type } = {}) => {
    const { data } = useAPIFetcher(
        [type, API_GREEN3S.GET_REASON_SOLUTION()],
        {
            revalidateIfStale: false,
        },
        requester({
            requestFunc: () =>
                Request.Server.post(API_GREEN3S.GET_REASON_SOLUTION(), {
                    type: type,
                }),
            handleData: (data) => {
                return {
                    reason: data.data.reason.replace(/<br>/g, "\n"),
                    solution: data.data.solution.replace(/<br>/g, "\n"),
                };
            },
        })
    );

    return {
        reason: data?.reason,
        solution: data?.solution,
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

export const useCommonErrorControl = ({ key, regExpKey = "/error/" } = {}) => {
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
        let formData = new FormData();

        formData.append("ids", JSON.stringify([newError.id]));
        formData.append("reason", newError.reason || "");
        formData.append("solution", newError.solution || "");
        formData.append("status", newError.status);

        let nameFiles = "";

        const imagesLength = newError.images?.length;
        newError.images?.forEach((image, index) => {
            if (image) {
                nameFiles = nameFiles + "file" + index + (index == imagesLength - 1 ? "" : ",");
                formData.append("file" + index, image);
            }
        });

        formData.append("nameFiles", nameFiles);

        const res = await requester({
            requestFunc: () =>
                Request.Server.post(API_GREEN3S.ERROR_UPDATE(), formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }),
        })();

        if (!key) return;
        mutate(
            key,
            (data) => {
                if (!data?.datas) return null;
                const errorIndex = data.datas.findIndex((error) => error.id == newError.id);
                if (errorIndex >= 0) data.datas[errorIndex] = { ...data.datas[errorIndex], ...res.datas[0] };
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

    const addPotentialError = async (newPotentialError) => {
        let formData = new FormData();

        formData.append("name", newPotentialError.errorName);
        formData.append("reason", newPotentialError.reason);
        formData.append("idea", newPotentialError.idea);
        formData.append("device_id", newPotentialError.deviceId);
        formData.append("stationCode", newPotentialError.stationCode);
        formData.append("string", JSON.stringify(newPotentialError.string));

        newPotentialError.status && formData.append("status_name", newPotentialError.status);
        newPotentialError.other_device && formData.append("other_device", newPotentialError.other_device);

        let nameFiles = "";

        const imagesLength = newPotentialError.images?.length;
        newPotentialError.images?.forEach((image, index) => {
            if (image) {
                nameFiles = nameFiles + "file" + index + (index == imagesLength - 1 ? "" : ",");
                formData.append("file" + index, image);
            }
        });

        formData.append("nameFiles", nameFiles);

        await requester({
            requestFunc: () =>
                Request.Server.post(API_GREEN3S.CREATE_POTENTIAL_ERROR(), formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }),
        })();

        if (!key) return;

        mutate(key);

        resetExpiredTime(cache, "/error/potential");
    };

    const deletePotentialErrors = async (errorIds) => {
        confirmAlert({
            title: "Xóa lỗi",
            content: `Bạn chắc chắn muốn xóa ${errorIds.length} lỗi này chứ, không thể khôi phục sau khi đã xóa !`,
            onOk: async (loading, unloading, close) => {
                try {
                    dispatch(openIconLoadingOverlay());
                    await requester({
                        requestFunc: () =>
                            Request.Server.post(API_GREEN3S.DELETE_POTENTIAL_ERROR(), {
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
                    resetExpiredTime(cache, "/error/potential");
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

    const updatePotentialError = async (updatePotentialError) => {
        let formData = new FormData();

        formData.append("error_id", updatePotentialError.id);
        formData.append("name", updatePotentialError.errorName);
        formData.append("reason", updatePotentialError.reason);
        formData.append("idea", updatePotentialError.idea);
        formData.append("device_id", updatePotentialError.deviceId);
        formData.append("stationCode", updatePotentialError.stationCode);
        formData.append("status_accept", updatePotentialError.status_accept);
        formData.append("string", JSON.stringify(updatePotentialError.string));

        updatePotentialError.date_repair && formData.append("date_repair", updatePotentialError.date_repair);
        updatePotentialError.status && formData.append("status_name", updatePotentialError.status);
        updatePotentialError.other_device && formData.append("other_device", updatePotentialError.other_device);

        const updatedError = await requester({
            requestFunc: () =>
                Request.Server.post(API_GREEN3S.UPDATE_POTENTIAL_ERROR(), formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }),
        })();

        if (!key) return;
        mutate(
            key,
            (data) => {
                if (!data?.datas) return null;
                const errorIndex = data.datas.findIndex((error) => error.id == updatedError?.data.id);
                if (errorIndex >= 0) data.datas[errorIndex] = { ...data.datas[errorIndex], ...updatedError.data };
                return { ...data, datas: [...data.datas] };
            },
            false
        );
    };

    return {
        updateError,
        deleteErrors,
        addPotentialError,
        updateMultipeRSError,
        deletePotentialErrors,
        updatePotentialError,
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
