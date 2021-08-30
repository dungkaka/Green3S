import { CacheStorage } from "../local-file-sytem";
import NetInfo from "@react-native-community/netinfo";
import moment from "moment";

export const fetchAPI = async ({ fetchFunc = () => {}, cache = false, cacheFileName = "", expiredDate = 2, unit = "d" }) => {
  // check Cache
  if (cache) {
    const resCache = await CacheStorage.readAsync("API", cacheFileName);

    // If exist return cached File
    if (resCache.status == true) {
      const stateNetwork = await NetInfo.fetch();
      if (!stateNetwork.isConnected || moment().isBefore(resCache.data.expiredDate)) return resCache.data;
    }
  }

  // If cache not exist, call API, then write Cache, return
  const res = await fetchFunc();
  if (res.data?.status == true) {
    if (cache) CacheStorage.writeAsync("API", cacheFileName, { ...res.data, expiredDate: moment().add(expiredDate, unit) });
    return res.data;
  } else {
    throw new Error("Something at server !");
  }
};
