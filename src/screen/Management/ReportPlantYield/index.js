import { AppText } from "@common-ui/AppText";
import { rem, unit } from "@theme/styleContants";
import React, { useMemo, useRef, useState } from "react";
import { StyleSheet, ScrollView, View, LayoutAnimation, Pressable } from "react-native";
import { Color } from "@theme/colors";
import { time } from "@utils/helps/time";
import { round2 } from "@utils/helps/functions";
import { JumpLogo, JumpLogoPage } from "@common-ui/Loading/JumpLogo";
import { useOnlyDidUpdateLayoutEffect } from "@hooks/useOnlyDidUpdateLayoutEffetct";
import Filter from "./Filter";
import { useReportPlantYield } from "@services/report";
import AllPlants from "./AllPlants";
import APlant from "./APlant";
import ErrorPage from "@common-components/ErrorPage";

const options = [
    {
        key: "order",
        title: "STT",
        width: 3 * rem,
        render: ({ item, index, cellStyle }) => (
            <View key={0} style={cellStyle}>
                <AppText style={styles.contentCell}>{index + 1}</AppText>
            </View>
        ),
    },
    {
        key: "name",
        title: "Nhà máy",
        width: 7 * rem,
        render: ({ item, index, cellStyle }) => (
            <View key={1} style={cellStyle}>
                <AppText numberOfLines={3} style={styles.contentCell}>
                    {item.name}
                </AppText>
            </View>
        ),
    },
    {
        key: "capacity",
        title: "CS lắp đặt (KWP)",
        width: 6 * rem,
    },
    {
        key: "yield",
        title: "Sản lượng (KWH)",
        width: 8 * rem,
        render: ({ item, index, cellStyle }) => (
            <View key={3} style={cellStyle}>
                <AppText style={styles.contentCell}>{round2(item.yield)}</AppText>
            </View>
        ),
    },
    {
        key: "yield_meter",
        title: "Sản lượng công tơ (MWH)",
        width: 12 * rem,
        render: ({ item, index, cellStyle }) => (
            <View key={4} style={cellStyle}>
                <AppText style={styles.contentCell}>{item.yield_meter}</AppText>
                <AppText numberOfLines={2} style={{ fontSize: 13 * unit, color: Color.gray_8, textAlign: "center" }}>
                    {item.note_yield_meter}
                </AppText>
            </View>
        ),
    },
    { key: "yield_reactive", title: "Sản lượng vô công", width: 7 * rem },
    {
        key: "difference",
        title: "Chênh lệch (MWH)",
        width: 8 * rem,
        render: ({ item, index, cellStyle }) => (
            <View key={6} style={cellStyle}>
                <AppText style={styles.contentCell}>{round2(item.difference)}</AppText>
            </View>
        ),
    },
    {
        key: "time_sunny",
        title: "Tỷ lệ chuyển đổi",
        width: 7 * rem,
        render: ({ item, index, cellStyle }) => (
            <View key={7} style={cellStyle}>
                <AppText style={styles.contentCell}>{round2(item.time_sunny)}</AppText>
            </View>
        ),
    },
    { key: "yield_max", title: "Sản lượng đỉnh (KWH)", width: 7 * rem },
    { key: "total_error", title: "Lỗi", width: 4 * rem },
    { key: "total_error_repaired", title: "Khắc phục", width: 4 * rem },
    { key: "total_error_inventory", title: "Tồn", width: 4 * rem },
    { key: "time_reduce_power", title: "Số giờ tiết giảm CS", width: 6 * rem },
    {
        key: "time_rain",
        title: "Số giờ mưa",
        width: 6 * rem,
        render: ({ item, index, cellStyle }) => (
            <View key={13} style={cellStyle}>
                <AppText style={styles.contentCell}>{round2(item.time_rain)}</AppText>
            </View>
        ),
    },
    {
        key: "time_error",
        title: "Số giờ lỗi",
        width: 6 * rem,
        render: ({ item, index, cellStyle }) => (
            <View key={14} style={cellStyle}>
                <AppText style={styles.contentCell}>{round2(item.total_error / 12)}</AppText>
            </View>
        ),
    },
];

const initEndDate = time().toDateObject();
const initStartDate = { ...time().toDateObject(), day: 1 };
const extractRangeDate = (startDate, endDate) => {
    const listDate = [];
    const dateMove = new Date(startDate);
    let strDate = startDate;

    while (strDate < endDate) {
        strDate = dateMove.toISOString().slice(0, 10);
        listDate.push(strDate);
        dateMove.setDate(dateMove.getDate() + 1);
    }

    return listDate;
};

const ReportPlantYield = () => {
    const plantsSearch = useRef([]);
    const [filter, setFilter] = useState({
        endDate: initEndDate,
        startDate: initStartDate,
        plant: { stationCode: "", stationName: "Tất cả" },
    });
    const { rData, rIsValidating, error, mutate } = useReportPlantYield({ ...filter });
    const plants = rData?.plants || [];
    const datas = rData?.datas || {};
    const devicesData = rData?.devices;

    const { startDate, endDate } = filter;

    const rangeDate = useMemo(
        () =>
            extractRangeDate(
                `${startDate.year}-${(startDate.month < 10 ? "0" : "") + startDate.month}-${
                    (startDate.day < 10 ? "0" : "") + startDate.day
                }`,
                `${endDate.year}-${(endDate.month < 10 ? "0" : "") + endDate.month}-${
                    (endDate.day < 10 ? "0" : "") + endDate.day
                }`
            ),
        [rData]
    );

    const handleFilter = (filter) => {
        setFilter(filter);
    };

    if (plantsSearch.current.length == 0 && plants.length > 0) {
        plantsSearch.current = plants;
    }

    return (
        <View style={styles.container}>
            <Filter filter={filter} handleFilter={handleFilter} plants={plantsSearch.current} />

            {rIsValidating ? (
                <JumpLogoPage />
            ) : error ? (
                <ErrorPage />
            ) : rData ? (
                <ScrollView style={styles.scrollContainer} removeClippedSubviews={true}>
                    {filter.plant.stationCode == "" ? (
                        <AllPlants
                            rangeDate={rangeDate}
                            plants={plants}
                            datas={datas}
                            filter={filter}
                            plantTableOptions={options}
                        />
                    ) : (
                        <APlant
                            rangeDate={rangeDate}
                            plants={plants}
                            datas={datas}
                            filter={filter}
                            plantTableOptions={options}
                            devicesData={devicesData}
                        />
                    )}
                </ScrollView>
            ) : null}
        </View>
    );
};

export default ReportPlantYield;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },

    contentCell: {
        fontSize: 13 * unit,
        textAlign: "center",
        color: Color.gray_11,
    },
    loading: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 2 * rem,
    },

    scrollContainer: {
        flexGrow: 1,
        backgroundColor: Color.backgroundAndroid,
    },

    tableHeaderContainer: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: Color.gray_2,
    },

    tableTextHeader: {
        color: Color.gray_11,
    },
});
