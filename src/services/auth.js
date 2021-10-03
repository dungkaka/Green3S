import { API_GREEN3S } from "@configs/end-points-url";
import { useAPIFetcher } from "@hooks/useAPIFetcher";
import { delay } from "@utils/helps/functions";
import { fileRequester, requester, requestSyncCache } from "@utils/helps/request";
import { useEffect } from "react";

export const useLogin = ({ station_name, firm } = {}) => {
    const key = "LOGIN";
    const res = useAPIFetcher(
        key,
        {
            revalidateOnMount: false,
            errorRetryCount: 0,
        },
        requestSyncCache()
    );

    useEffect(() => {}, []);

    const revalidateRemoteUser = async () => {
        await delay(2000);
        // const data = await requester()(key);
        const data = {};
        await res.mutate(data, false);
    };

    res.revalidateRemoteUser = revalidateRemoteUser;
    res.revalidateLocalUser = res.mutate;
    return res;
};
