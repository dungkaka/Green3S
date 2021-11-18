import { useAPIFetcher } from "@hooks/useAPIFetcher";
import { fileRequester } from "@utils/helps/request";

export const keyUseUser = "USER_INFOR";
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
        user: res.data?.user,
    };
};

export const auth = (useSWRNext) => (key, fetcher, config) => {
    const { user } = useUser();
    const swr = useSWRNext(user && key ? [key, user?.email] : null, fetcher, config);
    return swr;
};
