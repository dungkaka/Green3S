import { AppText } from "@common-ui/AppText";
import { rem, unit } from "@theme/styleContants";
import React, { useMemo, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Color } from "@theme/colors";
import { time } from "@utils/helps/time";
import { JumpLogoPage } from "@common-ui/Loading/JumpLogo";
import Filter from "./Filter";
import { ErrorACService } from "@services/error";
import TableStickBasicTemplate from "@common-ui/Table/TableStickBasicTemplate";
import { useNavigation } from "@react-navigation/native";
import { NAVIGATION } from "constant/navigation";

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

const initEndDate = time().toDateObject();
const initStartDate = { ...time().toDateObject(), day: 1 };

const InactiveInverter = () => {
    const navigation = useNavigation();
    const [filter, setFilter] = useState({
        endDate: initEndDate,
        startDate: initStartDate,
        stationCode: "",
        status: -1,
        error: "device_in_active",
        page: 1,
    });
    const { rData, rIsValidating, mutate } = ErrorACService.useFetchErrorAC({ ...filter });
    const datas = rData?.datas || [];

    const options = useMemo(
        () => [
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
                    <TouchableOpacity
                        key={1}
                        onPress={() =>
                            item.factory &&
                            navigation.navigate(NAVIGATION.DETAIL_PLANT, {
                                ...item.factory,
                            })
                        }
                        activeOpacity={0.8}
                        style={cellStyle}
                    >
                        <AppText style={styles.contentCellPress}>{item.factory?.stationName}</AppText>
                    </TouchableOpacity>
                ),
            },
            {
                key: "device",
                title: "Thiết bị",
                width: 5 * rem,
                render: ({ item, index, cellStyle }) => (
                    <TouchableOpacity
                        key={2}
                        onPress={() =>
                            item.factory &&
                            navigation.navigate(NAVIGATION.DETAIL_DEVICE, {
                                device: item.device,
                            })
                        }
                        activeOpacity={0.8}
                        style={cellStyle}
                    >
                        <AppText style={styles.contentCellPress}>{item.device?.devName}</AppText>
                    </TouchableOpacity>
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
                render: ({ item, index, cellStyle }) => (
                    <View key={6} style={cellStyle}>
                        {renderStatus(item.status)}
                    </View>
                ),
            },
            { key: "note", title: "Ghi chú", width: 8 * rem },
            {
                key: "time_repair",
                title: "Thời gian tác động",
                width: 7 * rem,
                render: ({ item, index, cellStyle }) => (
                    <View key={8} style={cellStyle}>
                        <AppText style={styles.contentCell}>{JSON.parse(item.time_repair)?.repaired}</AppText>
                    </View>
                ),
            },
            { key: "created_at", title: "Thời gian xuất hiện", width: 7 * rem },
            { key: "time_end", title: "Thời gian kết thúc", width: 7 * rem },
        ],
        [rData]
    );

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
    contentCellPress: {
        fontSize: 13 * unit,
        textAlign: "center",
        color: Color.blueDark,
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
