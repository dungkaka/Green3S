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

const Filter = ({ filter, handleFilter = () => {} }) => {
    const { data } = useListPlants();
    const dataPlants = [{ stationCode: "-1", stationName: "Tất cả" }, ...(data?.plants || [])];
    const dataSelectPlants = dataPlants.map((plant) => ({ key: plant.stationCode, value: plant }));

    const modalStartDatePickerRef = useRef();
    const selectPlantRef = useRef();
    const [startDate, setStartDate] = useState({ day: 1, month: filter.month, year: filter.year });
    const [plant, setPlant] = useState(dataSelectPlants[0]);

    return (
        <View style={{ elevation: 0.5, backgroundColor: "white" }}>
            <ScrollView horizontal contentContainerStyle={styles.dateSelectionContainer} showsHorizontalScrollIndicator={false}>
                <View style={styles.dateContainer}>
                    <AppTextMedium>Chọn tháng :</AppTextMedium>
                    <Pressable
                        onPress={() => {
                            modalStartDatePickerRef.current.open(startDate);
                        }}
                        style={styles.displayDate}
                    >
                        <AntDesign name="calendar" size={18} color={Color.gray_8} />
                        <AppTextMedium style={styles.textDateDisplay}>
                            {startDate.month}/{startDate.year}
                        </AppTextMedium>
                    </Pressable>
                </View>

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
                    <AppTextMedium> </AppTextMedium>
                    <Pressable
                        onPress={() => {
                            handleFilter({ month: startDate.month, year: startDate.year, plant: plant.value });
                        }}
                        style={styles.search}
                    >
                        <AntDesign name="arrowright" size={20} color="white" />
                    </Pressable>
                </View>
            </ScrollView>

            <Select
                required
                itemHeight={48}
                options={dataSelectPlants}
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
                mode="month"
                ref={modalStartDatePickerRef}
                initialDate={startDate}
                delayRender={300}
                onOk={() => {
                    modalStartDatePickerRef.current.close();
                    setStartDate(modalStartDatePickerRef.current.getData().date);
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
