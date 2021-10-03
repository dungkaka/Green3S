import * as axios from "axios";

export const Request = {
    ServerGreen3S: axios.create({
        headers: {
            "Content-Type": "application/json",
        },
    }),
};
