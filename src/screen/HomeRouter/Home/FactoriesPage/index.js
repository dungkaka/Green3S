import { AppText, AppTextMedium } from "@common-ui/AppText";
import { WIDTH } from "@theme/scale";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LayoutAnimation, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { rem, unit } from "@theme/styleContants";
import FilterDrawer from "./FilterDrawer";
import { useSearchFactory } from "@services/factory";
import Factories from "./Factories";
import { FontAwesome } from "@expo/vector-icons";
import { ColorDefault } from "@theme/index";
import { JumpLogo, JumpLogoPageOverlay } from "@common-ui/Loading/JumpLogo";
import { useOnlyDidUpdateLayoutEffect } from "@hooks/useOnlyDidUpdateLayoutEffetct";
import FastAction from "./FastAction";
import Animated, {
    Extrapolate,
    interpolate,
    measure,
    useAnimatedRef,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
} from "react-native-reanimated";
import { Color } from "@theme/colors";
import { useUser } from "@services/user";

const Tag = ({ item }) => {
    return (
        <View style={styles.tag}>
            <AppText style={{ color: "white", fontSize: 12 * unit }}>{item?.value}</AppText>
        </View>
    );
};

const FactoriesPage = () => {
    const drawerRef = useRef();
    const [filter, setFilter] = useState({});
    const scrollValue = useSharedValue(0);
    const viewLayoutRef = useRef([]).current;
    const [viewLayoutY, setViewLayoutY] = useState();
    const { isEmployee: isShowShortcut } = useUser();

    const measureY = (e, index) => {
        viewLayoutRef[index] = { y: e.nativeEvent.layout.y, h: e.nativeEvent.layout.height };
        if (viewLayoutRef[1] && (!isShowShortcut || viewLayoutRef[0])) {
            setViewLayoutY(viewLayoutRef);
        }
    };

    const { data, activeData, error, isValidating, mutate } = useSearchFactory({
        station_name: filter.station_name?.key || "",
        firm: filter.firm?.key || "",
    });

    const displayData = error ? data : activeData;

    // useOnlyDidUpdateLayoutEffect(() => {
    //     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    // }, [isValidating]);

    const plants = displayData?.plants || [];

    const onFilterPlants = (data) => {
        setFilter(data);
    };

    const factoriesAnimated = useAnimatedStyle(() => {
        if (!viewLayoutY) return {};

        const translateY = interpolate(scrollValue.value, [0, viewLayoutY[1].y], [0, -viewLayoutY[1].y], Extrapolate.CLAMP);
        return {
            transform: [
                {
                    translateY: translateY,
                },
            ],
        };
    }, [viewLayoutY]);

    const filterArrayValue = Object.values(filter).filter((item) => item.key);

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    { position: "absolute", top: 0, left: 0, right: 0, backgroundColor: Color.backgroundAndroid },
                    factoriesAnimated,
                ]}
            >
                {isShowShortcut && (
                    <View onLayout={(e) => measureY(e, 0)} style={{ marginBottom: 10, backgroundColor: "white" }}>
                        <FastAction />
                    </View>
                )}

                {/* Statistic */}
                <View onLayout={(e) => measureY(e, 1)} style={styles.headContainer}>
                    <Pressable onPress={() => mutate()}>
                        <AppTextMedium>Tổng: {plants.length}</AppTextMedium>
                    </Pressable>

                    <View style={{ flex: 1, paddingHorizontal: rem }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {filterArrayValue.length == 0 ? (
                                <Tag item={{ value: "Tất cả" }} key="all" />
                            ) : (
                                filterArrayValue.map((i) => {
                                    return <Tag item={i} key={i.value} />;
                                })
                            )}
                        </ScrollView>
                    </View>
                    <Pressable
                        style={styles.filterContainer}
                        onPress={async () => {
                            drawerRef.current.open();
                        }}
                    >
                        <FontAwesome
                            name="filter"
                            size={24}
                            color={ColorDefault.primary}
                            style={{ transform: [{ scaleX: -1 }] }}
                        />
                        <AppText style={styles.textFilter}>Lọc</AppText>
                    </Pressable>
                </View>
            </Animated.View>

            {/* List of plants */}
            <View style={{ flex: 1, zIndex: -1 }}>
                {/* Loading for fetch data */}
                {isValidating ? <JumpLogoPageOverlay /> : null}
                {viewLayoutY && (
                    <Factories plants={plants} scrollValue={scrollValue} paddingTop={viewLayoutY[1].y + viewLayoutY[1].h} />
                )}
            </View>

            <FilterDrawer drawerRef={drawerRef} onConfirm={onFilterPlants} />
        </View>
    );
};

export default React.memo(FactoriesPage, () => true);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    headContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12 * unit,
        backgroundColor: "white",
    },
    tag: {
        marginRight: 6 * unit,
        paddingHorizontal: 12 * unit,
        paddingVertical: 4 * unit,
        borderRadius: 20 * unit,
        backgroundColor: ColorDefault.primary,
    },
    filterContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        marginEnd: 4,
    },
    textFilter: {
        fontSize: 12 * unit,
        color: ColorDefault.primary,
    },
    loading: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 2 * rem,
        backgroundColor: "white",
    },
});
