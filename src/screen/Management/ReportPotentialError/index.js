import { AppText, AppTextMedium } from "@common-ui/AppText";
import { JumpLogoPage } from "@common-ui/Loading/JumpLogo";
import MyModal from "@common-ui/Modal/MyModal";
import TableStickBasicTemplate from "@common-ui/Table/TableStickBasicTemplate";
import { useRoute } from "@react-navigation/native";
import { useReportPlantPotentialError } from "@services/report";
import { Color } from "@theme/colors";
import { rem, unit } from "@theme/styleContants";
import React, { useMemo, useRef } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import ImageLogViewer from "./ImageLogViewer";

const ReportPotentialError = () => {
    const { params } = useRoute();
    const filter = params.filter || {};
    const { startDate, endDate, plant } = filter;
    const { rData, rIsValidating, mutate } = useReportPlantPotentialError({ ...filter });
    const imageLogViewerRef = useRef();

    const options = useMemo(
        () => [
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
                            imageLogViewerRef.current.open(
                                `https://green3s.vn/uploads/errors/${plant.stationCode}/${item.image}`
                            )
                        }
                        style={defaultBlockStyle}
                    >
                        <Image
                            source={{
                                uri: `https://green3s.vn/uploads/errors/${plant.stationCode}/${item.image}`,
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
        ],
        [rData]
    );

    const data = rData?.datas || [];

    return (
        <View style={styles.container}>
            <AppTextMedium style={styles.title}>
                {`${plant.stationName} \nTừ ${startDate.day}/${startDate.month}/${startDate.year}  Đến ${endDate.day}/${endDate.month}/${endDate.year}`}
            </AppTextMedium>
            {rIsValidating ? (
                <JumpLogoPage />
            ) : (
                <TableStickBasicTemplate
                    heightRow={154}
                    left={[0, 1]}
                    stickPosition={3 * rem}
                    options={options}
                    data={data}
                    headerContainerStyle={styles.tableHeaderContainer}
                    textHeaderStyle={styles.tableTextHeader}
                    numberLinesContentCell={8}
                />
            )}
            <ImageLogViewer ref={imageLogViewerRef} />
        </View>
    );
};

export default ReportPotentialError;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "white" },
    contentCell: {
        textAlign: "center",
        color: Color.gray_11,
    },
    tableHeaderContainer: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: Color.gray_2,
    },

    tableTextHeader: {
        color: Color.gray_11,
    },
    title: {
        padding: 16 * unit,
        color: Color.gray_11,
    },
    loading: {
        flex: 1,
    },
});
