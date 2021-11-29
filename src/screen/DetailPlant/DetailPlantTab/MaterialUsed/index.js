import { AppText, AppTextMedium } from "@common-ui/AppText";
import { JumpLogo, JumpLogoPage } from "@common-ui/Loading/JumpLogo";
import TableStickBasicTemplate from "@common-ui/Table/TableStickBasicTemplate";
import { useRoute } from "@react-navigation/native";
import { useReportPlantMaterial } from "@services/report";
import { Color } from "@theme/colors";
import { rem, unit } from "@theme/styleContants";
import { time } from "@utils/helps/time";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Filter from "./Filter";

const options = [
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
        key: "name",
        title: "Tên vật tư",
        width: 8 * rem,
    },
    {
        key: "code",
        title: "Mã vật tư",
        width: 8 * rem,
    },
    {
        key: "status",
        title: "Loại vật tư",
        width: 8 * rem,
        render: ({ item, index, cellStyle }) => (
            <View key={3} style={cellStyle}>
                <AppText style={styles.contentCell}>
                    {item.status == 1 ? "Cũ" : item.status == 2 ? "Mới" : "Thiết bị bảo hành"}
                </AppText>
            </View>
        ),
    },
    {
        key: "material_useds",
        title: "Vị trí sử dụng",
        width: 12 * rem,
        render: ({ item, index, cellStyle }) => (
            <View key={4} style={cellStyle}>
                <AppText style={styles.contentCell}>
                    {item.material_useds[0].string} - {item.material_useds[0].device?.devName}
                </AppText>
            </View>
        ),
    },
    {
        key: "amount",
        title: "Còn lại trong kho",
        width: 8 * rem,
    },
    {
        key: "used",
        title: "Sử dụng",
        width: 6 * rem,
    },
];

const initEndDate = time().toDateObject();
const initStartDate = { ...time().toDateObject(), day: 1 };

const DPMaterialUsed = () => {
    const { params } = useRoute();
    const { stationCode } = params ? params : {};

    const [filter, setFilter] = useState({
        endDate: initEndDate,
        startDate: initStartDate,
        plant: { stationCode },
    });

    const { rData, rIsValidating, mutate } = useReportPlantMaterial({ ...filter });

    const data = rData?.datas || [];

    const handleFilter = (filter) => {
        setFilter({
            endDate: filter.endDate,
            startDate: filter.startDate,
            plant: { stationCode },
        });
    };

    return (
        <View style={styles.container}>
            <Filter filter={filter} handleFilter={handleFilter} />
            {rIsValidating ? (
                <JumpLogoPage />
            ) : (
                <TableStickBasicTemplate
                    heightRow={68}
                    left={[0, 1]}
                    stickPosition={3 * rem}
                    options={options}
                    data={data}
                    headerContainerStyle={styles.tableHeaderContainer}
                    textHeaderStyle={styles.tableTextHeader}
                />
            )}
        </View>
    );
};

export default React.memo(DPMaterialUsed, () => true);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "white" },
    contentCell: {
        fontSize: 13 * unit,
        textAlign: "center",
        color: Color.gray_11,
    },
    tableHeaderContainer: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: Color.gray_2,
    },

    tableTextHeader: {
        color: Color.gray_11,
    },
    title: {
        padding: 16 * unit,
        color: Color.gray_11,
    },
    loading: {
        flex: 1,
    },
});
