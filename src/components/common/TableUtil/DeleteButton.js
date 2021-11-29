import React from "react";
import { StyleSheet, Pressable, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Color } from "@theme/colors";
import { unit } from "@theme/styleContants";

const DeleteButton = ({ onPress = () => {}, size = 16 }) => {
    return (
        <Pressable onPress={onPress} style={styles.container}>
            <Feather name="trash-2" size={size} color="white" />
        </Pressable>
    );
};

export default DeleteButton;

const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.gray_10,
        padding: 4 * unit,
        borderRadius: 4 * unit,
    },
});
