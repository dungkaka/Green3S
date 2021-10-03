import { AppText, AppTextMedium } from "@common-ui/AppText";
import EchartsWebView from "@common-ui/EchartsWebView";
import { ModalDatePicker } from "@common-ui/Wheel/DatePicker";
import { ColorDefault } from "@theme/";
import { Color } from "@theme/colors";
import { unit } from "@theme/styleContants";
import { GoogleSansFontType } from "@theme/typography";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import styles from "./styles.index";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { closeIconLoadingOverlay, openIconLoadingOverlay } from "@redux/actions/app";
import { useOnlyDidUpdateEffect } from "@hooks/useOnlyDidUpdateEffect";

const RevenueChart = () => {
    const chartRef = useRef();
    const modalDatePickerRef = useRef();
    const [mode, setMode] = useState("day");
    const [date, setDate] = useState({ day: 1, month: 1, year: 2021 });
    const dispatch = useDispatch();

    useOnlyDidUpdateEffect(() => {
        dispatch(openIconLoadingOverlay());
        setTimeout(() => dispatch(closeIconLoadingOverlay), 1000);
    }, [date]);

    const option = useRef({
        grid: {
            top: 80,
            bottom: 50,
            left: 45,
            right: 25,
        },
        xAxis: {
            type: "category",
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            axisLabel: {
                color: Color.gray_6,
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
                name: "Công suất",
                data: [120, 200, 150, 80, 70, 110, 130],
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
            data: ["Công suất"],
            itemHeight: 10,
        },
    }).current;

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <AppTextMedium style={styles.title}>Sản lượng và doanh thu</AppTextMedium>
            </View>
            <View style={styles.modeContainer}>
                <AppText
                    onPress={() => setMode("day")}
                    style={[styles.modeItem, mode == "day" ? styles.modeSelection : undefined]}
                >
                    Ngày
                </AppText>
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
                <Pressable>
                    <AppTextMedium style={styles.dateDirectItem}>{`<    `}</AppTextMedium>
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
                <Pressable>
                    <AppTextMedium style={styles.dateDirectItem}>{`    >`}</AppTextMedium>
                </Pressable>
            </View>

            <ModalDatePicker
                ref={modalDatePickerRef}
                delayRender={500}
                mode={mode}
                onOk={(close) => {
                    close();
                    setDate(modalDatePickerRef.current.getData().date);
                }}
            />

            <View style={styles.echartContainer}>
                <EchartsWebView ref={chartRef} option={option} delayRender={500} />
            </View>
        </View>
    );
};

export default RevenueChart;
