import { AppText } from "@common-ui/AppText";
import { rem, unit } from "@theme/styleContants";
import React, { useMemo, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Color } from "@theme/colors";
import { time } from "@utils/helps/time";
import { round2 } from "@utils/helps/functions";
import { JumpLogoPage } from "@common-ui/Loading/JumpLogo";
import Filter from "./Filter";
import { useFetchErrorDisconnect } from "@services/error";
import TableStickBasicTemplate from "@common-ui/Table/TableStickBasicTemplate";
import { useNavigation } from "@react-navigation/native";
import { NAVIGATION } from "constant/navigation";

const ErrorDisconnect = () => {
    const navigation = useNavigation();
    const [filter, setFilter] = useState({
        stationCode: "",
    });
    const { rData, rIsValidating, mutate } = useFetchErrorDisconnect({ ...filter });
    const datas = rData?.datas || [];

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
                key: "station",
                title: "Nhà máy",
                width: 6 * rem,
                render: ({ item, index, cellStyle }) => (
                    <TouchableOpacity
                        key={1}
                        onPress={() =>
                            item.factory &&
                            navigation.navigate(NAVIGATION.DETAIL_PLANT, {
                                ...item.factory,
                            })
                        }
                        activeOpacity={0.8}
                        style={cellStyle}
                    >
                        <AppText style={styles.contentCellPress}>{item.factory?.stationName}</AppText>
                    </TouchableOpacity>
                ),
            },
            {
                key: "device",
                title: "Thiết bị",
                width: 5 * rem,
                render: ({ item, index, cellStyle }) => (
                    <TouchableOpacity
                        key={2}
                        onPress={() =>
                            item.factory &&
                            navigation.navigate(NAVIGATION.DETAIL_DEVICE, {
                                device: item.device,
                            })
                        }
                        activeOpacity={0.8}
                        style={cellStyle}
                    >
                        <AppText style={styles.contentCellPress}>{item.device?.devName}</AppText>
                    </TouchableOpacity>
                ),
            },
            { key: "created_at", title: "Thời gian xuất hiện", width: 16 * rem },
        ],
        []
    );

    const handleFilter = (filter) => {
        setFilter({
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
                    numberLinesContentCell={5}
                />
            ) : null}
        </View>
    );
};

export default ErrorDisconnect;

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
    contentCellPress: {
        fontSize: 13 * unit,
        textAlign: "center",
        color: Color.blueDark,
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
