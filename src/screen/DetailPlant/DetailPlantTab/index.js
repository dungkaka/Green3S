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
import DPMaterialUsed from "./MaterialUsed";
import DPMaterial from "./Material";
import { AppTextMedium } from "@common-ui/AppText";
import { useGoBackHandler } from "@utils/hooks/useGoBackHanlder";

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

const DetailPlantTab = () => {
    const { params } = useRoute();
    const navigation = useNavigation();
    const { stationName } = params ? params : {};

    useGoBackHandler();

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
            { key: "material", title: "Vật tư" },
            { key: "materialUsed", title: "Vật tư sử dụng" },
            { key: "info", title: "Thông tin" },
            { key: "alalylist", title: "Phân tích hiệu suất theo hướng" },
        ],
    });

    const renderScene = ({ route }) => {
        switch (route.key) {
            case "general":
                return <General />;
            case "statistics":
                return <Statistic />;
            case "devices":
                return <ListDevices />;
            case "material":
                return <DPMaterial />;
            case "materialUsed":
                return <DPMaterialUsed />;
            case "info":
                return <PlantInfo />;
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
