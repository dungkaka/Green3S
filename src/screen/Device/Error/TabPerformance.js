import { AppText } from "@common-ui/AppText";
import TableStickBasicTemplate from "@common-ui/Table/TableStickBasicTemplate";
import { Color } from "@theme/colors";
import { rem, unit } from "@theme/styleContants";
import React from "react";
import { StyleSheet, View } from "react-native";

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
        render: ({ item, index, defaultBlockStyle }) => (
            <View key={0} style={defaultBlockStyle}>
                <AppText style={styles.contentCell}>{index + 1}</AppText>
            </View>
        ),
    },
    {
        key: "station",
        title: "Nhà máy",
        width: 6 * rem,
        render: ({ item, index, defaultBlockStyle }) => (
            <View key={1} style={defaultBlockStyle}>
                <AppText style={styles.contentCell}>{item.factory?.stationName}</AppText>
            </View>
        ),
    },
    {
        key: "device",
        title: "Thiết bị",
        width: 6 * rem,
        render: ({ item, index, defaultBlockStyle }) => (
            <View key={2} style={defaultBlockStyle}>
                <AppText style={styles.contentCell}>{item.device?.devName}</AppText>
            </View>
        ),
    },
    {
        key: "sting",
        title: "String",
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
        render: ({ item, index, defaultBlockStyle }) => (
            <View key={6} style={defaultBlockStyle}>
                {renderStatus(item.status)}
            </View>
        ),
    },
    { key: "note", title: "Ghi chú", width: 8 * rem },
    {
        key: "time_repair",
        title: "Thời gian tác động",
        width: 8 * rem,
        render: ({ item, index, defaultBlockStyle }) => (
            <View key={8} style={defaultBlockStyle}>
                <AppText style={styles.contentCell}>{JSON.parse(item.time_repair)?.repaired}</AppText>
            </View>
        ),
    },
    { key: "created_at", title: "Thời gian xuất hiện", width: 8 * rem },
    { key: "time_end", title: "Thời gian kết thúc", width: 8 * rem },
];

export default TabPerformance = ({ data = [] }) => {
    return (
        <TableStickBasicTemplate
            heightRow={100}
            left={[0, 1]}
            stickPosition={3 * rem}
            options={options}
            data={data}
            headerContainerStyle={styles.tableHeaderContainer}
            textHeaderStyle={styles.tableTextHeader}
            numberLinesContentCell={5}
        />
    );
};

const styles = StyleSheet.create({
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
    tableHeaderContainer: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: Color.gray_2,
    },

    tableTextHeader: {
        color: Color.gray_11,
    },
});
