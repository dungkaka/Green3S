import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, { interpolate, useAnimatedStyle, useDerivedValue, withSpring, withTiming } from "react-native-reanimated";
import { Colors, DURATION, HEIGHT, ICON_SIZE, PADDING, SEGMENT } from "./ConfigContanst";

const size = 6;
const topParticules = [0, 1, 2];
const bottomParticules = [0, 1];

const Particular = ({ activeIndex, transitionProcess }) => {
    const transition = useDerivedValue(() => withTiming(activeIndex.value, { duration: DURATION }));
    const middle = (HEIGHT * 3) / 4 - size / 2;

    const x = useDerivedValue(() => transition.value * SEGMENT + SEGMENT / 2 - size / 2);
    const top = useDerivedValue(() => interpolate(transitionProcess.value, [0, 0.5, 1], [middle, PADDING, middle]));
    const bottom = useDerivedValue(() => interpolate(transitionProcess.value, [0, 0.5, 1], [middle, HEIGHT, middle]));
    const s = useDerivedValue(() => interpolate(transitionProcess.value, [0, 0.6, 1], [0.8, 1.5, 0.8]));
    const opacity = useDerivedValue(() => interpolate(transitionProcess.value, [0, 0.1, 0.8, 1], [0, 0.8, 1, 0]));

    return (
        <View style={styles.container} pointerEvents="none">
            <View style={styles.particules}>
                {topParticules.map((particule, index) => {
                    const translateX = useDerivedValue(() => {
                        switch (index) {
                            case 0:
                                return x.value;
                            case 1:
                                return withSpring(x.value, { damping: 50 });
                            case 2:
                                return withSpring(x.value);
                            default:
                                return x.value;
                        }
                    });
                    const translateY = useDerivedValue(() => {
                        switch (index) {
                            case 0:
                                return top.value;
                            case 1:
                                return withSpring(top.value - 3, { damping: 40 });
                            case 2:
                                return withSpring(top.value + 3);
                            default:
                                return top.value;
                        }
                    });
                    const scale = useDerivedValue(() => (index != 0 ? withSpring(s.value) : s.value));
                    const animated = useAnimatedStyle(() => ({
                        opacity: opacity.value,
                        transform: [
                            {
                                translateX: translateX.value,
                            },
                            {
                                translateY: translateY.value,
                            },
                            {
                                scale: scale.value,
                            },
                        ],
                    }));
                    return <Animated.View key={particule} style={[styles.particule, animated]} />;
                })}
                {bottomParticules.map((particule, index) => {
                    const translateX = useDerivedValue(() => {
                        switch (index) {
                            case 0:
                                return x.value;
                            case 1:
                                return withSpring(x.value);
                            default:
                                return x.value;
                        }
                    });
                    const translateY = useDerivedValue(() => {
                        switch (index) {
                            case 0:
                                return bottom.value;
                            case 1:
                                return withSpring(bottom.value + 2);
                            default:
                                return bottom.value;
                        }
                    });
                    const scale = useDerivedValue(() => (index == 0 ? withSpring(s.value) : s.value));

                    const animated = useAnimatedStyle(() => ({
                        opacity: opacity.value,
                        transform: [
                            {
                                translateX: translateX.value,
                            },
                            {
                                translateY: translateY.value,
                            },
                            {
                                scale: scale.value,
                            },
                        ],
                    }));

                    return <Animated.View key={particule} style={[styles.particule, animated]} />;
                })}
            </View>
        </View>
    );
};

export default Particular;

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        height: HEIGHT,
    },
    particules: {
        flex: 1,
        justifyContent: "center",
    },

    particule: {
        backgroundColor: Colors.primary,
        position: "absolute",
        left: 0,
        top: 0,
        width: size,
        height: size,
        borderRadius: size / 2,
    },
});
