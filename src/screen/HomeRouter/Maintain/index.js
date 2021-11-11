import { AppText, AppTextMedium } from "@common-ui/AppText";
import Select from "@common-ui/Form/Select";
import { useNavigation } from "@react-navigation/native";
import { Color, PairColor } from "@theme/colors";
import { rem, unit } from "@theme/styleContants";
import { NAVIGATION } from "constant/navigation";
import React, { useRef } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Maintain = () => {
    const navigation = useNavigation();

    return (
        <ScrollView style={styles.container}>
            {/* <View style={[styles.block, { marginTop: 0 }]}>
                <AppTextMedium style={styles.blockTitle}>Báo động</AppTextMedium>
                <View style={styles.blockContent}>
                    <View style={styles.reportContainer}>
                        <Pressable
                            onPress={() => navigation.navigate(NAVIGATION.ALARM)}
                            style={[styles.itemReportContainer, { backgroundColor: Color.redPastelDark }]}
                        >
                            <Ionicons name="ios-warning-outline" size={20} color="white" />
                            <AppTextMedium style={[styles.textItemReport, { color: "white" }]}>Báo động</AppTextMedium>
                        </Pressable>
                    </View>
                </View>
            </View> */}

            <View style={[styles.block, { marginTop: 0 }]}>
                <AppTextMedium style={styles.blockTitle}>Lỗi</AppTextMedium>
                <View style={styles.blockContent}>
                    <View style={styles.reportContainer}>
                        <Pressable
                            onPress={() => navigation.navigate(NAVIGATION.ERROR_AC)}
                            style={[styles.itemReportContainer, { backgroundColor: PairColor.red.light }]}
                        >
                            <AppTextMedium style={[styles.textItemReport, { color: PairColor.red.dark }]}>Lỗi AC</AppTextMedium>
                        </Pressable>
                    </View>
                    <View style={styles.reportContainer}>
                        <Pressable
                            onPress={() => navigation.navigate(NAVIGATION.ERROR_DC)}
                            style={[styles.itemReportContainer, { backgroundColor: PairColor.green.light }]}
                        >
                            <AppTextMedium style={[styles.textItemReport, { color: PairColor.green.dark }]}>
                                Lỗi DC
                            </AppTextMedium>
                        </Pressable>
                    </View>
                    <View style={styles.reportContainer}>
                        <Pressable
                            onPress={() => navigation.navigate(NAVIGATION.PERFORMANCE)}
                            style={[styles.itemReportContainer, { backgroundColor: PairColor.blue.light }]}
                        >
                            <AppTextMedium style={[styles.textItemReport, { color: PairColor.blue.dark }]}>
                                Hiệu suất
                            </AppTextMedium>
                        </Pressable>
                    </View>
                    <View style={styles.reportContainer}>
                        <Pressable
                            onPress={() => navigation.navigate(NAVIGATION.POTENTIAL_ERROR)}
                            style={[styles.itemReportContainer, { backgroundColor: PairColor.orange.light }]}
                        >
                            <AppTextMedium style={[styles.textItemReport, { color: PairColor.orange.dark }]}>
                                Lỗi tiềm ẩn
                            </AppTextMedium>
                        </Pressable>
                    </View>
                    <View style={styles.reportContainer}>
                        <Pressable
                            onPress={() => navigation.navigate(NAVIGATION.ERROR_RESISTOR)}
                            style={[styles.itemReportContainer, { backgroundColor: PairColor.indigo.light }]}
                        >
                            <AppTextMedium style={[styles.textItemReport, { color: PairColor.indigo.dark }]}>
                                Lỗi điện trở cách điện thấp
                            </AppTextMedium>
                        </Pressable>
                    </View>
                    <View style={styles.reportContainer}>
                        <Pressable
                            onPress={() => navigation.navigate(NAVIGATION.ERROR_DISCONNECT)}
                            style={[styles.itemReportContainer, { backgroundColor: PairColor.purple.light }]}
                        >
                            <AppTextMedium style={[styles.textItemReport, { color: PairColor.purple.dark }]}>
                                Lỗi mất tín hiệu trong ngày
                            </AppTextMedium>
                        </Pressable>
                    </View>
                </View>
            </View>
            <View style={styles.block}>
                <AppTextMedium style={styles.blockTitle}>Bảo trì</AppTextMedium>
                <View style={styles.blockContent}>
                    <View style={styles.reportContainer}>
                        <Pressable
                            onPress={() => navigation.navigate(NAVIGATION.MAINTAINANCE_CATEGORY)}
                            style={[styles.itemReportContainer, { backgroundColor: PairColor.gray.light }]}
                        >
                            <AppTextMedium style={[styles.textItemReport, { color: PairColor.gray.dark }]}>
                                Danh sách hạng mục
                            </AppTextMedium>
                        </Pressable>
                    </View>
                    <View style={styles.reportContainer}>
                        <Pressable
                            onPress={() => navigation.navigate(NAVIGATION.MAINTAINANCE_LIST_WORK)}
                            style={[styles.itemReportContainer, { backgroundColor: PairColor.gray.light }]}
                        >
                            <AppTextMedium style={[styles.textItemReport, { color: PairColor.gray.dark }]}>
                                Danh sách công việc
                            </AppTextMedium>
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
    block: {
        paddingVertical: rem,
        backgroundColor: "white",
        marginTop: 10 * unit,
        elevation: 0.5,
    },
    blockTitle: {
        paddingHorizontal: 16 * unit,
        fontSize: 16 * unit,
    },
    blockContent: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 16 * unit, paddingVertical: rem },
    reportContainer: {
        flexDirection: "row",
    },
    itemReportContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: rem,
        marginVertical: 8 * unit,
        paddingVertical: 10 * unit,
        paddingHorizontal: 12 * unit,
        borderRadius: 6,
        elevation: 0.5,
    },
    textItemReport: {
        fontSize: 16 * unit,
        paddingHorizontal: 10 * unit,
    },
});
