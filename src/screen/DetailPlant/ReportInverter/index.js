import { AppText, AppTextMedium } from "@common-ui/AppText";
import { rem, unit } from "@theme/styleContants";
import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Color } from "@theme/colors";
import { numberWithCommas, round2 } from "@utils/helps/functions";
import { JumpLogoPage } from "@common-ui/Loading/JumpLogo";
import Filter from "./Filter";
import { usePlantReport, usePlantReportInverter } from "@services/factory";
import ErrorPage from "@common-components/ErrorPage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { time } from "@utils/helps/time";
import TableStickBasicTemplate from "@common-ui/Table/TableStickBasicTemplate";

const dateRange = new Array(31).fill(0).map((_, i) => i);

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
        key: "devName",
        title: "Thiết bị",
        width: 6 * rem,
    },

    ...dateRange.map((_, i) => {
        const key = (i + 1).toString();
        return {
            key: key,
            title: "Ngày " + key,
            width: 5.5 * rem,
            render: ({ item, index, cellStyle }) => (
                <View key={i + 2} style={cellStyle}>
                    <AppText style={styles.contentCell}>{item.device_yields_byId?.[key]?.value}</AppText>
                </View>
            ),
        };
    }),
];

const DPReportInverter = () => {
    const { params } = useRoute();
    const { stationCode } = params ? params : {};

    const [filter, setFilter] = useState({
        stationCode: stationCode,
        date: time().toDateObject(),
    });

    const { rData, rIsValidating, error, mutate } = usePlantReportInverter({ ...filter });
    const { datas } = rData || {};

    const handleFilter = (FILTER) => {
        setFilter({
            ...filter,
            date: FILTER.date,
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
                <ErrorPage />
            ) : rData ? (
                <TableStickBasicTemplate
                    heightRow={60}
                    left={[0, 1]}
                    stickPosition={3 * rem}
                    options={options}
                    data={datas}
                    headerContainerStyle={styles.tableHeaderContainer}
                    textHeaderStyle={styles.tableTextHeader}
                />
            ) : null}
        </View>
    );
};

export default DPReportInverter;

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
    loading: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 2 * rem,
    },

    scrollContainer: {
        flexGrow: 1,
        backgroundColor: Color.backgroundAndroid,
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
