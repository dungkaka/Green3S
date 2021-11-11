import { AppText } from "@common-ui/AppText";
import { rem, unit } from "@theme/styleContants";
import React, { useRef, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { Color } from "@theme/colors";
import { time } from "@utils/helps/time";
import { JumpLogoPage } from "@common-ui/Loading/JumpLogo";
import { useCategoryMaintainance } from "@services/maintenance";
import TableStickBasicTemplate from "@common-ui/Table/TableStickBasicTemplate";
import { WIDTH } from "@theme/scale";

const initDate = time().toDateObject();

const options = [
    {
        key: "order",
        title: "STT",
        width: 3 * rem,
        render: ({ item, index, defaultBlockStyle }) => (
            <View key={1} style={defaultBlockStyle}>
                <AppText style={styles.contentCell}>{index + 1}</AppText>
            </View>
        ),
    },
    {
        key: "name",
        title: "Tên hạng mục",
        width: WIDTH - 3 * rem,
        render: ({ item, index, defaultBlockStyle }) => (
            <View key={0} style={[defaultBlockStyle, { alignItems: "flex-start", paddingLeft: 1.5 * rem }]}>
                <AppText style={styles.contentCell}>{item.name}</AppText>
            </View>
        ),
    },
];

const MaintainanceCategory = () => {
    const [filter, setFilter] = useState({});
    const { rData, rIsValidating, mutate } = useCategoryMaintainance({ ...filter });
    const datas = rData?.datas || [];

    // const handleFilter = (filter) => {
    //     setFilter({
    //         month: filter.month,
    //         year: filter.year,
    //         stationCode: filter.plant.stationCode,
    //         nameWork: filter.nameWork,
    //     });
    // };

    return (
        <View style={styles.container}>
            {/* <Filter filter={filter} handleFilter={handleFilter} /> */}

            {rIsValidating ? (
                <View style={{ flex: 1, backgroundColor: "white" }}>
                    <JumpLogoPage />
                </View>
            ) : rData ? (
                <TableStickBasicTemplate
                    heightRow={60}
                    left={[0, 1]}
                    stickPosition={3 * rem}
                    options={options}
                    data={datas}
                    headerContainerStyle={styles.tableHeaderContainer}
                    textHeaderStyle={styles.tableTextHeader}
                    numberLinesContentCell={2}
                />
            ) : null}
        </View>
    );
};

export default MaintainanceCategory;

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
    tableHeaderContainer: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: Color.gray_2,
    },

    tableTextHeader: {
        color: Color.gray_11,
    },
});
