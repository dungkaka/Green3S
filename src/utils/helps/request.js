import Exception from "@utils/exceptions/Exception";
import { CacheStorage, DocumentStorage } from "@utils/local-file-sytem";
import { Request } from "./axios";
import { delay } from "@utils/helps/functions";
import { time } from "./time";
import md5 from "md5";

// API REQUESTER
// requester(config)(url)
export const requester =
    ({
        requestFunc = (url) => Request.Server.get(url),
        boundedTime = 0,
        ignoreStatus = false,
        handleData = (data) => data,
    } = {}) =>
    async (url) => {
        try {
            // console.log("URL", url);
            const beforeTime = Date.now();
            const res = await requestFunc(url);
            if (Date.now() - beforeTime < 500) await delay(boundedTime);
            if (res.data?.status || res.data?.success || ignoreStatus) return handleData(res.data);
            else {
                const { code, Message } = res.data;
                throw new Exception(code, Message);
            }
        } catch (error) {
            throw new Exception(error.code ? error.code : error.response?.status, error.message);
        }
    };

export const fetcher = requester({ requestFunc: (url) => Request.Server.get(url), boundedTime: 200 });

// FILE REQUESTER
export const fileRequester =
    ({ requestFunc = (fileName) => CacheStorage.readAsync("API", md5(fileName)), handleData = (data) => data } = {}) =>
    async (fileName) => {
        try {
            const res = await requestFunc(fileName);
            if (res.status || res.data?.status || res.data?.success) return handleData(res.data);
            else {
                const { code, message } = res;
                throw new Exception(code, message);
            }
        } catch (error) {
            throw new Exception(error.code, error.message);
        }
    };

// REQUEST SYNC BETWEEN API AND FILE
export const requestSyncFile =
    ({
        sync = false,
        expiredTime = 999,
        unit = "d",
        fileFetcher = (fileName) => DocumentStorage.readAsync("TEMP", fileName),
        fileWriter = (fileName, data) => DocumentStorage.writeAsync("TEMP", fileName, data),
        requester = fetcher,
        handleData,
    } = {}) =>
    async (url) => {
        if (sync) {
            let data;
            try {
                data = await fileRequester({ requestFunc: () => fileFetcher(md5(url)), handleData })();
                if (time().isBefore(data.expiredTime)) return data;
            } catch (e) {}

            try {
                const remoteData = await requester(url);
                fileWriter(md5(url), {
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

// REQUEST SYNC BETWEEN API AND FILE CACHE
export const requestSyncCache = ({ cache = true, expiredTime = 1, unit = "d", requester = fetcher, handleData } = {}) =>
    requestSyncFile({
        sync: cache,
        expiredTime: expiredTime,
        unit: unit,
        requester: requester,
        fileFetcher: (fileName) => CacheStorage.readAsync("API", fileName),
        fileWriter: (fileName, data) => CacheStorage.writeAsync("API", fileName, data),
        handleData,
    });

// REQUEST SYNC BETWEEN API AND FILE CACHE
// export const requestSyncCache =
//     ({ cache = false, expiredTime = 1, unit = "d", requester = fetcher } = {}) =>
//     async (url) => {
//         if (cache) {
//             let data;
//             try {
//                 data = await fileRequester({ requestFunc: () => CacheStorage.readAsync("API", md5(url)) })();
//                 if (time().isBefore(data.expiredTime)) return data;
//             } catch (e) {}

//             try {
//                 const remoteData = await requester(url);
//                 CacheStorage.writeAsync("API", md5(url), {
//                     ...remoteData,
//                     expiredTime: time().add(expiredTime, unit).get(),
//                 });
//                 return remoteData;
//             } catch (error) {
//                 if (data) return data;
//                 throw error;
//             }
//         } else {
//             const data = await requester(url);
//             return data;
//         }
//     };
