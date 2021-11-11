import { AppTextMedium } from "@common-ui/AppText";
import React, { useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, ScrollView, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Color } from "@theme/colors";
import { ModalDatePicker } from "@common-ui/Calendar/DatePickerModal";
import { unit } from "@theme/styleContants";
import { ColorDefault } from "@theme";
import Select from "@common-ui/Form/Select";
import { MaterialIcons } from "@expo/vector-icons";

const Filter = ({ filter, handleFilter = () => {}, plants = [] }) => {
    const dataSelectPlants = useMemo(() => {
        const dataPlants = [{ stationCode: "", stationName: "Tất cả" }, ...plants];
        return dataPlants.map((plant) => ({ key: plant.stationCode, value: plant }));
    }, [plants]);

    const modalStartDatePickerRef = useRef();
    const modalEndDatePickerRef = useRef();
    const selectPlantRef = useRef();
    const [startDate, setStartDate] = useState(filter.startDate);
    const [endDate, setEndDate] = useState(filter.endDate);
    const [plant, setPlant] = useState(dataSelectPlants[0]);

    return (
        <View style={{ elevation: 0.5, backgroundColor: "white" }}>
            <ScrollView horizontal contentContainerStyle={styles.dateSelectionContainer} showsHorizontalScrollIndicator={false}>
                <View style={styles.selectPlantConatainer}>
                    <AppTextMedium>Nhà máy</AppTextMedium>
                    <Pressable
                        onPress={() => {
                            selectPlantRef.current.open(plant.key);
                        }}
                        style={styles.displayDate}
                    >
                        <AppTextMedium style={styles.textDateDisplay}>{plant?.value.stationName}</AppTextMedium>
                    </Pressable>
                </View>

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
                            handleFilter({ startDate, endDate, plant: plant.value });
                        }}
                        style={styles.search}
                    >
                        <AntDesign name="arrowright" size={20} color="white" />
                    </Pressable>
                </View>
            </ScrollView>

            <Select
                required
                itemHeight={42}
                options={dataSelectPlants}
                initialOption={dataSelectPlants[0]}
                ref={selectPlantRef}
                onOk={() => {
                    selectPlantRef.current.close();
                    setPlant(selectPlantRef.current.getSelection());
                }}
                OptionItem={({ option, isActive }) => (
                    <View style={styles.itemSelectContainer}>
                        <AppTextMedium style={[styles.itemSelect, isActive ? styles.activeItemSelect : {}]}>
                            {option.value.stationName}
                        </AppTextMedium>
                        {isActive ? <MaterialIcons name="cancel" style={styles.iconActive} /> : null}
                    </View>
                )}
                title="Chọn nhà máy"
            />

            <ModalDatePicker
                ref={modalStartDatePickerRef}
                initialDate={startDate}
                delayRender={600}
                onOk={() => {
                    modalStartDatePickerRef.current.close();
                    setStartDate(modalStartDatePickerRef.current.getData().date);
                }}
            />

            <ModalDatePicker
                ref={modalEndDatePickerRef}
                initialDate={endDate}
                delayRender={600}
                onOk={() => {
                    modalEndDatePickerRef.current.close();
                    setEndDate(modalEndDatePickerRef.current.getData().date);
                }}
            />
        </View>
    );
};

export default React.memo(Filter, (prev, next) => prev.plants == next.plants);

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
