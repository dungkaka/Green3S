import { AppText } from "@common-ui/AppText";
import { rem, unit } from "@theme/styleContants";
import React, { Fragment, useRef, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { Color } from "@theme/colors";
import { time } from "@utils/helps/time";
import { JumpLogoPage } from "@common-ui/Loading/JumpLogo";
import Filter from "./Filter";
import TableStickBasicTemplate from "@common-ui/Table/TableStickBasicTemplate";
import { useRoute } from "@react-navigation/native";
import { useDeviceOverview } from "@services/device";

const PotentialError = () => {
    const { params } = useRoute();
    const { device } = params ? params : {};

    const [filter, setFilter] = useState(
        (() => {
            const initDate = time().toDateObject();
            return {
                date: { ...initDate, minute: Math.floor(initDate.minute / 5) * 5, second: 0 },
                deviceId: device.device_id,
            };
        })()
    );
    const { rData, rIsValidating, mutate } = useDeviceOverview({ ...filter });
    const datas = rData?.dataDevices || [];

    const handleFilter = (filter) => {
        setFilter({
            date: filter.date,
            deviceId: device.device_id,
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
                <Fragment>
                    <TableStickBasicTemplate
                        heightRow={56}
                        left={[0, 1]}
                        stickPosition={3 * rem}
                        options={options}
                        data={datas}
                        headerContainerStyle={styles.tableHeaderContainer}
                        textHeaderStyle={styles.tableTextHeader}
                        numberLinesContentCell={2}
                        // containerStyle={{
                        //     flex: 0,
                        // }}
                    />
                    <View style={{}}>
                        <AppText>HELLo</AppText>
                        <AppText>HELLo</AppText>
                        <AppText>HELLo</AppText>
                    </View>
                </Fragment>
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
