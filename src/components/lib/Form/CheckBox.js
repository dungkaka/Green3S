import { AppText } from "@common-ui/AppText";
import { AppColor } from "@theme";
import { Color } from "@theme/colors";
import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Entypo } from "@expo/vector-icons";

const hitSlop = { top: 10, bottom: 10, left: 10, right: 10 };

const CheckBox = ({ initialValue = false, value, onChange = (value) => {}, Title }) => {
    const [active, setActive] = useState(initialValue);

    if (value != undefined) {
        return (
            <TouchableOpacity
                style={styles.container}
                activeOpacity={0.8}
                onPress={() => {
                    onChange(!value);
                }}
                hitSlop={hitSlop}
            >
                <View style={value ? styles.activeBlock : styles.block}>
                    {value && <Entypo name="check" size={13} color="white" />}
                </View>
                {Title}
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={0.8}
            onPress={() => {
                setActive(!active);
                onChange(!active);
            }}
            hitSlop={hitSlop}
        >
            <View style={active ? styles.activeBlock : styles.block}>
                {active && <Entypo name="check" size={13} color="white" />}
            </View>
            {Title}
        </TouchableOpacity>
    );
};

export default CheckBox;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
    },
    block: {
        height: 16,
        width: 16,
        borderRadius: 2,
        borderColor: Color.gray_8,
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    activeBlock: {
        height: 16,
        width: 16,
        borderRadius: 2,
        backgroundColor: AppColor.primary,
        justifyContent: "center",
        alignItems: "center",
    },
});
