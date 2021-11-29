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
    const keyArray = [key, user?.email];
    const swr = useSWRNext(user && key ? keyArray : null, fetcher, config);
    swr.key = keyArray;
    return swr;
};
