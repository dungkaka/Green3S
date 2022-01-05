import { useNavigation, useRoute } from "@react-navigation/native";
import { Color } from "@theme/colors";
import { rem, unit } from "@theme/styleContants";
import { GoogleSansFontType } from "@theme/typography";
import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import Overview from "./Overview";
import Error from "./Error";
import Statistic from "./Statistic";
import { AppTextMedium } from "@common-ui/AppText";
import { useGoBackHandler } from "@utils/hooks/useGoBackHanlder";
import DeviceHistory from "./DeviceHistory";
import StringAnalysis from "./StringAnalysis";
import Setting from "./Setting";
import { useSettingController } from "@services/device";

const CommingSoon = React.memo(
    () => {
        return (
            <View style={{ flex: 1, backgroundColor: "white", justifyContent: "center", alignItems: "center" }}>
                <AppTextMedium style={{ fontSize: 16 * unit, color: Color.greenBlueDark }}>
                    Tính năng đang phát triển !
                </AppTextMedium>
            </View>
        );
    },
    () => true
);

const Device = () => {
    const { params } = useRoute();
    const navigation = useNavigation();
    const { device } = params ? params : {};

    useGoBackHandler();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Thiết bị " + device?.devName,
        });
    }, []);

    const [state, setState] = useState({
        index: 0,
        routes: [
            { key: "overview", title: "Tổng quan" },
            { key: "statistic", title: "Thống kê" },
            { key: "error", title: "Lỗi" },
            {
                key: "stringAnalysis",
                title: "Phân tích PV",
            },
            {
                key: "setting",
                title: "Cài đặt",
            },
            {
                key: "history",
                title: "Lịch sử thay thế thiết bị",
            },
        ],
    });

    const renderScene = ({ route }) => {
        switch (route.key) {
            case "overview":
                return <Overview />;
            case "statistic":
                return <Statistic />;
            case "error":
                return <Error />;
            case "stringAnalysis":
                return <StringAnalysis />;
            case "setting":
                return <Setting />;
            case "history":
                return <CommingSoon />;
            default:
                return <CommingSoon />;
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
            swipeEnabled={false}
        />
    );
};

export default Device;

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
        // width: 0.6,
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
