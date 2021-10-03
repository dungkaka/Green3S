import { AppText, AppTextBold, AppTextMedium } from "@common-ui/AppText";
import { useNavigation } from "@react-navigation/native";
import { Color } from "@theme/colors";
import { rem, unit } from "@theme/styleContants";
import { round2 } from "@utils/helps/functions";
import { NAVIGATION } from "constant/navigation";
import React, { Fragment, useCallback, useRef } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import ModalRealTimeDevice from "./ModalRealtimeDevice";

const Factories = ({ plants = [] }) => {
    const modalRef = useRef();
    const navigation = useNavigation();

    const renderItem = useCallback(({ item, index }) => {
        const {
            stationName,
            stationAddr,
            capacity,
            stationCode,
            factory_info_real_time: [realTimeData],
        } = item;

        return (
            <Pressable style={styles.itemContainer} onPress={() => showDetailPlant(item)}>
                <Pressable
                    style={styles.itemImage}
                    onPress={() => {
                        navigation.navigate(NAVIGATION.DETAIL_PLANT, {
                            stationName,
                            stationCode,
                        });
                    }}
                />
                <View style={{ flex: 1, marginLeft: 12 * unit }}>
                    <View style={styles.itemTitleContainer}>
                        <Svg viewBox="0 0 24 24" height={8} width={8}>
                            <Circle cx="12" cy="12" r="12" stroke-width="3" fill={Color.greenBlue} />
                        </Svg>
                        <AppTextMedium style={styles.itemTitle}>{stationName}</AppTextMedium>
                    </View>

                    <AppText numberOfLines={1} style={styles.itemAddr}>
                        {stationAddr}
                    </AppText>

                    <View style={styles.itemStateContainer}>
                        <AppTextBold style={{ fontSize: 13, color: Color.purple }}>C: </AppTextBold>
                        <AppText style={{ fontSize: 13, paddingRight: rem, color: Color.purple }}>
                            {round2(realTimeData.capacity_today / 1000)} MWP
                        </AppText>

                        <AppTextBold style={{ fontSize: 13, color: Color.blueModern_2 }}>P: </AppTextBold>
                        <AppText style={{ fontSize: 13, paddingRight: rem, color: Color.blueModern_2 }}>
                            {round2(realTimeData.yield_today / 1000)} MWH
                        </AppText>

                        <AppTextBold style={{ fontSize: 13, color: Color.redOrange }}>S: </AppTextBold>
                        <AppText style={{ fontSize: 13, paddingRight: rem, color: Color.redOrange }}>
                            {round2(realTimeData.yield_total / 1000000)} GWH
                        </AppText>
                    </View>
                </View>
            </Pressable>
        );
    }, []);

    const showDetailPlant = (plant) => {
        modalRef.current.open({ plant });
    };

    return (
        <Fragment>
            <FlatList
                style={{ paddingBottom: rem, paddingHorizontal: rem }}
                data={plants}
                keyExtractor={(plant, i) => plant.stationCode}
                renderItem={renderItem}
                initialNumToRender={8}
            />

            <ModalRealTimeDevice ref={modalRef} />
        </Fragment>
    );
};

export default Factories;

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: "row",
        paddingVertical: 14 * unit,
        borderBottomColor: Color.gray_1,
        borderBottomWidth: 1,
    },
    itemImage: {
        height: 64,
        width: 64,
        backgroundColor: "#ddd",
        borderRadius: 6 * unit,
    },
    itemTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    itemTitle: {
        paddingHorizontal: 12 * unit,
    },
    itemAddr: {
        flex: 1,
        fontSize: 12 * unit,
        color: Color.gray_8,
    },
    itemStateContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-end",
    },
});
