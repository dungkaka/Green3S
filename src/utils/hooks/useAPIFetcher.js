import HttpException from "@utils/exception/HttpException";
import { Request } from "@utils/function/axios";
import { delay } from "@utils/function/helps";

export const requester =
    (requestFunc = (url) => Request.ServerTruyen.get(url)) =>
    async (url, { boundedTime = 200 } = {}) => {
        console.log("FETCH", url);
        try {
            const beforeTime = Date.now();
            const res = await requestFunc(url);
            const afterTime = Date.now();
            if (afterTime - beforeTime < 1000) await delay(boundedTime);
            if (res.data?.status) return res.data;
            else {
                const { code, message } = res.data;
                throw new HttpException(code, message);
            }
        } catch (error) {
            throw new HttpException(error.code ? error.code : error.response?.status, error.message);
        }
    };

export const fetcher = requester((url) => Request.ServerTruyen.get(url));
