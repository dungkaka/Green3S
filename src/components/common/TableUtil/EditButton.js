import React from "react";
import { StyleSheet, Pressable, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Color } from "@theme/colors";
import { unit } from "@theme/styleContants";

const EditButton = ({ onPress = () => {}, size = 16 }) => {
    return (
        <Pressable onPress={onPress} style={styles.container}>
            <Feather name="edit-3" size={size} color="white" />
        </Pressable>
    );
};

export default EditButton;

const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.blueModern_1,
        padding: 4 * unit,
        borderRadius: 4 * unit,
    },
});
