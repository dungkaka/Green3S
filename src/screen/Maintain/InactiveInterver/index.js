import { AppText } from "@common-ui/AppText";
import { rem, unit } from "@theme/styleContants";
import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Color } from "@theme/colors";
import { time } from "@utils/helps/time";
import { round2 } from "@utils/helps/functions";
import { JumpLogoPage } from "@common-ui/Loading/JumpLogo";
import Filter from "./Filter";
import { useFetchErrorAC } from "@services/error";
import TableStickBasicTemplate from "@common-ui/Table/TableStickBasicTemplate";

// Giống lỗi AC

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
        width: 5 * rem,
        render: ({ item, index, defaultBlockStyle }) => (
            <View key={2} style={defaultBlockStyle}>
                <AppText style={styles.contentCell}>{item.device?.devName}</AppText>
            </View>
        ),
    },
    {
        key: "error_name",
        title: "Tên lỗi",
        width: 7 * rem,
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
        width: 7 * rem,
        render: ({ item, index, defaultBlockStyle }) => (
            <View key={8} style={defaultBlockStyle}>
                <AppText style={styles.contentCell}>{JSON.parse(item.time_repair)?.repaired}</AppText>
            </View>
        ),
    },
    { key: "created_at", title: "Thời gian xuất hiện", width: 7 * rem },
    { key: "time_end", title: "Thời gian kết thúc", width: 7 * rem },
];

const initEndDate = time().toDateObject();
const initStartDate = { ...time().toDateObject(), day: 1 };

const InactiveInverter = () => {
    const [filter, setFilter] = useState({
        endDate: initEndDate,
        startDate: initStartDate,
        stationCode: "",
        status: -1,
        error: "device_in_active",
        page: 1,
    });
    const { rData, rIsValidating, mutate } = useFetchErrorAC({ ...filter });
    const datas = rData?.datas || [];

    const handleFilter = (filter) => {
        setFilter({
            endDate: filter.endDate,
            startDate: filter.startDate,
            stationCode: filter.plant.stationCode,
            status: filter.status.key,
            error: "device_in_active",
            page: 1,
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
                    showPagination={true}
                    paginationInfo={{
                        total: rData.total_page * 20 || 0,
                        page: filter.page,
                        pageSize: 20,
                        currentPageSize: datas.length,
                        onChangePage: (page) => {
                            setFilter({ ...filter, page: page });
                        },
                    }}
                />
            ) : null}
        </View>
    );
};

export default InactiveInverter;

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
