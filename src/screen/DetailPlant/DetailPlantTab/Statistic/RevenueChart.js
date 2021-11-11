import { AppText, AppTextMedium } from "@common-ui/AppText";
import EchartsWebView from "@common-ui/EchartsWebView";
import { ModalDatePicker } from "@common-ui/Calendar/DatePickerModal";
import { ColorDefault } from "@theme/";
import { Color } from "@theme/colors";
import { unit } from "@theme/styleContants";
import { GoogleSansFontType } from "@theme/typography";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import styles from "./styles.index";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { closeIconLoadingOverlay, openIconLoadingOverlay } from "@redux/actions/app";
import { useOnlyDidUpdateEffect } from "@hooks/useOnlyDidUpdateEffect";
import { useFetchDetailPlant, useFetchYieldByTime } from "@services/factory";
import { useRoute } from "@react-navigation/native";
import { time } from "@utils/helps/time";
import { hitSlop10 } from "@common-ui/Pressable/utils";

const initEndDate = time().toDateObject();

const RevenueChart = () => {
    const { params } = useRoute();
    const dispatch = useDispatch();
    const chartRef = useRef();
    const modalDatePickerRef = useRef();

    const { stationCode } = params ? params : {};
    const [mode, setMode] = useState("month");
    const [date, setDate] = useState(initEndDate);
    const { data, isValidating, error, mutate } = useFetchYieldByTime({
        stationCode,
        year: date.year,
        month: mode == "month" ? date.month : "",
    });

    const dataChart = data?.data_chart_yield || [];

    const reverseDataChart = mode == "year" ? dataChart.slice().reverse() : dataChart;

    const option = useMemo(
        () => ({
            grid: {
                top: 80,
                bottom: 50,
                left: 45,
                right: 25,
            },
            xAxis: {
                type: "category",
                data: reverseDataChart.map((data) => (mode == "year" ? data.date.slice(0, 7) : data.date)),
                axisLabel: {
                    color: Color.gray_6,
                    fontSize: 11,
                },
                axisLine: {
                    lineStyle: {
                        color: Color.gray_6,
                    },
                },
            },
            yAxis: {
                type: "value",
                name: "kWh",
                nameTextStyle: {
                    color: Color.gray_6,
                },
                axisLabel: {
                    color: Color.gray_6,
                    fontSize: 11,
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: Color.gray_5,
                    },
                },
            },
            series: [
                {
                    name: "Sản lượng",
                    data: reverseDataChart.map((data) => (mode == "year" ? data.yield_month : data.yield_today) || 0),
                    type: "bar",
                    itemStyle: {
                        color: ColorDefault.primary,
                    },
                },
            ],
            tooltip: {
                trigger: "axis",
                backgroundColor: "rgba(255,255,255,0.9)",
                borderWidth: 0,
                axisPointer: {
                    type: "shadow",
                },
            },
            legend: {
                top: 10,
                left: 10,
                icon: "circle",
                data: ["Sản lượng"],
                itemHeight: 10,
            },
        }),
        [data]
    );

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <AppTextMedium style={styles.title}>Sản lượng và doanh thu</AppTextMedium>
            </View>
            <View style={styles.modeContainer}>
                <AppText
                    onPress={() => setMode("month")}
                    style={[styles.modeItem, mode == "month" ? styles.modeSelection : undefined]}
                >
                    Tháng
                </AppText>
                <AppText
                    onPress={() => setMode("year")}
                    style={[styles.modeItem, mode == "year" ? styles.modeSelection : undefined]}
                >
                    Năm
                </AppText>
            </View>
            <View style={styles.dateContainer}>
                <Pressable
                    onPress={() => {
                        setDate(
                            time(
                                new Date(
                                    mode == "year" ? date.year - 1 : date.year,
                                    mode == "month" ? date.month - 2 : date.month - 1,
                                    date.day
                                )
                            ).toDateObject()
                        );
                    }}
                    style={styles.dateDirectItem}
                    hitSlop={hitSlop10}
                >
                    <AntDesign name="left" size={20} color={Color.gray_8} />
                </Pressable>
                <Pressable
                    onPress={() => {
                        modalDatePickerRef.current.open(date);
                    }}
                    style={styles.displayDate}
                >
                    <AntDesign name="calendar" size={17} color={Color.gray_8} />
                    <AppTextMedium style={styles.textDateDisplay}>
                        {mode == "day" && date.day + "/"}
                        {(mode == "day" || mode == "month") && date.month + "/"}
                        {date.year}
                    </AppTextMedium>
                </Pressable>
                <Pressable
                    onPress={() => {
                        setDate(
                            time(
                                new Date(
                                    mode == "year" ? date.year + 1 : date.year,
                                    mode == "month" ? date.month : date.month - 1,
                                    date.day
                                )
                            ).toDateObject()
                        );
                    }}
                    style={styles.dateDirectItem}
                    hitSlop={hitSlop10}
                >
                    <AntDesign name="right" size={20} color={Color.gray_8} />
                </Pressable>
            </View>

            <ModalDatePicker
                ref={modalDatePickerRef}
                delayRender={500}
                mode={mode}
                onOk={() => {
                    modalDatePickerRef.current.close();
                    setDate(modalDatePickerRef.current.getData().date);
                }}
            />

            <View style={styles.echartContainer}>
                <EchartsWebView ref={chartRef} option={option} delayRender={500} />
                {isValidating ? (
                    <View
                        style={{
                            ...StyleSheet.absoluteFill,
                            backgroundColor: "rgba(255,255,255,0.3)",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <ActivityIndicator size={42} color={Color.gray_6} animating={true} />
                    </View>
                ) : null}
            </View>
        </View>
    );
};

export default RevenueChart;
