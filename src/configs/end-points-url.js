const preUrl = "http://green3s.vn/api/v1";

export const API_GREEN3S = {
    LIST_PLANTS: () => preUrl + `/plant/list`,
    SEARCH_FACTORY: (station_name = "", firm = "") => preUrl + `/home?station_name=${station_name}&firm=${firm}`,
    FETCH_REALTIME_DEVICES_FACTORY: (station_code) => preUrl + `/plant/${station_code}/data-device-real-time`,
    GET_DETAIL_PLANT: (station_code) => preUrl + `/plant/${station_code}/detail`,

    REPORT_PLANT_YIELD: (dateEnd = "", dateStart = "", stationCode = "") =>
        preUrl + `/plant/report?date_end=${dateEnd}&date_start=${dateStart}&stationCode=${stationCode}`,
    REPORT_PLANT_MATERIAL: (dateEnd = "", dateStart = "", stationCode = "") =>
        preUrl + `/plant/report/${stationCode}/material?date_start=${dateStart}&date_end=${dateEnd}`,
    REPORT_PLANT_LOG_REPAIR: (dateEnd = "", dateStart = "", stationCode = "") =>
        preUrl + `/plant/report/${stationCode}/log-repair?date_start=${dateStart}&date_end=${dateEnd}`,
    REPORT_PLANT_POTENTIAL_ERROR: (dateEnd = "", dateStart = "", stationCode = "") =>
        preUrl + `/plant/report/${stationCode}/potential-error?date_start=${dateStart}&date_end=${dateEnd}`,

    ERROR_AC: (dateStart = "", dateEnd = "", stationCode = "", status = "", error = "") =>
        preUrl +
        `/error/ac?date_start=${dateStart}&date_end=${dateEnd}&stationCode=${stationCode}&status=${status}&error=${error}`,
    ERROR_DC: (dateStart = "", dateEnd = "", stationCode = "", status = "") =>
        preUrl + `/error/dc?date_start=${dateStart}&date_end=${dateEnd}&stationCode=${stationCode}&status=${status}`,
    PERFOMANCE: (dateStart = "", dateEnd = "", stationCode = "", status = "") =>
        preUrl + `/error/performance?date_start=${dateStart}&date_end=${dateEnd}&stationCode=${stationCode}&status=${status}`,
    POTENTIAL_ERROR: (month = "", year = "", stationCode = "", name = "") =>
        preUrl + `/error/potential?month=${month}&year=${year}&stationCode=${stationCode}&name=${name}`,
};
