import { GoogleSansFontType } from "@theme/typography";
import React from "react";
import { StyleSheet, Text } from "react-native";

export const AppText = (props) => {
    return <Text {...props} style={[styles.text, props.style]} />;
};

export const AppTextBold = (props) => {
    return <Text {...props} style={[styles.textBold, props.style]} />;
};

export const AppTextMedium = (props) => {
    return <Text {...props} style={[styles.textMedium, props.style]} />;
};

const styles = StyleSheet.create({
    text: {
        fontFamily: GoogleSansFontType.regular,
    },
    textBold: {
        fontFamily: GoogleSansFontType.bold,
    },
    textMedium: {
        fontFamily: GoogleSansFontType.medium,
    },
});
