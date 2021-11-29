import { fetcher } from "@utils/helps/request";
import { ConfigService } from "./config";

export const preFetch = (mutate) => {
    mutate(ConfigService, fetcher(keyListPlants));
};
