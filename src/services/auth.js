import { API_GREEN3S } from "@configs/end-points-url";
import { useAPIFetcher } from "@hooks/useAPIFetcher";
import { createRequestWithToken, Request } from "@utils/helps/axios";
import { fileRequester, requester } from "@utils/helps/request";
import { DocumentStorage } from "@utils/local-file-sytem";
import { mutate } from "swr";
import { getExpoPushToken } from "./notification";

export const useLogin = () => {
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
            requestFunc: () => Request.Server.post(key, { ...user, deviceToken: token }),
        })();

        onSuccess();
        DocumentStorage.writeAsync("auth", "user", data);
        await res.mutate(data, false);
        mutate(keyUseUser, data);
        createRequestWithToken(data.Token);
    };

    const logout = async () => {
        await DocumentStorage.deleteAsync("auth", "user");
        await res.mutate(null, false);
        createRequestWithToken(null);
    };

    res.revalidateRemoteUser = revalidateRemoteUser;
    res.revalidateLocalUser = async () => {
        const data = await res.mutate();
        if (data) {
            mutate(keyUseUser, data);
            createRequestWithToken(data.Token);
        }
    };
    res.logout = logout;
    return res;
};

const keyUseUser = "USER_INFOR";
export const useUser = () => {
    const res = useAPIFetcher(
        keyUseUser,
        {
            revalidateIfStale: false,
        },
        fileRequester({
            requestFunc: () => DocumentStorage.readAsync("auth", "user"),
        })
    );

    return {
        data: res.data,
        userName: "ADMIN USER",
    };
};
