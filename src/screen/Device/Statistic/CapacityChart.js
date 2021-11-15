import { AppText, AppTextMedium } from "@common-ui/AppText";
import EchartsWebView from "@common-ui/EchartsWebView";
import { ModalDatePicker } from "@common-ui/Calendar/DatePickerModal";
import { ColorDefault } from "@theme/";
import { Color } from "@theme/colors";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import styles from "./styles.index";
import { AntDesign } from "@expo/vector-icons";
import { time } from "@utils/helps/time";
import { useFetchDetailPlant, useFetchPowerByTime } from "@services/factory";
import { useRoute } from "@react-navigation/native";
import { round2 } from "@utils/helps/functions";
import { hitSlop10 } from "@common-ui/Pressable/utils";
import { useFetchDevicePower } from "@services/device";

const initDate = time().toDateObject();

const CapacityChart = () => {
    const { params } = useRoute();
    const chartRef = useRef();

    const { device } = params ? params : {};
    const modalDatePickerRef = useRef();
    const [date, setDate] = useState(initDate);
    const { rData, rIsValidating, error, mutate } = useFetchDevicePower({
        deviceId: device.device_id,
        date: date,
    });

    const dataChart = rData?.datas || [];

    const option = useMemo(
        () => ({
            grid: {
                top: 80,
                bottom: 50,
                left: 35,
                right: 20,
            },
            dataZoom: {
                type: "inside",
            },
            xAxis: {
                type: "category",
                data: dataChart.map((data) => data.time.slice(0, 5)),
                boundaryGap: false,
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
                    name: "Công suất",
                    data: dataChart.map((data) => round2(data.power) || 0),
                    type: "line",
                    smooth: true,
                    showSymbol: false,
                    itemStyle: {
                        color: ColorDefault.primary,
                    },
                    // areaStyle: `{
                    //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    //         {
                    //             offset: 0,
                    //             color: "rgb(255, 158, 68)",
                    //         },
                    //         {
                    //             offset: 1,
                    //             color: "rgb(255, 70, 131)",
                    //         },
                    //     ]),
                    // }`,
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
        }),
        [rData]
    );

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <AppTextMedium style={styles.title}>Biểu đồ công suất thực</AppTextMedium>
            </View>
            <View style={styles.dateContainer}>
                <Pressable
                    onPress={() => {
                        setDate(time(new Date(date.year, date.month - 1, date.day - 1)).toDateObject());
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
                        {date.day}/{date.month}/{date.year}
                    </AppTextMedium>
                </Pressable>
                <Pressable
                    onPress={() => {
                        setDate(time(new Date(date.year, date.month - 1, date.day + 1)).toDateObject());
                    }}
                    style={styles.dateDirectItem}
                    hitSlop={hitSlop10}
                >
                    <AntDesign name="right" size={20} color={Color.gray_8} />
                </Pressable>
            </View>

            <ModalDatePicker
                ref={modalDatePickerRef}
                delayRender={300}
                initialDate={date}
                onOk={(close) => {
                    close();
                    setDate(modalDatePickerRef.current.getData().date);
                }}
            />

            <View style={styles.echartContainer}>
                <EchartsWebView ref={chartRef} option={option} delayRender={300} />
                {rIsValidating ? (
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

export default CapacityChart;
