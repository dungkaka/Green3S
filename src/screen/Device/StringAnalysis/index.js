import { AppText, AppTextMedium } from "@common-ui/AppText";
import { rem, unit } from "@theme/styleContants";
import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Color } from "@theme/colors";
import { numberWithCommas, round2 } from "@utils/helps/functions";
import { JumpLogoPage } from "@common-ui/Loading/JumpLogo";
import { usePlantReport, usePlantReportInverter } from "@services/factory";
import ErrorPage from "@common-components/ErrorPage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { time } from "@utils/helps/time";
import TableStickBasicTemplate from "@common-ui/Table/TableStickBasicTemplate";
import { useStringAnalysis } from "@services/device";
import { Entypo } from "@expo/vector-icons";
import Filter from "./Filter";

const StringAnalysis = () => {
    const { params } = useRoute();
    const { device } = params ? params : {};

    const [filter, setFilter] = useState({
        date: time().toDateObject(),
        deviceId: device.device_id,
    });

    const { rData, rIsValidating, error, mutate } = useStringAnalysis(filter);
    const {
        name_string: nameStrings = [],
        name_string_value: stringValue,
        limit_warning_performance: limitWarning,
        check_performance_huawei,
        check_performance_1pv_sma,
        check_performance_2pv_sma,
        arrayData,
        firm,
    } = rData || {};

    const options = useMemo(
        () => [
            {
                key: "order",
                title: "STT",
                width: 3 * rem,
            },
            {
                key: "time",
                title: "Thời gian",
                width: 5 * rem,
            },
            ...nameStrings.map((string, i) => {
                return {
                    key: string.key,
                    title: string.value,
                    width: 4 * rem,
                    renderHeader: ({ cellHeaderStyle }) => {
                        return (
                            <View style={cellHeaderStyle}>
                                <AppTextMedium style={[styles.contentCell, { color: Color.redDark }]}>
                                    {stringValue[string.key]}
                                </AppTextMedium>
                                <AppTextMedium style={styles.contentCell}>{string.value}</AppTextMedium>
                            </View>
                        );
                    },
                    render: ({ item, index, cellStyle }) => {
                        let value = item.string[string.key];
                        if (item.summary) {
                            return value > limitWarning ? (
                                <View style={[cellStyle, { backgroundColor: "#c94234" }]}>
                                    <AppTextMedium style={styles.contentCellErrorString}>{value}</AppTextMedium>
                                </View>
                            ) : (
                                <View style={cellStyle}>
                                    <AppTextMedium style={styles.contentCell}>{value}</AppTextMedium>
                                </View>
                            );
                        }

                        if (firm == "huawei" && stringValue[string.key] > 0 && value / item.max < check_performance_huawei) {
                            return (
                                <View style={[cellStyle, { backgroundColor: Color.orangeDark }]}>
                                    <AppText style={styles.contentCellErrorString}>{round2(value)}</AppText>
                                </View>
                            );
                        }

                        if (firm == "sma") {
                            if (stringValue[string.key] == 1 && value / item.max < check_performance_1pv_sma)
                                return (
                                    <View style={[cellStyle, { backgroundColor: Color.orangeDark }]}>
                                        <AppText style={styles.contentCellErrorString}>{round2(value)}</AppText>
                                    </View>
                                );
                            if (stringValue[string.key] == 2 && value / item.max < check_performance_2pv_sma)
                                return (
                                    <View style={[cellStyle, { backgroundColor: Color.orangeDark }]}>
                                        <AppText style={styles.contentCellErrorString}>{round2(value)}</AppText>
                                    </View>
                                );
                        }

                        return (
                            <View style={cellStyle}>
                                <AppText style={styles.contentCell}>{round2(value)}</AppText>
                            </View>
                        );
                    },
                };
            }),
            {
                key: "max",
                title: "MAX",
                width: 5 * rem,
            },
            {
                key: "min_2pv_max",
                title: "Tỉ lệ Min/Max 2PV",
                width: 8 * rem,
                render: ({ item, index, cellStyle }) => (
                    <View style={cellStyle}>
                        <AppText style={styles.contentCell}>{round2(item.min_2pv_max)}</AppText>
                    </View>
                ),
            },
            {
                key: "min_1pv_max",
                title: "Tỉ lệ Min/Max 1PV",
                width: 8 * rem,
                render: ({ item, index, cellStyle }) => (
                    <View style={cellStyle}>
                        <AppText style={styles.contentCell}>{round2(item.min_1pv_max)}</AppText>
                    </View>
                ),
            },
            {
                key: "min_2pv",
                title: "Min 2PV",
                width: 8 * rem,
            },
            {
                key: "min_1pv",
                title: "Min 1PV",
                width: 8 * rem,
            },
            {
                key: "average",
                title: "Trung bình",
                width: 8 * rem,
                render: ({ item, index, cellStyle }) => (
                    <View style={cellStyle}>
                        <AppText style={styles.contentCell}>{round2(item.average)}</AppText>
                    </View>
                ),
            },
            {
                key: "rain",
                title: "Mưa",
                width: 8 * rem,
                render: ({ item, index, cellStyle }) => (
                    <View style={cellStyle}>{item.rain && <Entypo name="check" size={18} color={Color.greenBlue} />}</View>
                ),
            },
            {
                key: "inverter_active",
                title: "Mất điện lưới",
                width: 8 * rem,
                render: ({ item, index, cellStyle }) => (
                    <View style={cellStyle}>
                        {item.inverter_active && <Entypo name="check" size={18} color={Color.redDark} />}
                    </View>
                ),
            },
            {
                key: "error_2pv",
                title: "Lỗi 2PV",
                width: 10 * rem,
                render: ({ item, index, cellStyle }) => {
                    if (!item.errorPv2s?.length) return <View style={cellStyle} />;
                    return (
                        <View style={[cellStyle, { backgroundColor: "#c94234" }]}>
                            {item.errorPv2s.map((string, index) => (
                                <AppTextMedium key={index} style={styles.contentCellErrorString}>
                                    Warning {string}
                                </AppTextMedium>
                            ))}
                        </View>
                    );
                },
            },
            {
                key: "error_1pv",
                title: "Lỗi 1PV",
                width: 10 * rem,
                render: ({ item, index, cellStyle }) => {
                    if (!item.errorPv1s?.length) return <View style={cellStyle} />;
                    return (
                        <View style={[cellStyle, { backgroundColor: "#c94234" }]}>
                            {item.errorPv1s.map((string, index) => (
                                <AppTextMedium key={index} style={styles.contentCellErrorString}>
                                    Warning {string}
                                </AppTextMedium>
                            ))}
                        </View>
                    );
                },
            },
        ],
        [rData]
    );

    const handleFilter = (filter) => {
        setFilter({
            date: filter.date,
            deviceId: device.device_id,
        });
    };

    return (
        <View style={styles.container}>
            <Filter filter={filter} handleFilter={handleFilter} />
            {rIsValidating ? (
                <View style={{ flex: 1, backgroundColor: "white" }}>
                    <JumpLogoPage />
                </View>
            ) : error ? (
                <ErrorPage />
            ) : rData ? (
                <TableStickBasicTemplate
                    heightRow={48}
                    left={[0, 1]}
                    stickPosition={3 * rem}
                    options={options}
                    data={arrayData}
                    headerContainerStyle={styles.tableHeaderContainer}
                    textHeaderStyle={styles.tableTextHeader}
                />
            ) : null}
        </View>
    );
};

export default StringAnalysis;

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
    contentCellErrorString: {
        fontSize: 13 * unit,
        textAlign: "center",
        color: "white",
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
