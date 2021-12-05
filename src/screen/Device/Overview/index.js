import { AppText } from "@common-ui/AppText";
import { rem, unit } from "@theme/styleContants";
import React, { Fragment, useRef, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Color } from "@theme/colors";
import { time } from "@utils/helps/time";
import { JumpLogoPage } from "@common-ui/Loading/JumpLogo";
import Filter from "./Filter";
import TableStickBasicTemplate from "@common-ui/Table/TableStickBasicTemplate";
import { useRoute } from "@react-navigation/native";
import { useDeviceOverview } from "@services/device";
import HUAWEIDevice from "./HUAWEIDevice";
import SMADevice from "./SMADevice";

const Overview = () => {
    const { params } = useRoute();
    const { device, initTime } = params ? params : {};

    const [filter, setFilter] = useState(
        (() => {
            const initDate = time(initTime || new Date(Date.now() - 1000 * (60 * 10))).toDateObject();
            return {
                date: { ...initDate, minute: Math.floor(initDate.minute / 5) * 5, second: 0 },
                deviceId: device.device_id,
            };
        })()
    );
    const { rData, rIsValidating, mutate } = useDeviceOverview({ ...filter });

    const firmId = rData?.device?.factory.cpt_firm_id;

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
                <ScrollView style={styles.scrollContainer}>
                    {firmId == 1 ? <HUAWEIDevice data={rData} /> : firmId == 2 ? <SMADevice data={rData} /> : null}
                </ScrollView>
            ) : null}
        </View>
    );
};

export default React.memo(Overview, () => true);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: Color.backgroundAndroid,
    },
});
