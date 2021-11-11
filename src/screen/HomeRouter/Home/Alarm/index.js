import { AppText, AppTextMedium } from "@common-ui/AppText";
import { rem, unit } from "@theme/styleContants";
import React, { Fragment, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Color } from "@theme/colors";
import { time } from "@utils/helps/time";
import { round2 } from "@utils/helps/functions";
import { JumpLogoPage } from "@common-ui/Loading/JumpLogo";
import Filter from "./Filter";
import TableStickBasicTemplate from "@common-ui/Table/TableStickBasicTemplate";
import ErrorPage from "@common-components/ErrorPage";
import { useFetchAlarm } from "@services/alarm";
import ButtonModal from "@common-ui/Modal/ButtonModal";

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
        key: "devName",
        title: "Thiết bị",
        width: 6 * rem,
    },
    {
        key: "alarmType",
        title: "Loại báo động",
        width: 8 * rem,
        render: ({ item, index, defaultBlockStyle }) => (
            <View key={3} style={defaultBlockStyle}>
                {renderAlarmType(item.alarmType)}
            </View>
        ),
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
        key: "number",
        title: "Number",
        width: 6 * rem,
    },
    {
        key: "lev",
        title: "Mức độ nghiêm trọng",
        width: 10 * rem,
        render: ({ item, index, defaultBlockStyle }) => (
            <View key={1} style={defaultBlockStyle}>
                <AppText style={styles.contentCell}>{renderAlarmLev(item.lev)}</AppText>
            </View>
        ),
    },
    {
        key: "time_repair",
        title: "Nguyên nhân, giải pháp",
        width: 8 * rem,
        render: ({ item, index, defaultBlockStyle }) => (
            <ButtonModal
                key={9}
                style={defaultBlockStyle}
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
                                <AppText>
                                    {item.warning?.solution} {item.warning?.solution}
                                </AppText>
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
        render: ({ item, index, defaultBlockStyle }) => (
            <View key={11} style={defaultBlockStyle}>
                <AppText style={styles.contentCell}>{item.status_accept == 1 ? "Đã sửa" : "Chưa sửa"}</AppText>
            </View>
        ),
    },
];

const initEndDate = time().toDateObject();
const initStartDate = { ...time().toDateObject(), day: 1 };

const Alarm = () => {
    const [filter, setFilter] = useState({
        endDate: initEndDate,
        startDate: initStartDate,
        stationCode: "",
        page: 1,
    });
    const { rData, rIsValidating, error, mutate } = useFetchAlarm({ ...filter });
    const datas = rData?.datas || [];

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
