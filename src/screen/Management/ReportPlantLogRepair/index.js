import { AppText, AppTextMedium } from "@common-ui/AppText";
import { JumpLogoPage } from "@common-ui/Loading/JumpLogo";
import MyModal from "@common-ui/Modal/MyModal";
import TableStickBasicTemplate from "@common-ui/Table/TableStickBasicTemplate";
import { useRoute } from "@react-navigation/native";
import { useReportPlantLogRepair } from "@services/report";
import { Color } from "@theme/colors";
import { rem, unit } from "@theme/styleContants";
import React, { useMemo, useRef } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import ImageLogViewer from "./ImageLogViewer";

const ReportPlanLogRepair = () => {
    const { params } = useRoute();
    const filter = params.filter || {};
    const { startDate, endDate, plant } = filter;
    const { rData, rIsValidating, mutate } = useReportPlantLogRepair({ ...filter });
    const imageLogViewerRef = useRef();

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
                key: "date",
                title: "Ngày",
                width: 7 * rem,
            },
            {
                key: "subject",
                title: "Hạng mục",
                width: 8 * rem,
            },
            {
                key: "error",
                title: "Loại công việc",
                width: 8 * rem,
            },
            {
                key: "dev",
                title: "MPPT - Thiết bị",
                width: 12 * rem,
                render: ({ item, index, cellStyle }) => (
                    <View key={4} style={cellStyle}>
                        <AppText style={styles.contentCell}>
                            {item.string} - {item.devName}
                        </AppText>
                    </View>
                ),
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
                title: "Trạng thái",
                width: 6 * rem,
            },
            {
                key: "note",
                title: "Ghi chú",
                width: 12 * rem,
            },
            {
                key: "image",
                title: "VT",
                width: 8 * rem,
                render: ({ item, index, cellStyle }) => {
                    if (!item.image) return <View key={9} style={cellStyle} />;
                    return (
                        <Pressable onPress={() => imageLogViewerRef.current.open(item.image)} key={9} style={cellStyle}>
                            <Image
                                source={{
                                    uri: item.image,
                                    width: "100%",
                                    height: "100%",
                                }}
                                resizeMode="contain"
                            />
                        </Pressable>
                    );
                },
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
                    heightRow={96}
                    left={[0, 1]}
                    stickPosition={3 * rem}
                    options={options}
                    data={data}
                    headerContainerStyle={styles.tableHeaderContainer}
                    textHeaderStyle={styles.tableTextHeader}
                    numberLinesContentCell={5}
                />
            )}
            <ImageLogViewer ref={imageLogViewerRef} />
        </View>
    );
};

export default ReportPlanLogRepair;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "white" },
    contentCell: {
        fontSize: 13 * unit,
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
