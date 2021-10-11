import { AppText, AppTextMedium } from "@common-ui/AppText";
import TableStickBasicTemplate from "@common-ui/Table/TableStickBasicTemplate";
import TableStickColumn from "@common-ui/Table/TableStickColumn";
import { ModalDatePicker } from "@common-ui/Calendar/DatePicker";
import { ColorDefault } from "@theme/index";
import { Color } from "@theme/colors";
import { rem, unit } from "@theme/styleContants";
import { GoogleSansFontType } from "@theme/typography";
import React, { useEffect, useState, useMemo, useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { closeIconLoadingOverlay, openIconLoadingOverlay } from "@redux/actions/app";
import { useRoute } from "@react-navigation/core";

const data = new Array(500).fill({
    order: "1",
    time: "2021-09-25 07:00:00",
    product1: "123.4",
    product2: "234.5",
    timeSun: 7,
    highestProduct: 123.232,
    money: "01,3453",
});

const options = [
    { key: "order", title: "TT", width: 3 * rem },
    { key: "time", title: "Thời gian", width: 8 * rem },
    { key: "product1", title: "Sản lượng PV(KWH)", width: 6 * rem },
    { key: "product2", title: "Sản lượng nạp (KWH)", width: 7 * rem },
    { key: "timeSun", title: "Số giờ nắng", width: 5 * rem },
    { key: "highestProduct", title: "Sản lượng đỉnh", width: 6 * rem },
    { key: "money", title: "Doanh thu", width: 7 * rem },
];

const left = [0, 1];

const ReportFactory = ({}) => {
    const { params } = useRoute();
    const { stationCode } = params ? params : {};

    console.log("PARAMS", stationCode);

    const modalDatePickerRef = useRef();
    const [mode, setMode] = useState("day");
    const [date, setDate] = useState({ day: 1, month: 1, year: 2021 });
    const dispatch = useDispatch();

    return (
        <View style={styles.container}>
            <View style={styles.dateSelectionContainer}>
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
                    <Pressable
                        onPress={() => {
                            modalDatePickerRef.current.open(date);
                        }}
                        style={styles.displayDate}
                    >
                        <AntDesign name="calendar" size={18} color={Color.gray_8} />
                        <AppTextMedium style={styles.textDateDisplay}>
                            {mode == "day" && date.day + "/"}
                            {(mode == "day" || mode == "month") && date.month + "/"}
                            {date.year}
                        </AppTextMedium>
                    </Pressable>
                </View>
            </View>

            <TableStickBasicTemplate
                options={options}
                data={data}
                left={left}
                stickPosition={options[0].width}
                headerContainer={styles.tableHeaderContainer}
                textHeaderStyle={styles.tableTextHeader}
            />

            <ModalDatePicker
                ref={modalDatePickerRef}
                initialDate={date}
                delayRender={300}
                mode={mode}
                onOk={(close) => {
                    close();
                    setDate(modalDatePickerRef.current.getData().date);
                    dispatch(openIconLoadingOverlay());
                    setTimeout(() => dispatch(closeIconLoadingOverlay), 1000);
                }}
            />
        </View>
    );
};

export default React.memo(ReportFactory, () => true);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    dateSelectionContainer: {
        backgroundColor: "white",
        flexDirection: "row",
        paddingHorizontal: 12 * unit,
        paddingVertical: 6 * unit,
    },

    modeContainer: {
        paddingVertical: 8 * unit,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    modeItem: {
        padding: 6 * unit,
        width: 5 * rem,
        textAlign: "center",
        color: Color.gray_10,
        fontSize: 15 * unit,
    },
    modeSelection: {
        borderRadius: 24 * unit,
        backgroundColor: Color.gray_2,
        fontFamily: GoogleSansFontType.bold,
    },
    dateContainer: {
        flex: 1,
        paddingVertical: 4 * unit,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },

    displayDate: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 6 * unit,
        paddingHorizontal: 12 * unit,
        backgroundColor: Color.gray_0,
        borderRadius: 6 * unit,
        borderWidth: 1,
        borderColor: Color.gray_3,
    },

    textDateDisplay: {
        fontSize: 15 * unit,
        color: Color.gray_8,
        paddingHorizontal: 12 * unit,
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
