import { useAPIFetcher } from "@hooks/useAPIFetcher";
import { fileRequester } from "@utils/helps/request";
import { DocumentStorage } from "@utils/local-file-sytem";

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

    const user = res.data?.user;

    return {
        data: res.data,
        user: user,
        userName: user?.username,
        email: user?.email,
        isAdmin: user?.roles?.some((role) => role == "Admin"),
        isEmployee: user?.roles?.some((role) => role == "Employee" || role == "Admin"),
        isCustomer: true,
    };
};

export const auth = (useSWRNext) => (key, fetcher, config) => {
    const { user } = useUser();
    const keyArray = [key, user?.email];
    const swr = useSWRNext(user && key ? keyArray : null, fetcher, config);
    swr.key = keyArray;
    return swr;
};
