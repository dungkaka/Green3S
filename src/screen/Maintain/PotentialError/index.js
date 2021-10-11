import { AppText } from "@common-ui/AppText";
import { rem, unit } from "@theme/styleContants";
import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Color } from "@theme/colors";
import { time } from "@utils/helps/time";
import { round2 } from "@utils/helps/functions";
import { JumpLogoPage } from "@common-ui/Loading/JumpLogo";
import Filter from "./Filter";
import { useFetchPerformance } from "@services/error";
import TableStickBasicTemplate from "@common-ui/Table/TableStickBasicTemplate";

const renderStatus = (code) => {
    switch (code) {
        case 0:
            return "Chưa sửa";
        case 1:
            return "Đã sửa";
        case 2:
            return "Đang sửa";
        case 3:
            return "Đợi vật tư";
        case -1:
            return "Toàn bộ trạng thái";
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
        key: "created_at",
        title: "Ngày tạo",
        width: 4 * rem,
        render: ({ item, index, defaultBlockStyle }) => (
            <View key={1} style={defaultBlockStyle}>
                <AppText style={styles.contentCell}>{item.created_at.slice(0, 10)}</AppText>
            </View>
        ),
    },
    {
        key: "name",
        title: "Tên lỗi",
        width: 8 * rem,
    },
    {
        key: "stationName",
        title: "Nhà máy",
        width: 8 * rem,
    },
    {
        key: "content",
        title: "Nội dung sửa",
        width: 10 * rem,
    },
    {
        key: "image",
        title: "Ảnh",
        width: 8 * rem,
        render: ({ item, index, defaultBlockStyle }) => (
            <Pressable
                key={4}
                onPress={() =>
                    imageLogViewerRef.current.open(`https://green3s.vn/uploads/errors/${item.stationCode}/${item.image}`)
                }
                style={defaultBlockStyle}
            >
                <Image
                    source={{
                        uri: `https://green3s.vn/uploads/errors/${item.stationCode}/${item.image}`,
                        width: "100%",
                        height: "100%",
                    }}
                    resizeMode="contain"
                />
            </Pressable>
        ),
    },

    {
        key: "device_id",
        title: "Thiết bị",
        width: 12 * rem,
    },
    {
        key: "string",
        title: "MTTP/String",
        width: 8 * rem,
    },
    {
        key: "reason",
        title: "Nguyên nhân",
        width: 20 * rem,
        render: ({ item, index, defaultBlockStyle }) => (
            <View key={7} style={defaultBlockStyle}>
                <AppText numberOfLines={8} style={styles.contentCell}>
                    {item.reason?.replace(/\n/g, "")}
                </AppText>
            </View>
        ),
    },
    {
        key: "idea",
        title: "Đề xuất",
        width: 10 * rem,
    },
    {
        key: "date_repair",
        title: "Ngày sửa",
        width: 8 * rem,
        render: ({ item, index, defaultBlockStyle }) => (
            <View key={9} style={defaultBlockStyle}>
                <AppText style={styles.contentCell}>{item.date_repair.slice(0, 10)}</AppText>
            </View>
        ),
    },
    {
        key: "status_name",
        title: "Trạng thái",
        width: 8 * rem,
    },
    {
        key: "status_accept",
        title: "Tình trạng",
        width: 6 * rem,
        render: ({ item, index, defaultBlockStyle }) => (
            <View key={11} style={defaultBlockStyle}>
                <AppText style={styles.contentCell}>{item.status_accept == 1 ? "Đã duyệt" : "Chưa duyệt"}</AppText>
            </View>
        ),
    },
];

const initEndDate = time().toDateObject();
const initStartDate = { ...time().toDateObject(), day: 1 };

const PotentialError = () => {
    const [filter, setFilter] = useState({
        endDate: initEndDate,
        startDate: initStartDate,
        stationCode: "",
        status: -1,
    });
    const { rData, rIsValidating, mutate } = useFetchPerformance({ ...filter });
    const datas = rData?.datas || [];

    const handleFilter = (filter) => {
        setFilter({
            endDate: filter.endDate,
            startDate: filter.startDate,
            stationCode: filter.plant.stationCode,
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

export default PotentialError;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },

    contentCell: {
        textAlign: "center",
        color: Color.gray_11,
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
