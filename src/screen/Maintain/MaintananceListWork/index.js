import { AppText } from "@common-ui/AppText";
import { rem, unit } from "@theme/styleContants";
import React, { useRef, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { Color } from "@theme/colors";
import { time } from "@utils/helps/time";
import { JumpLogoPage } from "@common-ui/Loading/JumpLogo";
import Filter from "./Filter";
import { useListWorkMaintainance } from "@services/maintenance";
import TableStickBasicTemplate from "@common-ui/Table/TableStickBasicTemplate";

const initDate = time().toDateObject();

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
        key: "date",
        title: "Ngày",
        width: 7 * rem,
    },
    {
        key: "stationName",
        title: "Nhà máy",
        width: 8 * rem,
        render: ({ item, index, defaultBlockStyle }) => (
            <View key={2} style={defaultBlockStyle}>
                <AppText style={styles.contentCell}>{item.factory?.stationName}</AppText>
            </View>
        ),
    },
    {
        key: "name_work",
        title: "Công việc",
        width: 10 * rem,
    },
    {
        key: "userName",
        title: "Người thực hiện",
        width: 8 * rem,
        render: ({ item, index, defaultBlockStyle }) => (
            <View key={4} style={defaultBlockStyle}>
                <AppText style={styles.contentCell}>{item.user?.full_name}</AppText>
            </View>
        ),
    },
    {
        key: "tool",
        title: "Dụng cụ",
        width: 8 * rem,
    },

    {
        key: "result_measure",
        title: "Thông số đo kiểm",
        width: 10 * rem,
    },
    {
        key: "status",
        title: "Tiêu chuẩn kỹ thuật",
        width: 8 * rem,
    },
    {
        key: "amount",
        title: "Số lượng thực hiện",
        width: 7 * rem,
    },
    {
        key: "amount_error",
        title: "Số lỗi theo dõi",
        width: 6 * rem,
    },
    {
        key: "result",
        title: "Kết luận",
        width: 16 * rem,
    },
];

const MaintainanceListWork = () => {
    const [filter, setFilter] = useState({
        month: initDate.month,
        year: initDate.year,
        stationCode: "-1",
        nameWork: "",
        page: 1,
    });
    const { rData, rIsValidating, mutate } = useListWorkMaintainance({ ...filter });
    const datas = rData?.datas || [];

    const handleFilter = (filter) => {
        setFilter({
            month: filter.month,
            year: filter.year,
            stationCode: filter.plant.stationCode,
            nameWork: filter.nameWork,
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
                    heightRow={120}
                    left={[0, 1]}
                    stickPosition={3 * rem}
                    options={options}
                    data={datas}
                    headerContainerStyle={styles.tableHeaderContainer}
                    textHeaderStyle={styles.tableTextHeader}
                    numberLinesContentCell={6}
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

export default MaintainanceListWork;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },

    contentCell: {
        fontSize: 13 * unit,
        textAlign: "center",
        color: Color.gray_11,
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
