import TableStickBasicTemplate from "@common-ui/Table/TableStickBasicTemplate";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Color } from "@theme/colors";
import { rem, unit } from "@theme/styleContants";
import { GoogleSansFontType } from "@theme/typography";
import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import TabErrorAC from "./TabAC";
import TabErrorDC from "./TabDC";
import TabPerformance from "./TabPerformance";

const TabErrors = ({ data = {} }) => {
    const { params } = useRoute();
    const navigation = useNavigation();
    const { device } = params ? params : {};

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Thiết bị " + device?.devName,
        });
    }, []);

    const [state, setState] = useState({
        index: 0,
        routes: [
            { key: "ac", title: "Lỗi AC" },
            { key: "dc", title: "Lỗi DC" },
            { key: "performance", title: "Hiệu suất" },
        ],
    });

    const renderScene = ({ route }) => {
        switch (route.key) {
            case "ac":
                return (
                    <TabErrorAC
                        data={[
                            ...(data["grid high"] || []),
                            ...(data["grid low"] || []),
                            ...(data.miss || []),
                            ...(data.phase_unbalance || []),
                        ]}
                    />
                );
            case "dc":
                return <TabErrorDC data={data.dc} />;
            case "performance":
                return <TabPerformance data={data.performance_low} />;
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
            // swipeEnabled={true}
        />
    );
};

export default TabErrors;

const styles = StyleSheet.create({
    tabBarContainer: {
        flexDirection: "row",
        justifyContent: "center",
        overflow: "visible",
    },
    tabbar: {
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "white",
        // overflow: "hidden",
        elevation: 0,
    },
    indicator: {
        backgroundColor: Color.greenBlue,
        height: 2,
        // width: 0.8,
    },
    label: {
        fontFamily: GoogleSansFontType.medium,
        fontSize: 15 * unit,
        paddingHorizontal: rem / 2,
        color: Color.gray_10,
    },
    tabStyle: {
        width: "auto",
        minWidth: 100,
        minHeight: 38,
        paddingHorizontal: 12,
    },
});
