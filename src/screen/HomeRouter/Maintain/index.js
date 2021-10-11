import { AppText, AppTextMedium } from "@common-ui/AppText";
import Select from "@common-ui/Form/Select";
import { useNavigation } from "@react-navigation/native";
import { Color } from "@theme/colors";
import { rem, unit } from "@theme/styleContants";
import { NAVIGATION } from "constant/navigation";
import React, { useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const Maintain = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={[styles.block, { marginTop: 0 }]}>
                <AppTextMedium style={styles.blockTitle}>Lỗi</AppTextMedium>
                <View style={styles.reportContainer}>
                    <Pressable onPress={() => navigation.navigate(NAVIGATION.ERROR_AC)} style={styles.itemReportContainer}>
                        <AppText style={styles.textItemReport}>Lỗi AC</AppText>
                    </Pressable>
                </View>
                <View style={styles.reportContainer}>
                    <Pressable onPress={() => navigation.navigate(NAVIGATION.ERROR_DC)} style={styles.itemReportContainer}>
                        <AppText style={styles.textItemReport}>Lỗi DC</AppText>
                    </Pressable>
                </View>
                <View style={styles.reportContainer}>
                    <Pressable
                        onPress={() => navigation.navigate(NAVIGATION.PERFORMANCE)}
                        style={[styles.itemReportContainer, { borderBottomWidth: 0 }]}
                    >
                        <AppText style={styles.textItemReport}>Hiệu suất</AppText>
                    </Pressable>
                </View>
                <View style={styles.reportContainer}>
                    <Pressable
                        onPress={() => navigation.navigate(NAVIGATION.POTENTIAL_ERROR)}
                        style={[styles.itemReportContainer, { borderBottomWidth: 0 }]}
                    >
                        <AppText style={styles.textItemReport}>Lỗi tiềm ẩn</AppText>
                    </Pressable>
                </View>
            </View>
            <View style={styles.block}>
                <AppTextMedium style={styles.blockTitle}>Bảo trì</AppTextMedium>
                <View style={styles.reportContainer}>
                    <Pressable
                        onPress={() => navigation.navigate(NAVIGATION.REPORT_PLANT_YIELD)}
                        style={[styles.itemReportContainer, { borderBottomWidth: 0 }]}
                    >
                        <AppText style={styles.textItemReport}>Danh sách hạng mục</AppText>
                    </Pressable>
                </View>
                <View style={styles.reportContainer}>
                    <Pressable
                        onPress={() => navigation.navigate(NAVIGATION.REPORT_PLANT_YIELD)}
                        style={[styles.itemReportContainer, { borderBottomWidth: 0 }]}
                    >
                        <AppText style={styles.textItemReport}>Danh sách công việc</AppText>
                    </Pressable>
                </View>
            </View>
        </View>
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
        paddingHorizontal: rem,
        fontSize: 16 * unit,
    },
    reportContainer: {
        flexDirection: "row",
    },
    itemReportContainer: {
        flex: 1,
        marginHorizontal: rem,
        marginVertical: rem / 2,
        paddingVertical: rem,
        borderBottomColor: Color.gray_2,
        borderBottomWidth: 1,
    },
    textItemReport: {
        fontSize: 18 * unit,
    },
});
