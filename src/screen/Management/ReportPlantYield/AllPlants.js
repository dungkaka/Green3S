import { AppTextMedium } from "@common-ui/AppText";
import EchartsWebView from "@common-ui/EchartsWebView";
import TableStickBasicTemplate from "@common-ui/Table/TableStickBasicTemplate";
import { ColorDefault } from "@theme";
import { Color } from "@theme/colors";
import { rem, unit } from "@theme/styleContants";
import { GoogleSansFontType } from "@theme/typography";
import React, { Fragment, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import WebView from "react-native-webview";

const AllPlants = ({ rangeDate, plants, datas, plantTableOptions, filter }) => {
    const chartRef = useRef();
    const tableData = plants.map((plant, index) => datas[plant.stationCode]);

    const options = useRef({
        grid: {
            top: 270,
            bottom: 50,
            left: 45,
            right: 25,
        },
        dataZoom: {
            type: "inside",
        },
        xAxis: {
            type: "category",
            data: rangeDate,
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
        series: tableData.map((plant) => ({
            name: plant.name,
            data: rangeDate.map((date) => plant.detail_yield_per_day_by_date[date]?.yield_today || 0),
            type: "line",
            smooth: true,
            showSymbol: false,
        })),
        legend: {
            top: 10,
            left: 15,
            padding: [0, 15, 0, 0],
            icon: "circle",
            data: tableData.map((plant) => plant.name),
            itemHeight: 10,
            itemWidth: 20,
            formatter: "{name}   ",
        },
    }).current;

    return (
        <Fragment>
            <View style={styles.block}>
                <AppTextMedium style={styles.titleBlock}>Tổng quan sản lượng và lỗi</AppTextMedium>
                <TableStickBasicTemplate
                    heightRow={62}
                    left={[0, 1]}
                    stickPosition={3 * rem}
                    options={plantTableOptions}
                    data={tableData}
                    headerContainerStyle={styles.tableHeaderContainer}
                    textHeaderStyle={styles.tableTextHeader}
                />
            </View>
            <View
                style={{
                    width: "100%",
                    height: 600,
                    marginTop: 10 * unit,
                    backgroundColor: "white",
                    elevation: 0.5,
                    overflow: "hidden",
                }}
            >
                <AppTextMedium style={styles.titleBlock}>Biểu đồ sản lượng từng ngày mỗi nhà máy</AppTextMedium>
                <EchartsWebView ref={chartRef} option={options} delayRender={100} />
            </View>
        </Fragment>
    );
};

export default AllPlants;

const styles = StyleSheet.create({
    tableHeaderContainer: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: Color.gray_2,
    },

    tableTextHeader: {
        color: Color.gray_11,
    },
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
});
