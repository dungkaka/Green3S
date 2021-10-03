const preUrl = "http://green3s.vn/api/v1";

export const API_GREEN3S = {
    SEARCH_FACTORY: (station_name = "", firm = "") => preUrl + `/home?station_name=${station_name}&firm=${firm}`,
    FETCH_REALTIME_DEVICES_FACTORY: (station_code) => preUrl + `/plant/${station_code}/data-device-real-time`,
    GET_DETAIL_PLANT: (station_code) => preUrl + `/plant/${station_code}/detail`,
};
