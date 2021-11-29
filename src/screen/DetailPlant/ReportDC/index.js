import { AppText } from "@common-ui/AppText";
import { rem, unit } from "@theme/styleContants";
import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Color } from "@theme/colors";
import { time } from "@utils/helps/time";
import { round2 } from "@utils/helps/functions";
import { JumpLogoPage } from "@common-ui/Loading/JumpLogo";
import Filter from "./Filter";
import { useFetchErrorDC } from "@services/error";
import TableStickBasicTemplate from "@common-ui/Table/TableStickBasicTemplate";
import { useRoute } from "@react-navigation/native";

const renderStatus = (code) => {
    switch (code) {
        case 0:
            return <AppText style={[styles.contentCellTag, { backgroundColor: Color.redPastelDark }]}>Chưa sửa</AppText>;
        case 1:
            return <AppText style={[styles.contentCellTag, { backgroundColor: Color.greenBlueDark }]}>Đã sửa</AppText>;
        case 2:
            return <AppText style={[styles.contentCellTag, { backgroundColor: Color.blueModern_1 }]}>Đang sửa</AppText>;
        case 3:
            return <AppText style={[styles.contentCellTag, { backgroundColor: Color.purpleDark }]}>Đợi vật tư</AppText>;
        case -1:
            return <AppText style={[styles.contentCellTag, { backgroundColor: Color.gray_10 }]}>Toàn bộ trạng thái</AppText>;
        default:
            return null;
    }
};

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
        key: "station",
        title: "Nhà máy",
        width: 6 * rem,
        render: ({ item, index, cellStyle }) => (
            <View key={1} style={cellStyle}>
                <AppText style={styles.contentCell}>{item.factory?.stationName}</AppText>
            </View>
        ),
    },
    {
        key: "device",
        title: "Thiết bị",
        width: 6 * rem,
        render: ({ item, index, cellStyle }) => (
            <View key={2} style={cellStyle}>
                <AppText style={styles.contentCell}>{item.device?.devName}</AppText>
            </View>
        ),
    },
    {
        key: "string",
        title: "String",
        width: 6 * rem,
        render: ({ item, index, cellStyle }) => (
            <View key={3} style={cellStyle}>
                <AppText style={styles.contentCellString}>{item.string}</AppText>
            </View>
        ),
    },
    {
        key: "error_name",
        title: "Tên lỗi",
        width: 8 * rem,
    },
    {
        key: "reason",
        title: "Nguyên nhân",
        width: 16 * rem,
    },
    {
        key: "solution",
        title: "Giải pháp",
        width: 16 * rem,
    },
    {
        key: "status",
        title: "Trạng thái sửa",
        width: 7 * rem,
        render: ({ item, index, cellStyle }) => (
            <View key={7} style={cellStyle}>
                {renderStatus(item.status)}
            </View>
        ),
    },
    { key: "note", title: "Ghi chú", width: 8 * rem },
    {
        key: "time_repair",
        title: "Thời gian tác động",
        width: 8 * rem,
        render: ({ item, index, cellStyle }) => (
            <View key={9} style={cellStyle}>
                <AppText style={styles.contentCell}>{JSON.parse(item.time_repair)?.repaired}</AppText>
            </View>
        ),
    },
    { key: "created_at", title: "Thời gian xuất hiện", width: 8 * rem },
    { key: "time_end", title: "Thời gian kết thúc", width: 8 * rem },
];

const initEndDate = time().toDateObject();
const initStartDate = { ...time().toDateObject(), day: 1 };

const DPReportDC = () => {
    const { params } = useRoute();
    const { stationCode } = params ? params : {};

    const [filter, setFilter] = useState({
        endDate: initEndDate,
        startDate: initStartDate,
        stationCode: stationCode,
        status: -1,
    });
    const { rData, rIsValidating, mutate } = useFetchErrorDC({ ...filter });
    const datas = rData?.datas || [];

    const handleFilter = (filter) => {
        setFilter({
            endDate: filter.endDate,
            startDate: filter.startDate,
            stationCode: stationCode,
            status: filter.status.key,
        });
    };

    return (
        <View style={styles.container}>
            <Filter filter={filter} handleFilter={handleFilter} />

            {rIsValidating ? (
                <View style={{ flex: 1, backgroundColor: "white" }}>
                    <JumpLogoPage />
                </View>
            ) : rData ? (
                <TableStickBasicTemplate
                    heightRow={100}
                    left={[0, 1]}
                    stickPosition={3 * rem}
                    options={options}
                    data={datas}
                    headerContainerStyle={styles.tableHeaderContainer}
                    textHeaderStyle={styles.tableTextHeader}
                    numberLinesContentCell={5}
                />
            ) : null}
        </View>
    );
};

export default DPReportDC;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },

    contentCell: {
        fontSize: 13 * unit,
        textAlign: "center",
    },

    contentCellTag: {
        fontSize: 13 * unit,
        textAlign: "center",
        color: "white",
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },

    contentCellString: {
        fontSize: 13 * unit,
        textAlign: "center",
        color: "white",
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
        backgroundColor: Color.redPastelDark,
    },
    loading: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 2 * rem,
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
