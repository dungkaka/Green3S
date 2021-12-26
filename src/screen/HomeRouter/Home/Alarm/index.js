import { AppText, AppTextMedium } from "@common-ui/AppText";
import { rem, unit } from "@theme/styleContants";
import React, { Fragment, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Color } from "@theme/colors";
import { time } from "@utils/helps/time";
import { round2 } from "@utils/helps/functions";
import { JumpLogoPage } from "@common-ui/Loading/JumpLogo";
import Filter from "./Filter";
import TableStickBasicTemplate from "@common-ui/Table/TableStickBasicTemplate";
import ErrorPage from "@common-components/ErrorPage";
import { useFetchAlarm } from "@services/alarm";
import ButtonModal from "@common-ui/Modal/ButtonModal";
import { useNavigation } from "@react-navigation/native";
import { NAVIGATION } from "constant/navigation";

const renderAlarmType = (code) => {
    switch (code) {
        case 1:
            return (
                <AppText style={[styles.contentCellTag, { backgroundColor: Color.orangePastel }]}>Transposition Signal</AppText>
            );
        case 2:
            return <AppText style={[styles.contentCellTag, { backgroundColor: Color.redPastelDark }]}>Exception Alarm</AppText>;
        case 3:
            return <AppText style={[styles.contentCellTag, { backgroundColor: Color.blueModern_1 }]}>Protection Event</AppText>;
        case 4:
            return (
                <AppText style={[styles.contentCellTag, { backgroundColor: Color.purpleDark }]}>Notification Status</AppText>
            );
        case 5:
            return <AppText style={[styles.contentCellTag, { backgroundColor: Color.gray_10 }]}>Alarm Information</AppText>;
        default:
            return null;
    }
};

const renderAlarmLev = (code) => {
    switch (code) {
        case "1":
            return "critical";
        case "2":
            return "major";
        case "3":
            return "minor";
        case "4":
            return "warning";
        default:
            return null;
    }
};

const initEndDate = time().toDateObject();
const initStartDate = { ...time().toDateObject(), day: 1 };

const Alarm = () => {
    const navigation = useNavigation();
    const [filter, setFilter] = useState({
        endDate: initEndDate,
        startDate: initStartDate,
        stationCode: "",
        page: 1,
    });
    const { rData, rIsValidating, error, mutate } = useFetchAlarm({ ...filter });
    const datas = rData?.datas || [];

    const options = useMemo(
        () => [
            {
                key: "order",
                title: "STT",
                width: 3 * rem,
                render: ({ item, index, cellStyle }) => (
                    <View style={cellStyle}>
                        <AppText style={styles.contentCell}>{index + 1}</AppText>
                    </View>
                ),
            },
            {
                key: "station",
                title: "Nhà máy",
                width: 6 * rem,
                render: ({ item, index, cellStyle }) => (
                    <Pressable
                        onPress={() => {
                            item.factory &&
                                navigation.push(NAVIGATION.DETAIL_PLANT, {
                                    ...item.factory,
                                });
                        }}
                        style={cellStyle}
                    >
                        <AppText style={styles.contentCellLink}>{item.factory?.stationName}</AppText>
                    </Pressable>
                ),
            },
            {
                key: "devName",
                title: "Thiết bị",
                width: 6 * rem,
                render: ({ item, index, cellStyle }) => (
                    <Pressable
                        onPress={() => {
                            item.factory &&
                                navigation.push(NAVIGATION.DETAIL_DEVICE, {
                                    device: item.device,
                                });
                        }}
                        style={cellStyle}
                    >
                        <AppText style={styles.contentCellLink}>{item.device?.devName}</AppText>
                    </Pressable>
                ),
            },
            {
                key: "alarmType",
                title: "Loại báo động",
                width: 8 * rem,
                render: ({ item, index, cellStyle }) => <View style={cellStyle}>{renderAlarmType(item.alarmType)}</View>,
            },
            {
                key: "alarmName",
                title: "Tên báo động",
                width: 8 * rem,
            },
            {
                key: "alarmId",
                title: "Id báo động",
                width: 6 * rem,
            },
            {
                key: "causeId",
                title: "POSSIBLEID",
                width: 7 * rem,
            },
            {
                key: "message",
                title: "Event",
                width: 14 * rem,
            },
            {
                key: "number",
                title: "Number",
                width: 6 * rem,
            },
            {
                key: "lev",
                title: "Mức độ nghiêm trọng",
                width: 10 * rem,
                render: ({ item, index, cellStyle }) => (
                    <View style={cellStyle}>
                        <AppText style={styles.contentCell}>{renderAlarmLev(item.lev)}</AppText>
                    </View>
                ),
            },
            {
                key: "time_repair",
                title: "Nguyên nhân, giải pháp",
                width: 8 * rem,
                render: ({ item, index, cellStyle }) => (
                    <ButtonModal
                        style={cellStyle}
                        lazyLoad={true}
                        title="Nguyên nhân, giải pháp"
                        renderContentModal={() => {
                            return (
                                <Fragment>
                                    <AppTextMedium>Nguyên nhân</AppTextMedium>
                                    <View style={styles.cellRSTitle}>
                                        <AppText>{item.warning?.reason}</AppText>
                                    </View>
                                    <AppTextMedium>Giải pháp</AppTextMedium>
                                    <View style={styles.cellRSTitle}>
                                        <AppText>{item.warning?.solution}</AppText>
                                    </View>
                                </Fragment>
                            );
                        }}
                    >
                        <AppTextMedium style={styles.cellTextDetail}>Chi tiết</AppTextMedium>
                    </ButtonModal>
                ),
            },
            { key: "timestamp", title: "Thời gian xảy ra", width: 7 * rem },
            {
                key: "status_accept",
                title: "Trạng thái",
                width: 6 * rem,
                render: ({ item, index, cellStyle }) => (
                    <View style={cellStyle}>
                        <AppText style={styles.contentCell}>{item.status_accept == 1 ? "Đã sửa" : "Chưa sửa"}</AppText>
                    </View>
                ),
            },
        ],
        [rData]
    );

    const handleFilter = (filter) => {
        setFilter({
            endDate: filter.endDate,
            startDate: filter.startDate,
            stationCode: filter.plant.stationCode,
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
            ) : error ? (
                <ErrorPage color={Color.redDark} />
            ) : rData ? (
                <TableStickBasicTemplate
                    heightRow={75}
                    left={[0, 1]}
                    stickPosition={3 * rem}
                    options={options}
                    data={datas}
                    headerContainerStyle={styles.tableHeaderContainer}
                    textHeaderStyle={styles.tableTextHeader}
                    numberLinesContentCell={4}
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

export default Alarm;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },

    contentCellLink: {
        fontSize: 13 * unit,
        textAlign: "center",
        color: Color.blueDark,
    },

    contentCell: {
        fontSize: 13 * unit,
        textAlign: "center",
    },

    contentCellTag: {
        fontSize: 12 * unit,
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

    cellTextDetail: {
        fontSize: 13 * unit,
        color: Color.redDark,
    },

    cellRSTitle: {
        padding: 12 * unit,
        backgroundColor: Color.gray_2,
        borderRadius: 6,
        marginVertical: 12 * unit,
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
