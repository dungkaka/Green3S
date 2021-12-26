import { AppText, AppTextMedium } from "@common-ui/AppText";
import { Color } from "@theme/colors";
import { unit } from "@theme/styleContants";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NAVIGATION } from "constant/navigation";

const Setting = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.block}>
                <AppTextMedium style={styles.blockTitle}>Setting PV & Hướng</AppTextMedium>
                <Pressable
                    onPress={() => {
                        navigation.navigate(NAVIGATION.DEVICE_SETTING_PV);
                    }}
                    style={styles.row}
                >
                    <AppText>Cài đặt PV</AppText>
                    <View style={styles.rightRow}>
                        <AntDesign name="right" size={18} color="black" />
                    </View>
                </Pressable>
                <Pressable
                    onPress={() => {
                        navigation.navigate(NAVIGATION.DEVICE_SETTING_DIRECTION);
                    }}
                    style={styles.row}
                >
                    <AppText>Cài đặt Hướng</AppText>
                    <View style={styles.rightRow}>
                        <AntDesign name="right" size={18} color="black" />
                    </View>
                </Pressable>
            </View>
        </View>
    );
};

export default Setting;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    block: {
        margin: 10 * unit,
        padding: 16 * unit,
        borderRadius: 10 * unit,
        backgroundColor: "white",
    },
    blockTitle: {
        fontSize: 15 * unit,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14 * unit,
        borderBottomColor: Color.gray_2,
        borderBottomWidth: 1,
    },
    rightRow: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },
});
