import { AppText, AppTextBold, AppTextMedium } from "@common-ui/AppText";
import WheelPicker from "@common-ui/Wheel/WheelPicker";
import { Color } from "@theme/colors";
import { rem, unit } from "@theme/styleContants";
import { GoogleSansFontType } from "@theme/typography";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import ModalPortal from "@common-ui/Modal/ModalPortal";
import { useOnlyDidUpdateEffect } from "@hooks/useOnlyDidUpdateEffect";

// Variable for component
const start = 1960;
const years = new Array(new Date().getFullYear() - start + 1)
    .fill(0)
    .map((_, i) => {
        const value = start + i;
        return { value, label: `${value}` };
    })
    .reverse();
const days = new Array(31).fill(0).map((_, i) => ({ value: i + 1, label: `${i + 1}` }));
const months = new Array(12).fill(0).map((_, i) => ({ value: i + 1, label: `${i + 1}` }));
const ITEM_HEIGHT = 34;

const validateDate = (year, month, day) => {
    var d = new Date(year, month - 1, day);
    if (d.getFullYear() == year && d.getMonth() == month - 1 && d.getDate() == day) {
        return d;
    }
    return undefined;
};

const MemoWheelPicker = React.memo(WheelPicker, () => true);

const DatePicker = ({
    mode = "day",
    value = {},
    inititalValue = { day: 1, month: 1, year: 2021 },
    onDateChange = () => {},
}) => {
    const valueRef = useRef({ ...inititalValue });

    const dayWheelRef = useRef();
    const monthWheelRef = useRef();
    const yearWheelRef = useRef();

    useOnlyDidUpdateEffect(() => {
        if (valueRef.current == value) return;

        const preValueRef = valueRef.current;
        valueRef.current = value;

        if (mode == "day") {
            const dayIndex = days.findIndex((d) => d.value == value.day);
            if (dayIndex != -1) {
                dayWheelRef.current.scrollToIndex({ animated: false, index: dayIndex == 0 ? 0.01 : dayIndex });
            } else {
                valueRef.current.day = preValueRef.day;
            }
        }

        if (mode == "day" || mode == "month") {
            const monthIndex = months.findIndex((m) => m.value == value.month);
            if (monthIndex != -1) {
                monthWheelRef.current.scrollToIndex({
                    animated: false,
                    index: monthIndex == 0 ? 0.01 : monthIndex,
                });
            } else {
                valueRef.current.month = preValueRef.month;
            }
        }

        const yearIndex = years.findIndex((y) => y.value == value.year);
        if (yearIndex != -1) {
            yearWheelRef.current.scrollToIndex({ animated: false, index: yearIndex == 0 ? 0.01 : yearIndex });
        } else {
            valueRef.current.year = preValueRef.year;
        }
    }, [value]);

    return (
        <View style={styles.pickerContainer}>
            <View style={{ flexDirection: "row" }}>
                <View style={styles.lineViewContainer}>
                    <View style={styles.lineView} />
                </View>
                {mode == "day" && (
                    <View style={styles.dayContainter}>
                        <AppTextMedium style={styles.pickerTitle}>Ngày</AppTextMedium>
                        <MemoWheelPicker
                            wheelRef={dayWheelRef}
                            windowSize={3}
                            initialNumToRender={3}
                            decelerationRate={0.9}
                            itemHeight={ITEM_HEIGHT}
                            data={days}
                            initialIndex={days.findIndex((d) => d.value == valueRef.current.day)}
                            renderChild={({ item, index }) => <Text style={styles.label}>{item.label}</Text>}
                            onValueChange={(index) => {
                                valueRef.current = { ...valueRef.current, day: days[index].value };
                                onDateChange(valueRef.current);
                            }}
                        />
                    </View>
                )}

                {(mode == "day" || mode == "month") && (
                    <View style={styles.monthContainter}>
                        <AppTextMedium style={styles.pickerTitle}>Tháng</AppTextMedium>
                        <MemoWheelPicker
                            wheelRef={monthWheelRef}
                            windowSize={3}
                            initialNumToRender={3}
                            decelerationRate={0.9}
                            itemHeight={ITEM_HEIGHT}
                            data={months}
                            initialIndex={months.findIndex((m) => m.value == valueRef.current.month)}
                            renderChild={({ item, index }) => <Text style={styles.label}>{item.label}</Text>}
                            onValueChange={(index) => {
                                valueRef.current = { ...valueRef.current, month: months[index].value };
                                onDateChange(valueRef.current);
                            }}
                        />
                    </View>
                )}

                <View style={styles.yearContainter}>
                    <AppTextMedium style={styles.pickerTitle}>Năm</AppTextMedium>
                    <MemoWheelPicker
                        wheelRef={yearWheelRef}
                        windowSize={3}
                        initialNumToRender={3}
                        decelerationRate={0.9}
                        itemHeight={ITEM_HEIGHT}
                        data={years}
                        initialIndex={years.findIndex((y) => y.value == valueRef.current.year)}
                        renderChild={({ item, index }) => <Text style={styles.label}>{item.label}</Text>}
                        onValueChange={(index) => {
                            valueRef.current = { ...valueRef.current, year: years[index].value };
                            onDateChange(valueRef.current);
                        }}
                    />
                </View>
            </View>
        </View>
    );
};

