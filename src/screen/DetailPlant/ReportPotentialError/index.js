import { AppText } from "@common-ui/AppText";
import { rem, unit } from "@theme/styleContants";
import React, { useRef, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { Color } from "@theme/colors";
import { time } from "@utils/helps/time";
import { JumpLogoPage } from "@common-ui/Loading/JumpLogo";
import Filter from "./Filter";
import { useFetchPotentialError } from "@services/error";
import TableStickBasicTemplate from "@common-ui/Table/TableStickBasicTemplate";
import ImageLogViewer from "./ImageLogViewer";
import { useRoute } from "@react-navigation/native";

const initEndDate = time().toDateObject();

const renderStatus = (code) => {
    switch (code) {
        case 0:
            return <AppText style={[styles.contentCellTag, { backgroundColor: Color.redPastelDark }]}>Chưa sửa</AppText>;
        case 1:
            return <AppText style={[styles.contentCellTag, { backgroundColor: Color.greenBlueDark }]}>Đã sửa</AppText>;
        case -1:
            return <AppText style={[styles.contentCellTag, { backgroundColor: Color.gray_10 }]}>Toàn bộ trạng thái</AppText>;
        default:
            return null;
    }
};

const DPReportPotentialError = () => {
    const { params } = useRoute();
    const { stationCode } = params ? params : {};

    const [filter, setFilter] = useState({
        month: initEndDate.month,
        year: initEndDate.year,
        stationCode: stationCode,
        name: "",
    });
    const imageLogViewerRef = useRef();
    const { rData, rIsValidating, mutate } = useFetchPotentialError({ ...filter });
    const datas = rData?.datas || [];

    const handleFilter = (filter) => {
        setFilter({
            month: filter.month,
            year: filter.year,
            stationCode: stationCode,
            name: "",
        });
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
            key: "created_at",
            title: "Ngày tạo",
            width: 4 * rem,
            render: ({ item, index, cellStyle }) => (
                <View key={1} style={cellStyle}>
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
            render: ({ item, index, cellStyle }) => (
                <View key={3} style={cellStyle}>
                    <AppText style={styles.contentCell}>{item.factory?.stationName}</AppText>
                </View>
            ),
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
            render: ({ item, index, cellStyle }) => {
                if (!item.image) return <View key={5} style={cellStyle} />;
                const imageUrl = JSON.parse(item.image)[0];
                return (
                    <Pressable
                        key={5}
                        onPress={() =>
                            imageLogViewerRef.current.open(`https://green3s.vn/uploads/errors/${item.stationCode}/${imageUrl}`)
                        }
                        style={cellStyle}
                    >
                        <Image
                            source={{
                                uri: `https://green3s.vn/uploads/errors/${item.stationCode}/${imageUrl}`,
                                width: "100%",
                                height: "100%",
                            }}
                            resizeMode="contain"
                        />
                    </Pressable>
                );
            },
        },

        {
            key: "device",
            title: "Thiết bị",
            width: 12 * rem,
            render: ({ item, index, cellStyle }) => (
                <View key={6} style={cellStyle}>
                    <AppText style={styles.contentCell}>{item.device?.device_id}</AppText>
                </View>
            ),
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
            render: ({ item, index, cellStyle }) => (
                <View key={8} style={cellStyle}>
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
            render: ({ item, index, cellStyle }) => (
                <View key={10} style={cellStyle}>
                    <AppText style={styles.contentCell}>{item.date_repair?.slice(0, 10)}</AppText>
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
            width: 7 * rem,
            render: ({ item, index, cellStyle }) => (
                <View key={12} style={cellStyle}>
                    {renderStatus(item.status_accept)}
                </View>
            ),
        },
    ];

    return (
        <View style={styles.container}>
            <Filter filter={filter} handleFilter={handleFilter} />

            {rIsValidating ? (
                <View style={{ flex: 1, backgroundColor: "white" }}>
                    <JumpLogoPage />
                </View>
            ) : rData ? (
                <TableStickBasicTemplate
                    heightRow={154}
                    left={[0, 1]}
                    stickPosition={3 * rem}
                    options={options}
                    data={datas}
                    headerContainerStyle={styles.tableHeaderContainer}
                    textHeaderStyle={styles.tableTextHeader}
                    numberLinesContentCell={8}
                />
            ) : null}
            <ImageLogViewer ref={imageLogViewerRef} />
        </View>
    );
};

export default DPReportPotentialError;

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
