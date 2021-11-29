import { AppText } from "@common-ui/AppText";
import { rem, unit } from "@theme/styleContants";
import React, { Fragment, useRef, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { Color } from "@theme/colors";
import { time } from "@utils/helps/time";
import { JumpLogoPage } from "@common-ui/Loading/JumpLogo";
import Filter from "./Filter";
import { useReportPlanMaintainance } from "@services/report";
import TableStickBasicTemplate from "@common-ui/Table/TableStickBasicTemplate";
import { AntDesign } from "@expo/vector-icons";
import { ColorDefault } from "@theme";
import ModalReportDetail from "./ModalReportDetail";
import { WIDTH } from "@theme/scale";

const initDate = time().toDateObject();

const ModalReportDetailCell = ({ item }) => {
    const modalRef = useRef();
    return (
        <Fragment>
            <Pressable
                onPress={() => {
                    modalRef.current.open();
                }}
                style={styles.search}
            >
                <AntDesign name="arrowright" size={20} color="white" />
            </Pressable>
            <ModalReportDetail ref={modalRef} title={item.name} data={item.maintance_plans} />
        </Fragment>
    );
};

const options = [
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
        key: "name",
        title: "Hạng mục",
        width: WIDTH - 13 * rem,
    },
    {
        key: "detail",
        title: "Chi tiết công việc",
        width: 10 * rem,
        render: ({ item, index, cellStyle }) => {
            return (
                <View style={cellStyle}>
                    <ModalReportDetailCell item={item} />
                </View>
            );
        },
    },
];

const ReportPlanMaintainance = () => {
    const [filter, setFilter] = useState({
        month: initDate.month,
        year: initDate.year,
        stationCode: "-1",
    });
    const { rData, rIsValidating, mutate } = useReportPlanMaintainance({ ...filter });
    const datas = rData?.datas || [];

    const handleFilter = (filter) => {
        setFilter({
            month: filter.month,
            year: filter.year,
            stationCode: filter.plant.stationCode,
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
                    numberLinesContentCell={6}
                />
            ) : null}
        </View>
    );
};

export default ReportPlanMaintainance;

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
    search: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 6 * unit,
        paddingHorizontal: 16 * unit,
        marginTop: 4 * unit,
        backgroundColor: ColorDefault.primary,
        borderRadius: 6 * unit,
    },
});
