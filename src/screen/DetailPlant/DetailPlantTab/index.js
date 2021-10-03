import { useNavigation, useRoute } from "@react-navigation/native";
import { Color } from "@theme/colors";
import { rem, unit } from "@theme/styleContants";
import { GoogleSansFontType } from "@theme/typography";
import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import PlantInfo from "./PlantInfo";
import ListDevices from "./ListDevices";
import General from "./General";
import Statistic from "./Statistic";
import Supplies from "./Supplies";

const DetailPlantTab = () => {
    const { params } = useRoute();
    const navigation = useNavigation();
    const { stationName } = params ? params : {};

    useLayoutEffect(() => {
        navigation.setOptions({
            title: stationName,
        });
    }, []);

    const [state, setState] = useState({
        index: 0,
        routes: [
            { key: "general", title: "Tổng quan" },
            { key: "statistics", title: "Thống kê" },
            { key: "devices", title: "Thiết bị" },
            { key: "info", title: "Thông tin" },
            { key: "supplies", title: "Vật tư" },
        ],
    });

    const renderScene = ({ route }) => {
        switch (route.key) {
            case "general":
                return <General />;
            case "statistics":
                return <Statistic />;
            case "info":
                return <PlantInfo />;
            case "devices":
                return <ListDevices />;
            case "supplies":
                return <Supplies />;
            default:
                return null;
        }
    };

    const renderTabBar = (props) => (
        <View style={styles.tabBarContainer}>
            <TabBar
                {...props}
                scrollEnabled
                style={styles.tabbar}
                indicatorStyle={styles.indicator}
                labelStyle={styles.label}
                tabStyle={styles.tabStyle}
                renderLabel={({ route, focused, color }) => {
                    return <Text style={[styles.label, { opacity: focused ? 1 : 0.6 }]}>{route.title}</Text>;
                }}
                pressColor={"transparent"}
            />
        </View>
    );

    return (
        <TabView
            lazy={true}
            navigationState={state}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            onIndexChange={(index) => {
                requestAnimationFrame(() => {
                    setState({ ...state, index: index });
                });
            }}
            // swipeEnabled={false}
        />
    );
};

export default DetailPlantTab;

const styles = StyleSheet.create({
    tabBarContainer: {
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: Color.greenBlueDark,
        overflow: "visible",
    },
    tabbar: {
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: Color.greenBlueDark,
        // overflow: "hidden",
        elevation: 0,
    },
    indicator: {
        backgroundColor: "white",
        height: 3,
        // width: 0.8,
    },
    label: {
        fontFamily: GoogleSansFontType.medium,
        fontSize: 15 * unit,
        paddingHorizontal: rem / 2,
        color: "white",
    },
    tabStyle: {
        width: "auto",
        minHeight: 38,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        paddingHorizontal: 12,
        paddingTop: 0,
    },
});
