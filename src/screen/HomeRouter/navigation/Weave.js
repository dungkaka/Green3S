import { Color } from "@theme/colors";
import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, { interpolate, useAnimatedStyle, useDerivedValue, withTiming } from "react-native-reanimated";

const SIZE = 56;

const Weave = ({ activeIndex, index }) => {
    const isActive = useDerivedValue(() => (activeIndex.value == index ? 1 : 0));
    const activeProcess = useDerivedValue(() => (isActive.value ? withTiming(isActive.value, { duration: 300 }) : 0));

    const styleAnimated = useAnimatedStyle(() => ({
        opacity: interpolate(activeProcess.value, [0, 0.5, 1], [0, 0.2, 0]),
        borderWidth: 4 - activeProcess.value * 4,
        transform: [{ scale: 0.8 * (1 - activeProcess.value) + 1.5 * activeProcess.value }],
    }));

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.weave, styleAnimated]} />
        </View>
    );
};

export default React.memo(Weave, () => true);

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
    },
    weave: {
        borderRadius: SIZE / 2,
        width: SIZE,
        height: SIZE,
        borderColor: Color.greenBlue,
    },
});
