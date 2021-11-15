import { AppText, AppTextMedium } from "@common-ui/AppText";
import Select from "@common-ui/Form/Select";
import { useNavigation } from "@react-navigation/native";
import { Color, PairColor } from "@theme/colors";
import { rem, unit } from "@theme/styleContants";
import { NAVIGATION } from "constant/navigation";
import React, { useRef } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Constants from "expo-constants";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

const colorError = "#c24453";

const Maintain = () => {
    const navigation = useNavigation();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerBlock}>
                <AppTextMedium style={styles.headerTitle}>Bảo trì</AppTextMedium>
            </View>

            <View style={[styles.block, { marginTop: 0 }]}>
                <View style={styles.reportContainer}>
                    <Pressable
                        onPress={() => navigation.navigate(NAVIGATION.ALLE_ERROR)}
                        style={styles.filterAllErrorContainer}
                    >
                        <FontAwesome name="filter" size={18} color="white" />
                        <AppText style={styles.textItemReport}>Bộ lọc tất cả lỗi</AppText>
                    </Pressable>
                </View>
            </View>

            <View style={styles.block}>
                <AppTextMedium style={styles.blockTitle}>Cảnh báo</AppTextMedium>
                <View style={styles.blockContent}>
                    <View style={styles.reportContainer}>
                        <MaterialIcons name="error-outline" size={28} color={colorError} />
                        <Pressable
                            onPress={() => navigation.navigate(NAVIGATION.ERROR_AC)}
                            style={[styles.itemReportContainer, { backgroundColor: colorError }]}
                        >
                            <AppText style={styles.textItemReport}>Lỗi AC</AppText>
                        </Pressable>
                    </View>
                    <View style={styles.reportContainer}>
                        <MaterialIcons name="error-outline" size={28} color={colorError} />
                        <Pressable
                            onPress={() => navigation.navigate(NAVIGATION.ERROR_DC)}
                            style={[styles.itemReportContainer, { backgroundColor: colorError }]}
                        >
                            <AppText style={styles.textItemReport}>Lỗi DC</AppText>
                        </Pressable>
                    </View>
                    {/* <View style={styles.reportContainer}>
                        <MaterialIcons name="error-outline" size={28} color={colorError} />
                        <Pressable
                            onPress={() => navigation.navigate(NAVIGATION.ERROR_RESISTOR)}
                            style={[styles.itemReportContainer, { backgroundColor: colorError }]}
                        >
                            <AppText style={styles.textItemReport}>Lỗi điện trở cách điện thấp</AppText>
                        </Pressable>
                    </View> */}
                    <View style={styles.reportContainer}>
                        <MaterialIcons name="error-outline" size={28} color={colorError} />
                        <Pressable
                            onPress={() => navigation.navigate(NAVIGATION.INACTIVE_INVERTER)}
                            style={[styles.itemReportContainer, { backgroundColor: colorError }]}
                        >
                            <AppText style={styles.textItemReport}>Inverter dừng hoạt động</AppText>
                        </Pressable>
                    </View>
                    <View style={styles.reportContainer}>
                        <MaterialIcons name="error-outline" size={28} color={colorError} />
                        <Pressable
                            onPress={() => navigation.navigate(NAVIGATION.ERROR_DISCONNECT)}
                            style={[styles.itemReportContainer, { backgroundColor: colorError }]}
                        >
                            <AppText style={styles.textItemReport}>Lỗi mất tín hiệu trong ngày</AppText>
                        </Pressable>
                    </View>
                </View>
            </View>

            <View style={styles.block}>
                <AppTextMedium style={styles.blockTitle}>Phân tích</AppTextMedium>
                <View style={styles.blockContent}>
                    <View style={styles.reportContainer}>
                        <MaterialCommunityIcons name="google-analytics" size={24} color={Color.purpleDark} />
                        <Pressable
                            onPress={() => navigation.navigate(NAVIGATION.PERFORMANCE)}
                            style={[styles.itemReportContainer, { backgroundColor: Color.purpleDark }]}
                        >
                            <AppText style={styles.textItemReport}>Hiệu suất</AppText>
                        </Pressable>
                    </View>
                    <View style={styles.reportContainer}>
                        <MaterialCommunityIcons name="google-analytics" size={24} color={Color.purpleDark} />
                        <Pressable
                            onPress={() => navigation.navigate(NAVIGATION.POTENTIAL_ERROR)}
                            style={[styles.itemReportContainer, { backgroundColor: Color.purpleDark }]}
                        >
                            <AppText style={styles.textItemReport}>Lỗi tiềm ẩn</AppText>
                        </Pressable>
                    </View>
                </View>
            </View>
            <View style={styles.block}>
                <AppTextMedium style={styles.blockTitle}>Bảo trì</AppTextMedium>
                <View style={styles.blockContent}>
                    <View style={styles.reportContainer}>
                        <Feather name="tool" size={24} color={Color.blueModern_1} />
                        <Pressable
                            onPress={() => navigation.navigate(NAVIGATION.MAINTAINANCE_CATEGORY)}
                            style={[styles.itemReportContainer, { backgroundColor: Color.blueModern_1 }]}
                        >
                            <AppText style={styles.textItemReport}>Danh sách hạng mục</AppText>
                        </Pressable>
                    </View>
                    <View style={styles.reportContainer}>
                        <Feather name="tool" size={24} color={Color.blueModern_1} />
                        <Pressable
                            onPress={() => navigation.navigate(NAVIGATION.MAINTAINANCE_LIST_WORK)}
                            style={[styles.itemReportContainer, { backgroundColor: Color.blueModern_1 }]}
                        >
                            <AppText style={styles.textItemReport}>Danh sách công việc</AppText>
                        </Pressable>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default Maintain;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerBlock: {
        paddingTop: Constants.statusBarHeight + 2 * rem,
        paddingBottom: 8 * unit,
        paddingHorizontal: 16 * unit,
        backgroundColor: "white",
    },
    headerTitle: {
        fontSize: 24 * unit,
        color: Color.gray_11,
    },
    block: {
        paddingVertical: 8 * unit,
        backgroundColor: "white",
        marginTop: 10 * unit,
    },
    blockTitle: {
        paddingTop: 8 * unit,
        paddingHorizontal: 16 * unit,
        fontSize: 16 * unit,
        color: Color.gray_11,
    },
    blockContent: { paddingHorizontal: 16 * unit, paddingVertical: rem },
    reportContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 2 * unit,
    },
    itemReportContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: rem,
        marginVertical: 5 * unit,
        paddingVertical: 8 * unit,
        paddingHorizontal: 24 * unit,
        borderRadius: 36,
    },
    textItemReport: {
        fontSize: 15 * unit,
        paddingHorizontal: 10 * unit,
        color: "white",
    },
    filterAllErrorContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 16 * unit,
        marginBottom: 16 * unit,
        paddingVertical: 10 * unit,
        paddingHorizontal: 24 * unit,
        borderRadius: 36,
        backgroundColor: Color.gray_11,
    },
});
