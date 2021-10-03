import React, { cloneElement, useEffect, useLayoutEffect } from "react";
import { Pressable, SafeAreaView, StyleSheet, View } from "react-native";
import Animated, {
    interpolate,
    runOnJS,
    useAnimatedReaction,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import Weave from "./Weave";
import { bottomTabs, Colors, DURATION, HEIGHT, ICON_SIZE, PADDING } from "./ConfigContanst";
import { unit } from "@theme/styleContants";
import { GoogleSansFontType } from "@theme/typography";
const AnimatePressable = Animated.createAnimatedComponent(Pressable);

const BottomTab = ({ state, descriptors, navigation }) => {
    const activeIndex = useSharedValue(0);
    const tabs = state.routes.map((route) => {
        const tab = bottomTabs[route.name] || bottomTabs["default"];
        return { ...tab, ...route };
    });

    useEffect(() => {
        if (activeIndex.value != state.index) activeIndex.value = state.index;
    }, [state.index]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.tabs}>
                {tabs.map(({ icon, label, Icon, size }, index) => (
                    <View key={index} style={styles.tab}>
                        <Weave {...{ activeIndex, index }} />
                        <BottomTabItem
                            onPress={() => {
                                if (activeIndex.value == index) return;
                                activeIndex.value = index;
                                navigation.navigate({ name: tabs[index].name, merge: true });
                            }}
                            {...{ activeIndex, index, label, icon, Icon, size }}
                        />
                    </View>
                ))}
            </View>
        </SafeAreaView>
    );
};
const BottomTabItem = React.memo(
    ({ activeIndex, index, onPress, label, Icon, size }) => {
        const isActive = useDerivedValue(() => activeIndex.value == index);
        const transitionProcess_Height = useDerivedValue(() => (isActive.value ? 1 : 0));
        const transitionProcess_Scale = useDerivedValue(() => withTiming(isActive.value ? 1 : 0, { duration: DURATION }));
        const activeScale = useDerivedValue(() =>
            isActive.value ? interpolate(transitionProcess_Scale.value, [0, 0.1, 0.4, 1], [0.95, 0.85, 0.95, 1]) : 0.95
        );

        const itemStyle = useAnimatedStyle(() => {
            return {
                height: transitionProcess_Height.value * size,
            };
        });

        const styleDirection = useAnimatedStyle(() => {
            return {
                transform: [{ scale: activeScale.value }],
            };
        });

        const colorTitle = useAnimatedStyle(() => {
            return {
                color: isActive.value ? Colors.primary : Colors.border,
            };
        });

        return (
            <AnimatePressable onPress={onPress} style={[styles.tabContainer, styleDirection]}>
                <Animated.View style={[styles.tabContentContainer]}>
                    <View style={{ width: size, height: size }}>
                        <View style={StyleSheet.absoluteFill}>
                            <Icon size={size} color={Colors.border} />
                        </View>
                        <Animated.View style={[styles.icon, itemStyle]}>
                            <Icon size={size} active={true} colorActive={Colors.primary} />
                        </Animated.View>
                    </View>
                </Animated.View>
                <Animated.Text style={[styles.title, colorTitle]}>{label}</Animated.Text>
            </AnimatePressable>
        );
    },
    () => true
);

export default BottomTab;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        elevation: 1,
    },
    tabs: {
        flexDirection: "row",
        overflow: "hidden",
    },
    tab: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    tabContainer: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    tabContentContainer: {
        width: "100%",
        height: HEIGHT,
        paddingTop: PADDING * 2,
        justifyContent: "center",
        alignItems: "center",
    },

    icon: {
        overflow: "hidden",
    },
    title: {
        fontFamily: GoogleSansFontType.regular,
        fontSize: 10 * unit,
        paddingBottom: PADDING,
        paddingTop: PADDING / 2,
    },
});
