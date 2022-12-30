import { AppText, AppTextMedium } from "@common-ui/AppText";
import EchartsWebView from "@common-ui/EchartsWebView";
import TableStickBasicTemplate from "@common-ui/Table/TableStickBasicTemplate";
import { NavigationContainer } from "@react-navigation/native";
import { ColorDefault } from "@theme";
import { Color } from "@theme/colors";
import { rem, unit } from "@theme/styleContants";
import { round2 } from "@utils/helps/functions";
import { NAVIGATION } from "constant/navigation";
import React, { Fragment, useRef } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

const tableDeviceOptions = [
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
        key: "devName",
        title: "Tên thiết bị",
        width: 8 * rem,
    },
    {
        key: "inverter_power",
        title: "CS lắp đặt (KWP)",
        width: 6 * rem,
    },
    {
        key: "total_yield",
        title: "Sản lượng (KWH)",
        width: 7 * rem,
    },
    {
        key: "timeSun",
        title: "Số giờ nắng",
        width: 7 * rem,
    },
];

const APlant = ({ rangeDate, plants, datas, devicesData = [], plantTableOptions, filter }) => {
    const chartRef = useRef();
    const tableData = [datas[filter.plant.stationCode]];
    const detail_yield_per_day_by_date = tableData[0].detail_yield_per_day_by_date;
    const navigation = useNavigation();

    devicesData.map((device) => {
        device.total_yield = round2(device.device_yields?.reduce((preV, currentV) => preV + currentV.value, 0));
        device.timeSun = round2(device.total_yield / device.inverter_power);
    });

    const optionChartPlantData = useRef({
        grid: {
            top: 80,
            bottom: 50,
            left: 45,
            right: 25,
        },
        xAxis: {
            type: "category",
            data: rangeDate,
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
                name: tableData[0].name,
                data: rangeDate.map((date) => detail_yield_per_day_by_date[date]?.yield_today || 0),
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
            data: [tableData[0].name],
            itemHeight: 10,
        },
    }).current;

    const optionChartYieldDevices = useRef({
        grid: {
            top: 80,
            bottom: 50,
            left: 45,
            right: 25,
        },
        xAxis: {
            type: "category",
            data: devicesData.map((i) => i.devName),
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
            name: "KWH",
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
                data: devicesData.map((i) => i.total_yield),
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
    }).current;

    const optionChartTimeSunDevices = useRef({
        grid: {
            top: 80,
            bottom: 50,
            left: 45,
            right: 25,
        },
        xAxis: {
            type: "category",
            data: devicesData.map((i) => i.devName),
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
            name: "Giờ",
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
                name: "Số giờ nắng",
                data: devicesData.map((i) => i.timeSun),
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
            data: ["Số giờ nắng"],
            itemHeight: 10,
        },
    }).current;

    const optionChartYieldDevicesPerDay = useRef({
        grid: {
            top: 120,
            bottom: 50,
            left: 45,
            right: 25,
        },
        xAxis: {
            type: "category",
            data: rangeDate,
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
            name: "KWH",
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
        series: devicesData.map((device) => ({
            name: device.devName,
            data: rangeDate.map((date) => device.device_yields_by_dates[date]?.value || 0),
            type: "line",
            smooth: true,
            showSymbol: false,
        })),
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
            left: 15,
            padding: [0, 15, 0, 0],
            icon: "circle",
            data: devicesData.map((plant) => plant.devName),
            itemHeight: 10,
            itemWidth: 20,
            formatter: "{name}   ",
        },
    }).current;

    return (
        <Fragment>
            <View style={styles.block}>
                <ScrollView horizontal contentContainerStyle={{ padding: 8 * unit }}>
                    <Pressable
                        onPress={() =>
                            navigation.navigate(NAVIGATION.REPORT_PLANT_MATERIAL, {
                                filter: filter,
                            })
                        }
                        style={styles.directionReportButton}
                    >
                        <AppTextMedium>Vật tư</AppTextMedium>
                    </Pressable>

                    <Pressable
                        onPress={() =>
                            navigation.navigate(NAVIGATION.REPORT_PLANT_LOG_REPAIR, {
                                filter: filter,
                            })
                        }
                        style={styles.directionReportButton}
                    >
                        <AppTextMedium>Nhật kí sửa chữa</AppTextMedium>
                    </Pressable>

                    <Pressable
                        onPress={() =>
                            navigation.navigate(NAVIGATION.REPORT_PLANT_POTENTIAL_ERROR, {
                                filter: filter,
                            })
                        }
                        style={styles.directionReportButton}
                    >
                        <AppTextMedium>Lỗi tiềm ẩn</AppTextMedium>
                    </Pressable>
                </ScrollView>
            </View>
            <View style={styles.block}>
                <AppTextMedium style={styles.titleBlock}>Tổng quan sản lượng và lỗi</AppTextMedium>
                <TableStickBasicTemplate
                    heightRow={68}
                    left={[0, 1]}
                    stickPosition={3 * rem}
                    options={plantTableOptions}
                    data={tableData}
                    // keyItem="name"
                    headerContainerStyle={styles.tableHeaderContainer}
                    textHeaderStyle={styles.tableTextHeader}
                />
            </View>

            <View style={styles.blockChart}>
                <AppTextMedium style={styles.titleBlock}>Biểu đồ sản lượng từng ngày</AppTextMedium>
                <EchartsWebView ref={chartRef} option={optionChartPlantData} delayRender={200} />
            </View>

            <View style={styles.block}>
                <AppTextMedium style={styles.titleBlock}>Sản lượng Inverter</AppTextMedium>
                <TableStickBasicTemplate
                    heightRow={48}
                    left={[0, 1]}
                    stickPosition={3 * rem}
                    options={tableDeviceOptions}
                    data={devicesData}
                    // keyItem="name"
                    headerContainerStyle={styles.tableHeaderContainer}
                    textHeaderStyle={styles.tableTextHeader}
                />
            </View>
            <View style={styles.blockChart}>
                <AppTextMedium style={styles.titleBlock}>Biểu đồ sản lượng Inverter</AppTextMedium>
                <EchartsWebView ref={chartRef} option={optionChartYieldDevices} delayRender={500} />
            </View>

            <View style={styles.blockChart}>
                <AppTextMedium style={styles.titleBlock}>Biểu đồ số giờ nắng Inverter</AppTextMedium>
                <EchartsWebView ref={chartRef} option={optionChartTimeSunDevices} delayRender={500} />
            </View>

            <View style={[styles.blockChart, { height: 400 }]}>
                <AppTextMedium style={styles.titleBlock}>Biểu đồ sản lượng từng ngày mỗi Inverter</AppTextMedium>
                <EchartsWebView ref={chartRef} option={optionChartYieldDevicesPerDay} delayRender={800} />
            </View>
        </Fragment>
    );
};

export default APlant;

const styles = StyleSheet.create({
    block: {
        marginTop: 10 * unit,
        backgroundColor: "white",
        elevation: 0.5,
    },

    titleBlock: {
        fontSize: 15 * unit,
        paddingHorizontal: 16 * unit,
        paddingVertical: rem,
        color: Color.gray_11,
    },

    blockChart: {
        width: "100%",
        height: 350,
        marginTop: 10 * unit,
        backgroundColor: "white",
        elevation: 0.5,
        overflow: "hidden",
    },

    tableHeaderContainer: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: Color.gray_2,
    },

    tableTextHeader: {
        color: Color.gray_11,
    },
    contentCell: {
        fontSize: 13 * unit,
        textAlign: "center",
        color: Color.gray_11,
    },
    directionReportButton: {
        margin: 8 * unit,
        padding: rem,
        backgroundColor: Color.gray_2,
        borderRadius: 4 * unit,
    },
});
