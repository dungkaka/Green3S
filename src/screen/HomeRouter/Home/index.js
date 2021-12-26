import { Color } from "@theme/colors";
import { WIDTH } from "@theme/scale";
import { rem, unit } from "@theme/styleContants";
import { GoogleSansFontType } from "@theme/typography";
import React, { useCallback, useState, useLayoutEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TabView, TabBar, SceneMap, NavigationState, SceneRendererProps, TabBarIndicator } from "react-native-tab-view";
import { Constants } from "react-native-unimodules";
import ErrorsPage from "./ErrorsPage";
import FactoriesPage from "./FactoriesPage";
import ReportPlantYield from "./ReportPlantYield";
import { useRoute } from "@react-navigation/native";

const Home = () => {
    const { params } = useRoute();
    const [state, setState] = useState({
        index: 1,
        routes: [
            { key: "errors", title: "Tổng quan lỗi" },
            { key: "factories", title: "Dashboard" },
            { key: "statistics", title: "Thống kê" },
        ],
    });

    useLayoutEffect(() => {
        if (params?.fromErrorNotification) {
            setState({ ...state, index: 0 });
        }
    }, [params]);

    const renderScene = useCallback(
        SceneMap({
            errors: ErrorsPage,
            factories: FactoriesPage,
            statistics: ReportPlantYield,
        }),
        []
    );

    const renderTabBar = useCallback(
        (props) => (
            <View style={styles.tabBarContainer}>
                <TabBar
                    {...props}
                    scrollEnabled
                    style={styles.tabbar}
                    indicatorStyle={styles.indicator}
                    labelStyle={styles.label}
                    tabStyle={styles.tabStyle}
                    renderLabel={({ route, focused, color }) => (
                        <Text style={[styles.label, { opacity: focused ? 1 : 0.6 }]}>{route.title}</Text>
                    )}
                    pressColor={"transparent"}
                />
            </View>
        ),
        []
    );

    return (
        <TabView
            lazy={true}
            initialLayout={{ width: WIDTH }}
            navigationState={state}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            onIndexChange={(index) => setState({ ...state, index: index })}
        />
    );
};

export default Home;

const styles = StyleSheet.create({
    tabBarContainer: {
        flexDirection: "row",
        justifyContent: "center",
        paddingTop: Constants.statusBarHeight,
        backgroundColor: Color.greenBlueDark,
        elevation: 0,
    },
    tabbar: {
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: Color.greenBlueDark,
        overflow: "hidden",
        elevation: 0,
    },
    indicator: {
        backgroundColor: "white",
        height: 3,
    },
    label: {
        fontFamily: GoogleSansFontType.medium,
        fontSize: 15 * unit,
        paddingHorizontal: rem / 2,
        color: "white",
    },
    tabStyle: {
        width: "auto",
        minHeight: 46,
    },
});
