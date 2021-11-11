import { AppText } from "@common-ui/AppText";
import { rem, unit } from "@theme/styleContants";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Color } from "@theme/colors";
import { time } from "@utils/helps/time";
import { JumpLogoPage } from "@common-ui/Loading/JumpLogo";
import Filter from "./Filter";
import { useFetchError } from "@services/device";
import { useRoute } from "@react-navigation/native";
import TabErrors from "./TabErrors";

const initDate = time().toDateObject();

const Error = () => {
    const { params } = useRoute();
    const { device } = params ? params : {};

    const [filter, setFilter] = useState({
        date: initDate,
        deviceId: device.device_id,
    });
    const { rData, rIsValidating, mutate } = useFetchError({ ...filter });

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
                <TabErrors data={rData.datas} />
            ) : null}
        </View>
    );
};

export default React.memo(Error, () => true);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },

    contentCell: {
        fontSize: 13 * unit,
        textAlign: "center",
    },

    contentCellString: {
        fontSize: 13 * unit,
        textAlign: "center",
        color: "white",
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
        backgroundColor: Color.redPastelDark,
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
