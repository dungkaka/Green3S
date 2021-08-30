import HttpException from "@utils/exception/HttpException";
import { Request } from "@utils/helps/axios";

export const socialLogin = async (socialName, data) => {
    const res = await Request.ServerTruyen.post("http://192.168.1.104:5000/api/v1/login/social", {
        socialName: socialName,
        ...data,
    });

    if (res.data?.status) {
        return {
            accessTokenAPI: res.data.access_token,
            user: res.data.user,
        };
    } else {
        throw new HttpException(400, "Can not login with " + socialName);
    }
};
