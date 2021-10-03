import { AppText, AppTextMedium } from "@common-ui/AppText";
import { WIDTH } from "@theme/scale";
import React, { useLayoutEffect, useRef, useState } from "react";
import { LayoutAnimation, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { rem, unit } from "@theme/styleContants";
import FilterDrawer from "./FilterDrawer";
import { useFetchFactory } from "@services/factory";
import Factories from "./Factories";
import { FontAwesome } from "@expo/vector-icons";
import { ColorDefault } from "@theme/index";
import { JumpLogo } from "@common-ui/Loading/JumpLogo";
import { useOnlyDidUpdateLayoutEffect } from "@hooks/useOnlyDidUpdateLayoutEffetct";
import { CacheStorage } from "@utils/local-file-sytem";

const modalWidth = (WIDTH * 2) / 3;

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

    const { data, activeData, error, isValidating, mutate } = useFetchFactory({
        station_name: filter.station_name?.key || "",
        firm: filter.firm?.key || "",
    });

    const displayData = error ? data : activeData;

    useOnlyDidUpdateLayoutEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, [isValidating]);

    const plants = displayData?.plants || [];

    const onFilterPlants = (data) => {
        setFilter(data);
    };

    return (
        <View style={styles.container}>
            {/* Statistic */}
            <View style={styles.headContainer}>
                <AppTextMedium>Tổng: {plants.length}</AppTextMedium>
                <View style={{ flex: 1, paddingHorizontal: rem }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {Object.values(filter).map((i) => {
                            if (!i.key) return null;
                            return <Tag item={i} key={i.value} />;
                        })}
                    </ScrollView>
                </View>
                <Pressable
                    style={styles.filterContainer}
                    onPress={async () => {
                        drawerRef.current.open();
                    }}
                >
                    <FontAwesome name="filter" size={24} color={ColorDefault.primary} style={{ transform: [{ scaleX: -1 }] }} />
                    <AppText style={styles.textFilter}>Lọc</AppText>
                </Pressable>
            </View>

            {/* Loading for fetch data */}
            {isValidating ? (
                <View style={styles.loading}>
                    <JumpLogo size={3 * rem} showDes={false} />
                </View>
            ) : null}

            {/* List of plants */}
            <View style={{ flex: 1 }}>
                <Factories plants={plants} />
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
    },
});
