import * as axios from "axios";

export const Request = {
    ServerTruyen: axios.create({
        headers: {
            "Content-Type": "application/json",
        },
    }),
};
