import { AppText, AppTextMedium } from "@common-ui/AppText";
import TableStickBasicTemplate from "@common-ui/Table/TableStickBasicTemplate";
import TableStickColumn from "@common-ui/Table/TableStickColumn";
import { ModalDatePicker } from "@common-ui/Wheel/DatePicker";
import { ColorDefault } from "@theme/index";
import { Color } from "@theme/colors";
import { rem, unit } from "@theme/styleContants";
import { GoogleSansFontType } from "@theme/typography";
import React, { useEffect, useState, useMemo, useRef } from "react";
import { Pressable, StyleSheet, ScrollView, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { closeIconLoadingOverlay, openIconLoadingOverlay } from "@redux/actions/app";

const data = new Array(500).fill({
    order: "1",
    factory: "Binh Yen energy",
    device: "COM.3-4",
    error_name: "Error",
    string: "String",
    reason: "Something wrong",
    solution: "Solution here",
    resolve_status: "true",
    note: "",
    time_interact: "2021-09-25 07:00:00",
    time: "2021-09-25 07:00:00",
});

const options = [
    { key: "order", title: "TT", width: 3 * rem },
    { key: "factory", title: "Nhà máy", width: 8 * rem },
    { key: "device", title: "Thiết bị", width: 6 * rem },
    { key: "error_name", title: "Tên lỗi", width: 7 * rem },
    { key: "string", title: "String", width: 8 * rem },
    { key: "reason", title: "Nguyên nhân", width: 10 * rem },
    { key: "solution", title: "Giải pháp", width: 7 * rem },
    { key: "resolve_status", title: "Trạng thái sửa", width: 7 * rem },
    { key: "note", title: "Ghi chú", width: 7 * rem },
    { key: "time_interact", title: "Time tác động", width: 8 * rem },
    { key: "time", title: "Time", width: 8 * rem },
];

const left = [0];

const ReportAC = () => {
    const modalStartDatePickerRef = useRef();
    const modalEndDatePickerRef = useRef();
    const [startDate, setStartDate] = useState({ day: 1, month: 1, year: 2021 });
    const [endDate, setEndDate] = useState({ day: 1, month: 1, year: 2021 });
    const dispatch = useDispatch();

    return (
        <View style={styles.container}>
            <View>
                <ScrollView horizontal style={styles.dateSelectionContainer} showsHorizontalScrollIndicator={false}>
                    <View style={styles.dateContainer}>
                        <AppTextMedium>Từ :</AppTextMedium>
                        <Pressable
                            onPress={() => {
                                modalStartDatePickerRef.current.open(startDate);
                            }}
                            style={styles.displayDate}
                        >
                            <AntDesign name="calendar" size={18} color={Color.gray_8} />
                            <AppTextMedium style={styles.textDateDisplay}>
                                {startDate.day}/{startDate.month}/{startDate.year}
                            </AppTextMedium>
                        </Pressable>
                    </View>

                    <View style={styles.dateContainer}>
                        <AppTextMedium>Đến:</AppTextMedium>
                        <Pressable
                            onPress={() => {
                                modalEndDatePickerRef.current.open(endDate);
                            }}
                            style={styles.displayDate}
                        >
                            <AntDesign name="calendar" size={18} color={Color.gray_8} />
                            <AppTextMedium style={styles.textDateDisplay}>
                                {endDate.day}/{endDate.month}/{endDate.year}
                            </AppTextMedium>
                        </Pressable>
                    </View>
                    <View style={styles.dateContainer}>
                        <AppTextMedium> </AppTextMedium>
                        <Pressable
                            onPress={() => {
                                dispatch(openIconLoadingOverlay());
                                setTimeout(() => dispatch(closeIconLoadingOverlay), 1000);
                            }}
                            style={styles.search}
                        >
                            <AntDesign name="arrowright" size={20} color="white" />
                        </Pressable>
                    </View>
                </ScrollView>
            </View>

            <TableStickBasicTemplate
                options={options}
                data={data}
                left={left}
                stickPosition={0}
                headerContainer={styles.tableHeaderContainer}
                textHeaderStyle={styles.tableTextHeader}
            />

            <ModalDatePicker
                ref={modalStartDatePickerRef}
                initialDate={startDate}
                delayRender={300}
                onOk={(close) => {
                    close();
                    setStartDate(modalStartDatePickerRef.current.getData().date);
                }}
            />

            <ModalDatePicker
                ref={modalEndDatePickerRef}
                initialDate={endDate}
                delayRender={500}
                onOk={(close) => {
                    close();
                    setEndDate(modalEndDatePickerRef.current.getData().date);
                }}
            />
        </View>
    );
};

export default React.memo(ReportAC, () => true);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    dateSelectionContainer: {
        backgroundColor: "white",
        flexDirection: "row",
        paddingHorizontal: 8 * unit,
        paddingVertical: 6 * unit,
    },

    dateContainer: {
        paddingVertical: 4 * unit,
        paddingHorizontal: 8 * unit,
    },

    displayDate: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 6 * unit,
        paddingHorizontal: 12 * unit,
        marginTop: 4 * unit,
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

    search: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 6 * unit,
        paddingHorizontal: 16 * unit,
        marginTop: 4 * unit,
        backgroundColor: ColorDefault.primary,
        borderRadius: 6 * unit,
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
