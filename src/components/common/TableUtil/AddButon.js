import { Color } from "@theme/colors";
import { unit } from "@theme/styleContants";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";

const AddButon = ({ onPress = () => {}, size = 16 }) => {
    return (
        <Pressable onPress={onPress} style={styles.container}>
            <Entypo name="plus" size={size} color="white" />
        </Pressable>
    );
};

export default AddButon;

const styles = StyleSheet.create({
    container: {
        padding: 6 * unit,
        borderRadius: 4 * unit,
        backgroundColor: Color.greenBlueDark,
    },
});
