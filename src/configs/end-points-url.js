const preUrl = "https://green3s.vn/api/v1";

export const API_GREEN3S = {
    //Login:
    LOGIN: () => preUrl + `/login`,

    // Home/DashBoard
    LIST_PLANTS: () => preUrl + `/plant/list`,
    SEARCH_FACTORY: (station_name = "", firm = "") => preUrl + `/home?station_name=${station_name}&firm=${firm}`,
    FETCH_REALTIME_DEVICES_FACTORY: (station_code) => preUrl + `/plant/${station_code}/data-device-real-time`,

    // Detail Plant
    GET_DETAIL_PLANT: (station_code) => preUrl + `/plant/${station_code}/detail`,
    FETCH_YIELD_BY_TIME: (stationCode = "", year = "", month = "") =>
        preUrl + `/plant/${stationCode}/get-yield-by-time?year=${year}&month=${month}`,
    FETCH_POWER_BY_TIME: (stationCode = "", date = "") => preUrl + `/plant/${stationCode}/get-power-by-time?date=${date}`,
    PLANT_REPORT: (stationCode = "", month = "", year = "") =>
        preUrl + `/plant/${stationCode}/report?month=${month}&year=${year}`,
    PLANT_REPORT_INVERTER: (stationCode = "", month = "", year = "", filter = "month") =>
        preUrl + `/plant/${stationCode}/report-device?month=${month}&year=${year}&filter=${filter}`,
    PLANT_MATERIAL: (stationCode = "") => preUrl + `/plant/${stationCode}/material`,

    // Report
    REPORT_PLANT_YIELD: (dateEnd = "", dateStart = "", stationCode = "") =>
        preUrl + `/plant/report?date_end=${dateEnd}&date_start=${dateStart}&stationCode=${stationCode}`,
    REPORT_PLANT_MATERIAL: (dateEnd = "", dateStart = "", stationCode = "") =>
        preUrl + `/plant/report/${stationCode}/material?date_start=${dateStart}&date_end=${dateEnd}`,
    REPORT_PLANT_LOG_REPAIR: (dateEnd = "", dateStart = "", stationCode = "") =>
        preUrl + `/plant/report/${stationCode}/log-repair?date_start=${dateStart}&date_end=${dateEnd}`,
    REPORT_PLANT_POTENTIAL_ERROR: (dateEnd = "", dateStart = "", stationCode = "") =>
        preUrl + `/plant/report/${stationCode}/potential-error?date_start=${dateStart}&date_end=${dateEnd}`,
    REPORT_MAINTAINANCE: (stationCode = "", month = "", year = "") =>
        preUrl + `/plant/report/maintance?stationCode=${stationCode}&month=${month}&year=${year}`,
    REPORT_PLAN_MAINTAINANCE: (stationCode = "", month = "", year = "") =>
        preUrl + `/plant/report/plan-maintance?stationCode=${stationCode}&month=${month}&year=${year}`,

    // Error
    ALL_ERROR: (
        dateStart = "",
        dateEnd = "",
        stationCode = "",
        device_id = "",
        status = "",
        error = "",
        string = "",
        page = 1,
        pageSize = 20
    ) =>
        preUrl +
        `/error/all?error=${error}&date_start=${dateStart}&date_end=${dateEnd}&stationCode=${stationCode}&device_id=${device_id}&status=${status}&string=${string}&per_page=${pageSize}&page=${page}`,
    ERROR_AC: (dateStart = "", dateEnd = "", stationCode = "", status = "", error = "", page = 1, pageSize = 20) =>
        preUrl +
        `/error/ac?date_start=${dateStart}&date_end=${dateEnd}&stationCode=${stationCode}&status=${status}&error=${error}&per_page=${pageSize}&page=${page}`,
    ERROR_DC: (dateStart = "", dateEnd = "", stationCode = "", status = "", page = 1, pageSize = 20) =>
        preUrl +
        `/error/dc?date_start=${dateStart}&date_end=${dateEnd}&stationCode=${stationCode}&status=${status}&per_page=${pageSize}&page=${page}`,
    PERFOMANCE: (dateStart = "", dateEnd = "", stationCode = "", status = "", page = 1, pageSize = 20) =>
        preUrl +
        `/error/performance?date_start=${dateStart}&date_end=${dateEnd}&stationCode=${stationCode}&status=${status}&per_page=${pageSize}&page=${page}`,
    POTENTIAL_ERROR: (month = "", year = "", stationCode = "", name = "") =>
        preUrl + `/error/potential?month=${month}&year=${year}&stationCode=${stationCode}&name=${name}`,
    ERROR_RESISTOR: (dateStart = "", dateEnd = "", stationCode = "", status = "", page = 1, pageSize = 20) =>
        preUrl +
        `/error/resistor?date_start=${dateStart}&date_end=${dateEnd}&stationCode=${stationCode}&status=${status}&per_page=${pageSize}&page=${page}`,
    ERROR_DISCONNECT: (stationCode) => preUrl + `/error/disconnect?stationCode=${stationCode}`,

    // ErrorOverview
    ERROR_PREVIEW_ALL: () => preUrl + `/error/home`,

    // Alarm
    ALARM: (dateStart = "", dateEnd = "", stationCode = "", page = 1, pageSize = 20) =>
        preUrl +
        `/alarm?date_start=${dateStart}&date_end=${dateEnd}&stationCode=${stationCode}&per_page=${pageSize}&page=${page}`,

    // Material
    MATERIAL: (name = "") => preUrl + `/material?name=${name}`,

    // Maintainance
    MAINTAINANCE_LIST_WORK: (stationCode = "", month = "", year = "", nameWork = "", page = 1, pageSize = 20) =>
        preUrl +
        `/maintance/list-work?stationCode=${stationCode}&per_page=${pageSize}&page=${page}&month=${month}&year=${year}&name_work=${nameWork}`,
    MAINTAINANCE_CATEGORY: () => preUrl + `/maintance/category`,

    // Device
    FETCH_LIST_DEVICE: (stationCode) => preUrl + `/plant/${stationCode}/device`,
    DEVICE_OVERVIEW: (deviceId, date, time) => preUrl + `/device/${deviceId}/overview?time=${time}&date=${date}`,
    DEVICE_ERROR: (deviceId, date) => preUrl + `/device/${deviceId}/error?date=${date}`,
    FETCH_DEVICE_POWER: (deviceId, date) => preUrl + `/device/${deviceId}/chart-power?date=${date}`,
};
