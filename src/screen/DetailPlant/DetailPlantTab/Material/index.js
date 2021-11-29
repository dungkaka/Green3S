import { AppText, AppTextMedium } from "@common-ui/AppText";
import { JumpLogo, JumpLogoPage } from "@common-ui/Loading/JumpLogo";
import TableStickBasicTemplate from "@common-ui/Table/TableStickBasicTemplate";
import { useRoute } from "@react-navigation/native";
import { usePlantMaterial } from "@services/factory";
import { Color } from "@theme/colors";
import { rem, unit } from "@theme/styleContants";
import { format, time } from "@utils/helps/time";
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
        key: "item",
        title: "Hạng mục",
        width: 8 * rem,
    },
    {
        key: "model",
        title: "Model",
        width: 10 * rem,
    },
    {
        key: "serials",
        title: "Serials",
        width: 8 * rem,
    },
    {
        key: "producer",
        title: "Nhà sản xuất",
        width: 8 * rem,
    },
    {
        key: "information",
        title: "Thông số kỹ thuật",
        width: 12 * rem,
    },
    {
        key: "unit",
        title: "Đơn vị",
        width: 6 * rem,
    },
    {
        key: "qts",
        title: "Khối lượng",
        width: 6 * rem,
    },
    {
        key: "date_install",
        title: "Ngày lắp đặt",
        width: 8 * rem,
    },
    {
        key: "day_num",
        title: "Chu kỳ bảo trì (Ngày)",
        width: 7 * rem,
    },
    {
        key: "maintenance_date",
        title: "Lịch bảo trì sắp tới",
        width: 8 * rem,
        render: ({ item, index, cellStyle }) => (
            <View key={10} style={cellStyle}>
                <AppText style={styles.contentCell}>{format(new Date(item.maintenance_date))}</AppText>
            </View>
        ),
    },
    {
        key: "next_maintenance_date",
        title: "Lịch bảo trì tiếp theo",
        width: 8 * rem,
        render: ({ item, index, cellStyle }) => (
            <View key={11} style={cellStyle}>
                <AppText style={styles.contentCell}>{format(new Date(item.next_maintenance_date))}</AppText>
            </View>
        ),
    },
];

const DPMaterial = () => {
    const { params } = useRoute();
    const { stationCode } = params ? params : {};

    const [filter, setFilter] = useState({
        stationCode: stationCode,
    });

    const { rData, rIsValidating, mutate } = usePlantMaterial({ ...filter });

    const data = rData || [];

    const handleFilter = (filter) => {
        setFilter({
            stationCode: stationCode,
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

export default React.memo(DPMaterial, () => true);

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
