import TableStickBasicTemplate from "@common-ui/Table/TableStickBasicTemplate";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Color } from "@theme/colors";
import { WIDTH } from "@theme/scale";
import { rem, unit } from "@theme/styleContants";
import { GoogleSansFontType } from "@theme/typography";
import { format } from "@utils/helps/time";
import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TabView, TabBar, TabBarIndicator } from "react-native-tab-view";
import TabErrorAC from "./TabAC";
import TabErrorDC from "./TabDC";
import TabPerformance from "./TabPerformance";

const TabErrors = ({ data = {}, filter = {} }) => {
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
                return <TabErrorAC filter={filter} />;
            case "dc":
                return <TabErrorDC filter={filter} />;
            case "performance":
                return <TabPerformance filter={filter} />;
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
                renderIndicator={(indicatorProps) => {
                    const width = indicatorProps.getTabWidth(state.index);
                    return (
                        <TabBarIndicator
                            {...indicatorProps}
                            width={width * 0.6}
                            style={[styles.indicator, { left: width * 0.2 }]}
                        />
                    );
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
            swipeEnabled={false}
        />
    );
};

export default TabErrors;

const styles = StyleSheet.create({
    tabBarContainer: {
        flexDirection: "row",
        justifyContent: "center",
    },
    tabbar: {
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "white",
        elevation: 0,
    },
    indicator: {
        backgroundColor: Color.greenBlue,
        height: 2,
        // width: 0.8,
    },
    label: {
        fontFamily: GoogleSansFontType.medium,
        fontSize: 14 * unit,
        paddingHorizontal: 4,
        color: Color.gray_10,
    },
    tabStyle: {
        width: "auto",
        // minWidth: 100,
        minHeight: 38,
        paddingHorizontal: 12,
    },
});
