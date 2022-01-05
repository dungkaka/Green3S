import { AppText, AppTextBold, AppTextMedium } from "@common-ui/AppText";
import { useNavigation } from "@react-navigation/native";
import { Color } from "@theme/colors";
import { rem, unit } from "@theme/styleContants";
import { GoogleSansFontType } from "@theme/typography";
import { round2 } from "@utils/helps/functions";
import { NAVIGATION } from "constant/navigation";
import React, { Fragment, useCallback, useRef } from "react";
import { FlatList, Image, Platform, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import ModalRealTimeDevice from "./ModalRealtimeDevice";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const Factory = React.memo(({ item = {}, index, navigation, showDetailPlant }) => {
    const {
        stationName,
        stationAddr,
        capacity,
        stationCode,
        factory_info_real_time: [realTimeData = {}],
    } = item;

    const toStatus = () => {
        switch (realTimeData.real_health_state) {
            case 3:
                return {
                    title: "Hoạt động",
                    color: Color.greenBlue,
                };
            case -1:
                return {
                    title: "Không xác định",
                    color: Color.orangeDark,
                };
            default:
                return {
                    title: "Ngoại tuyến",
                    color: Color.gray_7,
                };
        }
    };

    const status = toStatus();

    const image = Math.floor(Math.random() * 3) + 1;

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
            >
                <Image
                    source={
                        image == 1
                            ? require("@assets/images/factory_thumb.jpg")
                            : image == 2
                            ? require("@assets/images/factory_thumb_1.jpg")
                            : require("@assets/images/factory_thumb_2.jpg")
                    }
                    style={styles.facImage}
                    resizeMode="cover"
                />
            </Pressable>
            <View style={{ flex: 1, marginLeft: 12 * unit }}>
                <View style={styles.itemTitleContainer}>
                    <AppTextMedium style={styles.itemTitle} numberOfLines={2}>
                        {stationName}
                    </AppTextMedium>
                    <Svg viewBox="0 0 24 24" height={8} width={8}>
                        <Circle cx="11" cy="11" r="11" stroke-width="3" fill={status.color} />
                    </Svg>
                    <Text style={[styles.titleStatus, { color: status.color }]}>{status.title}</Text>
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
});

const Factories = ({ plants = [], scrollValue, paddingTop, revalidate = () => {} }) => {
    const modalRef = useRef();
    const navigation = useNavigation();

    const renderItem = ({ item, index }) => (
        <Factory item={item} index={index} key={index} showDetailPlant={showDetailPlant} navigation={navigation} />
    );

    const showDetailPlant = useCallback((plant) => {
        modalRef.current.open({ plant });
    }, []);

    const scrollHandler = useAnimatedScrollHandler((event) => {
        scrollValue.value = event.contentOffset.y;
    });

    return (
        <Fragment>
            <AnimatedFlatList
                windowSize={5}
                initialNumToRender={6}
                scrollEventThrottle={16}
                contentContainerStyle={{
                    backgroundColor: "white",
                    paddingTop: Platform.OS == "ios" ? 0 : paddingTop,
                    paddingBottom: rem,
                    paddingHorizontal: rem,
                }}
                data={plants}
                keyExtractor={(plant, i) => plant.stationCode}
                renderItem={renderItem}
                initialNumToRender={8}
                onScroll={scrollHandler}
                contentInset={{ top: Platform.OS == "ios" ? paddingTop : 0 }}
                refreshControl={
                    <RefreshControl
                        progressViewOffset={Platform.OS == "ios" ? 50 : paddingTop}
                        refreshing={false}
                        onRefresh={revalidate}
                    />
                }
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
        height: 60,
        width: 60,
        backgroundColor: "#ddd",
        borderRadius: 6 * unit,
        overflow: "hidden",
        elevation: 1,
    },
    facImage: {
        width: "100%",
        height: "100%",
    },
    itemTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    itemTitle: {
        flex: 1,
        paddingRight: 12 * unit,
    },
    titleStatus: {
        paddingLeft: 5 * unit,
        fontSize: 12 * unit,
        fontFamily: GoogleSansFontType.italic,
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
