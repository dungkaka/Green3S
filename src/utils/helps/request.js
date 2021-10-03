import Exception from "@utils/exceptions/Exception";
import { CacheStorage } from "@utils/local-file-sytem";
import { Request } from "./axios";
import { delay } from "@utils/helps/functions";
import { time } from "./time";
import md5 from "md5";

// API REQUESTER
// requester(config)(url)
export const requester =
    ({ requestFunc = (url) => Request.ServerGreen3S.get(url), boundedTime = 0, ignoreStatus = false } = {}) =>
    async (url) => {
        try {
            const beforeTime = Date.now();
            const res = await requestFunc(url);
            if (Date.now() - beforeTime < 500) await delay(boundedTime);
            if (res.data?.status || res.data?.success || ignoreStatus) return res.data;
            else {
                const { code, message } = res.data;
                throw new Exception(code, message);
            }
        } catch (error) {
            throw new Exception(error.code ? error.code : error.response?.status, error.message);
        }
    };

export const fetcher = requester({ requestFunc: (url) => Request.ServerGreen3S.get(url), boundedTime: 200 });

// FILE REQUESTER
export const fileRequester =
    ({ requestFunc = (fileName) => CacheStorage.readAsync("API", md5(fileName)) } = {}) =>
    async (fileName) => {
        try {
            const res = await requestFunc(fileName);
            if (res.status || res.data?.status || res.data?.success) return res.data;
            else {
                const { code, message } = res;
                throw new Exception(code, message);
            }
        } catch (error) {
            throw new Exception(error.code, error.message);
        }
    };

// REQUEST SYNC BETWEEN API AND FILE (AS CACHE)
export const requestSyncCache =
    ({
        cache = false,
        expiredTime = 1,
        unit = "d",
        cacheFetcher = fileRequester({ requestFunc: (fileName) => CacheStorage.readAsync("API", md5(fileName)) }),
        requester = fetcher,
    } = {}) =>
    async (url) => {
        if (cache) {
            let data;
            try {
                data = await cacheFetcher(url);
                if (time().isBefore(data.expiredTime)) return data;
            } catch (e) {}

            try {
                const remoteData = await requester(url);
                CacheStorage.writeAsync("API", md5(url), {
                    ...remoteData,
                    expiredTime: time().add(expiredTime, unit).get(),
                });
                return remoteData;
            } catch (error) {
                if (data) return data;
                throw error;
            }
        } else {
            const data = await requester(url);
            return data;
        }
    };
