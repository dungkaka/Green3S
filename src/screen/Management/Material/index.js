import { AppText } from "@common-ui/AppText";
import { rem, unit } from "@theme/styleContants";
import React, { useRef, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { Color } from "@theme/colors";
import { format, time } from "@utils/helps/time";
import { JumpLogoPage } from "@common-ui/Loading/JumpLogo";
import Filter from "./Filter";
import { useFetchMaterial } from "@services/material";
import TableStickBasicTemplate from "@common-ui/Table/TableStickBasicTemplate";

const renderStatus = (code) => {
    switch (code) {
        case 1:
            return "Cũ";
        case 2:
            return "Mới";
        case 3:
            return "Thiết bị bảo hành";
        default:
            return null;
    }
};

const renderStatusAccept = (code) => {
    switch (code) {
        case 0:
            return <AppText style={[styles.contentCellTag, { backgroundColor: Color.redPastelDark }]}>Chưa duyệt</AppText>;
        case 1:
            return <AppText style={[styles.contentCellTag, { backgroundColor: Color.greenBlueDark }]}>Đã duyệt</AppText>;
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
        key: "stationName",
        title: "Nhà máy",
        width: 7 * rem,
        render: ({ item, index, defaultBlockStyle }) => (
            <View key={1} style={defaultBlockStyle}>
                <AppText style={styles.contentCell}>{item.factory?.stationName}</AppText>
            </View>
        ),
    },
    {
        key: "name",
        title: "Tên lỗi",
        width: 10 * rem,
    },
    {
        key: "code",
        title: "Mã",
        width: 6 * rem,
    },
    {
        key: "serial",
        title: "Serial",
        width: 6 * rem,
    },
    {
        key: "amount",
        title: "Số lượng",
        width: 5 * rem,
    },
    {
        key: "used",
        title: "Đã dùng",
        width: 5 * rem,
    },
    {
        key: "unit",
        title: "Đơn vị",
        width: 5 * rem,
    },
    {
        key: "reason",
        title: "Lý do",
        width: 10 * rem,
    },
    {
        key: "user",
        title: "Người tạo",
        width: 6 * rem,
        render: ({ item, index, defaultBlockStyle }) => (
            <View key={9} style={defaultBlockStyle}>
                <AppText style={styles.contentCell}>{item.user?.username}</AppText>
            </View>
        ),
    },
    {
        key: "user_accept",
        title: "Người duyệt",
        width: 6 * rem,
        render: ({ item, index, defaultBlockStyle }) => (
            <View key={10} style={defaultBlockStyle}>
                <AppText style={styles.contentCell}>{item.user_accept?.username}</AppText>
            </View>
        ),
    },
    {
        key: "status",
        title: "Tình trạng",
        width: 6 * rem,
        render: ({ item, index, defaultBlockStyle }) => (
            <View key={11} style={defaultBlockStyle}>
                <AppText style={styles.contentCell}>{renderStatus(item.status)}</AppText>
            </View>
        ),
    },

    {
        key: "status_accept",
        title: "Trạng thái",
        width: 8 * rem,
        render: ({ item, index, defaultBlockStyle }) => (
            <View key={12} style={defaultBlockStyle}>
                {renderStatusAccept(item.status_accept)}
            </View>
        ),
    },
    {
        key: "created_at",
        title: "Ngày tạo",
        width: 8 * rem,
        render: ({ item, index, defaultBlockStyle }) => (
            <View key={13} style={defaultBlockStyle}>
                <AppText style={styles.contentCell}>{format(item.created_at, "YYYY-MM-DD H:M:S")}</AppText>
            </View>
        ),
    },
];

const Material = () => {
    const [filter, setFilter] = useState({
        stationCode: "-1",
        name: "",
    });
    const { rData, rIsValidating, mutate } = useFetchMaterial({ ...filter });
    const datas = rData?.datas || [];

    const handleFilter = (filter) => {
        setFilter({
            stationCode: filter.plant.stationCode,
            name: filter.name || "",
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
                    heightRow={90}
                    left={[0, 1]}
                    stickPosition={3 * rem}
                    options={options}
                    data={datas}
                    headerContainerStyle={styles.tableHeaderContainer}
                    textHeaderStyle={styles.tableTextHeader}
                    numberLinesContentCell={4}
                />
            ) : null}
        </View>
    );
};

export default Material;

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
