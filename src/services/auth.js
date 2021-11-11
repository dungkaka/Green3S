import { API_GREEN3S } from "@configs/end-points-url";
import { useAPIFetcher } from "@hooks/useAPIFetcher";
import { createRequestWithToken, Request } from "@utils/helps/axios";
import { delay } from "@utils/helps/functions";
import { fileRequester, requester, requestSyncFile } from "@utils/helps/request";
import { DocumentStorage } from "@utils/local-file-sytem";
import { useEffect } from "react";

export const useLogin = () => {
    const key = "LOGIN";
    const res = useAPIFetcher(
        key,
        {
            revalidateOnMount: false,
            errorRetryCount: 0,
        },
        fileRequester({
            requestFunc: () => DocumentStorage.readAsync("auth", "user"),
        })
    );

    useEffect(() => {}, []);

    const revalidateRemoteUser = async (user, onSuccess = () => {}) => {
        // const data = await requester({
        //     requestFunc: () => Request.Server.post(key, user),
        // })();
        await delay(1);
        const data = {
            username: "Dungkaka",
            token: "123456",
        };
        onSuccess();
        DocumentStorage.writeAsync("auth", "user", data);
        res.mutate(data, false);
        createRequestWithToken(data.token);
    };

    const logout = async () => {
        await DocumentStorage.deleteAsync("auth", "user");
        await res.mutate(null, false);
        createRequestWithToken(null);
    };

    res.revalidateRemoteUser = revalidateRemoteUser;
    res.revalidateLocalUser = async () => {
        const data = await res.mutate();
        data && createRequestWithToken(data.token);
    };
    res.logout = logout;
    return res;
};

export const useUser = () => {
    const key = "USER_INFOR";
    const res = useAPIFetcher(
        key,
        null,
        fileRequester({
            requestFunc: () => DocumentStorage.readAsync("auth", "user"),
        })
    );

    return res;
};
