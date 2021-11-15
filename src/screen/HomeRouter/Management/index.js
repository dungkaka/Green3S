import { AppText, AppTextMedium } from "@common-ui/AppText";
import Select from "@common-ui/Form/Select";
import { useNavigation } from "@react-navigation/native";
import { Color } from "@theme/colors";
import { rem, unit } from "@theme/styleContants";
import { NAVIGATION } from "constant/navigation";
import React, { useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Constants from "expo-constants";
import { ColorDefault } from "@theme";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

const Management = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.headerBlock}>
                <AppTextMedium style={styles.headerTitle}>Quản lý</AppTextMedium>
            </View>

            <View style={[styles.block, { marginTop: 0 }]}>
                <View style={styles.blockTitle}>
                    <AppTextMedium style={styles.blockTitleText}>Báo cáo</AppTextMedium>
                </View>

                <View style={styles.reportContainer}>
                    <Ionicons name="document-text-outline" size={28} color={Color.greenBlueDark} />
                    <Pressable
                        onPress={() => navigation.navigate(NAVIGATION.REPORT_PLANT_YIELD)}
                        style={styles.itemReportContainer}
                    >
                        <AppText style={styles.textItemReport}>Nhà máy</AppText>
                    </Pressable>
                </View>
                <View style={styles.reportContainer}>
                    <Ionicons name="document-text-outline" size={28} color={Color.greenBlueDark} />
                    <Pressable
                        onPress={() => navigation.navigate(NAVIGATION.REPORT_MAINTENANCE)}
                        style={styles.itemReportContainer}
                    >
                        <AppText style={styles.textItemReport}>Bảo trì</AppText>
                    </Pressable>
                </View>
                <View style={styles.reportContainer}>
                    <Ionicons name="document-text-outline" size={28} color={Color.greenBlueDark} />
                    <Pressable
                        onPress={() => navigation.navigate(NAVIGATION.REPORT_PLAN_MAINTENANCE)}
                        style={[styles.itemReportContainer, { borderBottomWidth: 0 }]}
                    >
                        <AppText style={styles.textItemReport}>Kế hoạch bảo trì</AppText>
                    </Pressable>
                </View>
            </View>
            <View style={styles.block}>
                <View style={styles.blockTitle}>
                    <AppTextMedium style={styles.blockTitleText}>Quản lý vật tư</AppTextMedium>
                </View>

                <View style={styles.reportContainer}>
                    <AntDesign name="database" size={28} color={Color.greenBlueDark} />
                    <Pressable
                        onPress={() => navigation.navigate(NAVIGATION.MATERIAL)}
                        style={[styles.itemReportContainer, { borderBottomWidth: 0 }]}
                    >
                        <AppText style={styles.textItemReport}>Danh sách vật tư</AppText>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

export default Management;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerBlock: {
        paddingTop: Constants.statusBarHeight + 2 * rem,
        paddingBottom: rem,
        paddingHorizontal: 16 * unit,
        backgroundColor: "white",
    },
    headerTitle: {
        fontSize: 24 * unit,
        color: Color.gray_11,
    },
    block: {
        paddingVertical: 14 * unit,
        paddingHorizontal: 16 * unit,
        marginTop: 10 * unit,
        backgroundColor: "white",
    },
    blockTitleText: {
        fontSize: 16 * unit,
        color: Color.gray_11,
    },
    blockTitle: {
        flexDirection: "row",
        paddingVertical: 12 * unit,
    },
    reportContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 2 * unit,
    },
    itemReportContainer: {
        marginVertical: rem / 2,
        marginLeft: rem,
        paddingVertical: 8 * unit,
        paddingHorizontal: 24 * unit,
        backgroundColor: ColorDefault.primary,
        borderRadius: 50,
    },
    textItemReport: {
        fontSize: 15 * unit,
        color: "white",
    },
});
