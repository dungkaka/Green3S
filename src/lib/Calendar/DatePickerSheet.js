import { AppText, AppTextBold, AppTextMedium } from "@common-ui/AppText";
import { Color } from "@theme/colors";
import { HEIGHT, WIDTH } from "@theme/scale";
import { rem, unit } from "@theme/styleContants";
import { GoogleSansFontType } from "@theme/typography";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import DatePicker from "./DatePicker";
import BottomSheet from "@common-ui/Modal/BottomSheet";
import { MODE, validateDate } from "./utils";

const _DatePickerSheet = forwardRef(({ onOk, mode = "day", initialDate, delayRender = 200, dateData }, ref) => {
    const modalRef = useRef();
    const [date, setDate] = useState(delayRender > 0 ? undefined : initialDate);

    useEffect(() => {
        if (!date)
            setTimeout(() => {
                requestAnimationFrame(() => {
                    setDate(initialDate);
                });
            }, delayRender);
    }, []);

    useImperativeHandle(ref, () => ({
        open: (date) => {
            if (date) setDate(date);
            modalRef.current?.open();
        },
        close: () => {
            modalRef.current.close();
        },
        getData: () => ({ date: date, isValid: isValidDate }),
    }));

    if (!date) return null;

    const isValidDate = validateDate(mode, date.year, date.month, date.day);

    const renderTitle = () => {
        switch (mode) {
            case "hour":
            case "minute":
                return "Thời gian";
            case "day":
                return "Chọn ngày";
            case "month":
                return "Chọn tháng";
            case "year":
                return "Chọn năm";
            default:
                return "Chọn ngày";
        }
    };

    return (
        <BottomSheet
            ref={modalRef}
            onBackHandler={() => modalRef.current.close()}
            bottomSheetStyle={styles.modalStyle}
            lazyLoad={false}
            unmountOnHide={false}
        >
            <View style={styles.modalContainer}>
                <View style={styles.headerModal}>
                    <AppTextBold style={styles.leftTitleHeader}>{renderTitle()}</AppTextBold>

                    <View style={styles.rightTitleContainerHeader}>
                        {isValidDate ? null : <FontAwesome name="exclamation" size={20} color={Color.redPastel} />}

                        <View style={styles.rightTitleHeader}>
                            <AntDesign name="calendar" size={18} color={Color.gray_8} />

                            <AppTextMedium style={styles.rightTitleText}>
                                {MODE[mode] <= MODE.day && date.day + "/"}
                                {MODE[mode] <= MODE.month && date.month + "/"}
                                {date.year}
                                {MODE[mode] <= MODE.hour
                                    ? " - " +
                                      (date.hour < 10 ? "0" + date.hour : date.hour) +
                                      ":" +
                                      (date.minute < 10 ? "0" + date.minute : date.minute) +
                                      ":00"
                                    : "  "}
                            </AppTextMedium>
                        </View>
                    </View>
                </View>

                <View style={styles.datePickerContainer}>
                    <DatePicker mode={mode} value={date} inititalValue={date} onDateChange={setDate} {...dateData} />
                </View>

                {/* Footer */}
                <View style={styles.footerModal}>
                    {/* Cancel */}
                    <TouchableOpacity
                        style={styles.buttonFooterModal}
                        onPress={() => {
                            modalRef.current.close();
                        }}
                    >
                        <AppText style={styles.textButtonFooterModal}> Cancel </AppText>
                    </TouchableOpacity>

                    {/* OK */}
                    <TouchableOpacity
                        style={styles.buttonFooterModal}
                        onPress={() => {
                            onOk
                                ? onOk(() => {
                                      modalRef.current.close();
                                  })
                                : modalRef.current.close();
                        }}
                    >
                        <Text style={styles.textButtonFooterModal}> OK </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </BottomSheet>
    );
});

export const DatePickerSheet = React.memo(_DatePickerSheet, (prev, next) => prev.mode == next.mode);

const styles = StyleSheet.create({
    modalStyle: {
        width: WIDTH,
        bottom: -0.1 * HEIGHT,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 8 * unit,
        borderTopLeftRadius: 12 * unit,
        borderTopRightRadius: 12 * unit,
        paddingBottom: HEIGHT * 0.1,
    },

    headerModal: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        paddingHorizontal: 18 * unit,
        paddingTop: 2 * rem,
        paddingBottom: rem,
    },

    leftTitleHeader: {
        flex: 1,
        fontSize: 18 * unit,
        color: Color.gray_10,
    },

    rightTitleContainerHeader: {
        flexDirection: "row",
        alignItems: "center",
    },

    rightTitleHeader: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 6 * unit,
        paddingHorizontal: 12 * unit,
        marginLeft: 6 * unit,
        backgroundColor: Color.gray_0,
        borderRadius: 6 * unit,
        borderWidth: 1,
        borderColor: Color.gray_3,
    },

    rightTitleText: {
        fontSize: 15 * unit,
        color: Color.gray_8,
        paddingLeft: 12 * unit,
    },

    datePickerContainer: {
        paddingBottom: 24 * unit,
    },
    footerModal: {
        flexDirection: "row",
        marginHorizontal: 6 * unit,
        borderTopWidth: 1,
        borderTopColor: Color.gray_2,
    },
    buttonFooterModal: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 14 * unit,
    },
    textButtonFooterModal: {
        fontSize: 16 * unit,
        paddingHorizontal: 4 * unit,
        color: Color.gray_10,
        fontFamily: GoogleSansFontType.bold,
    },
});
