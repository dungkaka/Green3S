import { fetcher } from "@utils/helps/request";
import { mutate } from "swr";
import { keyListPlants } from "./factory";

export const preFetch = () => {
    mutate(keyListPlants, fetcher(keyListPlants));
};