const _ModalDatePicker = forwardRef(
    ({ onOk, mode = "day", initialDate = { day: 1, month: 1, year: 2021 }, delayRender = 200 }, ref) => {
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

        const isValidDate = validateDate(date.year, date.month, date.day);

        const renderTitle = () => {
            switch (mode) {
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
            <ModalPortal
                ref={modalRef}
                onBackHandler={() => modalRef.current.close()}
                modalStyle={styles.modalStyle}
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
                                    {mode == "day" && date.day + "/"}
                                    {(mode == "day" || mode == "month") && date.month + "/"}
                                    {date.year}
                                </AppTextMedium>
                            </View>
                        </View>
                    </View>

                    <View style={styles.datePickerContainer}>
                        <DatePicker mode={mode} value={date} inititalValue={date} onDateChange={setDate} />
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
            </ModalPortal>
        );
    }
);

export const ModalDatePicker = React.memo(_ModalDatePicker, (prev, next) => prev.mode == next.mode);

const styles = StyleSheet.create({
    modalStyle: {
        width: 23 * rem,
        minWidth: "60%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    modalContainer: {
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 8 * unit,
        borderRadius: 8 * unit,
    },

    headerModal: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 18 * unit,
        paddingTop: 2 * rem,
        paddingBottom: rem,
    },

    leftTitleHeader: {
        fontSize: 18 * unit,
        color: Color.gray_10,
    },

    rightTitleContainerHeader: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
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
        paddingHorizontal: 12 * unit,
    },

    datePickerContainer: {
        paddingBottom: 24 * unit,
    },

    pickerContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    pickerTitle: {
        color: Color.gray_10,
        fontSize: 17 * unit,
        lineHeight: 48 * unit,
    },
    label: {
        fontSize: 20,
        color: Color.gray_10,
        textAlign: "center",
        textAlignVertical: "center",
    },
    lineViewContainer: {
        position: "absolute",
        top: 48 * unit + ITEM_HEIGHT * 2,
        right: 0,
        left: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    lineView: {
        width: "88%",
        height: ITEM_HEIGHT + 2,
        backgroundColor: "transparent",
        borderTopWidth: 1,
        borderTopColor: Color.gray_4,
        borderBottomWidth: 1,
        borderBottomColor: Color.gray_4,
    },
    dayContainter: {
        flex: 3,
        alignItems: "center",
    },
    monthContainter: {
        flex: 3,
        alignItems: "center",
    },
    yearContainter: {
        flex: 4,
        alignItems: "center",
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
