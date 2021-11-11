import { AppTextMedium } from "@common-ui/AppText";
import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, ScrollView, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Color } from "@theme/colors";
import { ModalDatePicker } from "@common-ui/Calendar/DatePickerModal";
import { unit } from "@theme/styleContants";
import { ColorDefault } from "@theme";
import Select from "@common-ui/Form/Select";
import { MaterialIcons } from "@expo/vector-icons";
import { useListPlants } from "@services/factory";
import { DatePickerSheet } from "@common-ui/Calendar/DatePickerSheet";
import { format } from "@utils/helps/time";

const minutes = new Array(12).fill(0).map((_, i) => ({ value: i * 5, label: `${i * 5}` }));

const Filter = ({ filter, handleFilter = () => {} }) => {
    const modalStartDatePickerRef = useRef();
    const [startDate, setStartDate] = useState(filter.date);

    return (
        <View style={{ elevation: 0.5, backgroundColor: "white" }}>
            <ScrollView horizontal contentContainerStyle={styles.dateSelectionContainer} showsHorizontalScrollIndicator={false}>
                <View style={styles.dateContainer}>
                    <AppTextMedium>Chọn thời gian :</AppTextMedium>
                    <Pressable
                        onPress={() => {
                            modalStartDatePickerRef.current.open(startDate);
                        }}
                        style={styles.displayDate}
                    >
                        <AntDesign name="calendar" size={18} color={Color.gray_8} />
                        <AppTextMedium style={styles.textDateDisplay}>
                            {format(startDate, "DD/MM/YYYY")} - {format(startDate, "H:M:S")}
                        </AppTextMedium>
                    </Pressable>
                </View>

                <View style={styles.dateContainer}>
                    <AppTextMedium> </AppTextMedium>
                    <Pressable
                        onPress={() => {
                            handleFilter({ date: startDate });
                        }}
                        style={styles.search}
                    >
                        <AntDesign name="arrowright" size={20} color="white" />
                    </Pressable>
                </View>
            </ScrollView>

            <DatePickerSheet
                mode="minute"
                ref={modalStartDatePickerRef}
                initialDate={startDate}
                delayRender={300}
                onOk={() => {
                    modalStartDatePickerRef.current.close();
                    setStartDate(modalStartDatePickerRef.current.getData().date);
                }}
                dateData={{
                    minutes: minutes,
                }}
            />
        </View>
    );
};

export default React.memo(Filter, () => true);

const styles = StyleSheet.create({
    dateSelectionContainer: {
        paddingHorizontal: 8 * unit,
        paddingVertical: 8 * unit,
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

    selectPlantConatainer: {
        paddingVertical: 4 * unit,
        paddingHorizontal: 8 * unit,
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
    itemSelectContainer: {
        flexDirection: "row",
    },
    itemSelect: {
        flex: 1,
        paddingVertical: 8 * unit,
        marginVertical: 2 * unit,
        fontSize: 16 * unit,
        color: Color.gray_9,
    },
    activeItemSelect: {
        paddingHorizontal: 12 * unit,
        color: "white",
        backgroundColor: ColorDefault.primary,
        borderRadius: 24 * unit,
    },
    iconActive: {
        marginLeft: 6 * unit,
        flexDirection: "row",
        textAlignVertical: "center",
        fontSize: 32 * unit,
        color: ColorDefault.primary,
    },
});
