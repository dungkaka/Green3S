import { AppText, AppTextMedium } from "@common-ui/AppText";
import { rem, unit } from "@theme/styleContants";
import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Color } from "@theme/colors";
import { numberWithCommas, round2 } from "@utils/helps/functions";
import { JumpLogoPage } from "@common-ui/Loading/JumpLogo";
import Filter from "./Filter";
import { usePlantReport } from "@services/factory";
import ErrorPage from "@common-components/ErrorPage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { time } from "@utils/helps/time";
import TableStickBasicTemplate from "@common-ui/Table/TableStickBasicTemplate";

const DPReportFactory = () => {
    const { params } = useRoute();
    const { stationCode } = params ? params : {};

    const [filter, setFilter] = useState({
        stationCode: stationCode,
        date: time().toDateObject(),
    });

    const { rData, rIsValidating, error, mutate } = usePlantReport({ ...filter });
    const { datas, revenue, capacity } = rData || {};

    const max_yield = datas?.reduce((_1, _2) => (_1.yield_today > _2.yield_today ? _1 : _2))?.yield_today;

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
            title: "Thời gian",
            width: 7 * rem,
        },
        {
            key: "yield_today",
            title: "Sản lượng PV (KWH)",
            width: 8 * rem,
        },
        {
            key: "yield",
            title: "Sản lượng nạp (KWH)",
            width: 8 * rem,
        },
        {
            key: "max_yield",
            title: "Sản lượng đỉnh",
            width: 8 * rem,
            render: ({ item, index, defaultBlockStyle }) => {
                if (item.yield_today == max_yield)
                    return (
                        <View key={4} style={[defaultBlockStyle, { backgroundColor: Color.blueModern_1 }]}>
                            <AppTextMedium style={[styles.contentCell, { color: "white" }]}>{max_yield}</AppTextMedium>
                        </View>
                    );
                return <View key={4} style={defaultBlockStyle} />;
            },
        },
        {
            key: "TL",
            title: "TL chuyển đổi",
            width: 8 * rem,
            render: ({ item, index, defaultBlockStyle }) => (
                <View key={5} style={defaultBlockStyle}>
                    <AppText style={styles.contentCell}>{round2(item.yield_today / capacity)}</AppText>
                </View>
            ),
        },
        {
            key: "sum",
            title: "Doanh thu (€)",
            width: 10 * rem,
            render: ({ item, index, defaultBlockStyle }) => (
                <View key={6} style={defaultBlockStyle}>
                    <AppText style={styles.contentCell}>{numberWithCommas(round2(item.yield_today * revenue), ",")}</AppText>
                </View>
            ),
        },
    ];

    const handleFilter = (filter) => {
        setFilter({
            ...filter,
            date: filter.date,
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

export default DPReportFactory;

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
