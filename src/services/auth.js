import { API_GREEN3S } from "@configs/end-points-url";
import { useAPIFetcher } from "@hooks/useAPIFetcher";
import { createRequestWithToken, Request } from "@utils/helps/axios";
import { delay } from "@utils/helps/functions";
import { fileRequester, requester } from "@utils/helps/request";
import { DocumentStorage } from "@utils/local-file-sytem";
import { useSWRConfig } from "swr";
import { getExpoPushToken } from "./notification";
import { keyUseUser } from "./user";

export const useLogin = () => {
    const { cache, mutate } = useSWRConfig();
    const key = API_GREEN3S.LOGIN();
    const res = useAPIFetcher(
        key,
        {
            revalidateIfStale: false,
            revalidateOnMount: false,
            errorRetryCount: 0,
        },
        fileRequester({
            requestFunc: () => DocumentStorage.readAsync("auth", "user"),
        })
    );

    const revalidateRemoteUser = async (user, onSuccess = () => {}) => {
        const token = await getExpoPushToken();
        const data = await requester({
            requestFunc: () => Request.Server.post(key, { ...user, chinh: undefined, dung: null, deviceToken: token }),
        })();

        onSuccess();
        DocumentStorage.writeAsync("auth", "user", data);
        createRequestWithToken(data.access_token);
        await mutate(keyUseUser, data);
        await res.mutate(data, false);
    };

    const logout = async () => {
        await DocumentStorage.deleteAsync("auth", "user");
        await res.mutate(null, false);
        const token = await getExpoPushToken();
        requester({
            requestFunc: () =>
                Request.Server.post(API_GREEN3S.LOGOUT(), {
                    deviceToken: token,
                }),
        })();
        await delay(200);
        createRequestWithToken(null);
    };

    res.revalidateRemoteUser = revalidateRemoteUser;
    res.revalidateLocalUser = async () => {
        const data = await res.mutate();
        if (data) {
            createRequestWithToken(data.access_token);
            mutate(keyUseUser, data);
        }
    };
    res.logout = logout;
    return res;
};
