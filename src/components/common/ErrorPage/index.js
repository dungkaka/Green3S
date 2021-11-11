import { AppTextMedium } from "@common-ui/AppText";
import { Color } from "@theme/colors";
import { unit } from "@theme/styleContants";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import ErrorIcon from "./ErrorIcon";

const ErrorPage = ({ color }) => {
    return (
        <View style={styles.container}>
            <ErrorIcon size={120} color={color} />
            <AppTextMedium style={styles.des}>Opps! Đã có lỗi xảy ra mất rồi!</AppTextMedium>
        </View>
    );
};

export default ErrorPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    des: {
        color: Color.gray_8,
        padding: 8 * unit,
        fontSize: 15 * unit,
    },
});
