import React from "react";
import { StyleSheet, Text } from "react-native";

const AppText = (props) => {
    return <Text {...props} style={[styles.text, props.style]} />;
};

export default React.memo(AppText);

const styles = StyleSheet.create({
    text: {
        fontSize: 14,
        fontFamily: "google-sans-regular",
    },
});
