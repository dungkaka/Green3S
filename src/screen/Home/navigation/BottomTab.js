import React, { cloneElement } from "react";
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
import Particular from "./Particular";
import Weave from "./Weave";
import { bottomTabs, Colors, DURATION, HEIGHT, ICON_SIZE, PADDING } from "./ConfigContanst";
import { unit } from "@theme/styleContants";
import { GoogleSansFontType } from "@theme/typography";
import { Color } from "@theme/colors";

const BottomTab = React.memo(
    ({ state, descriptors, navigation }) => {
        const activeIndex = useSharedValue(0);
        const transitionProcess = useSharedValue(0);
        const afterTransition = useSharedValue(true);

        const tabs = state.routes.map((route) => {
            const tab = bottomTabs[route.name] || bottomTabs["default"];
            return { ...tab, ...route };
        });

        const listenActiveIndexChange = (index) => {
            afterTransition.value = 0;
            transitionProcess.value = 0;
            transitionProcess.value = withTiming(1, { duration: DURATION + 100 });
            setTimeout(() => {
                afterTransition.value = 1;
            }, DURATION / 2);

            navigation.navigate({ name: tabs[index].name, merge: true });
        };

        useAnimatedReaction(
            () => {
                activeIndex.value;
                return 1;
            },
            (next, prev) => {
                if (!prev) return;
                runOnJS(listenActiveIndexChange)(activeIndex.value);
            },
            []
        );

        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.tabs}>
                    {tabs.map(({ icon, label, Icon, size }, index) => (
                        <View key={index} style={styles.tab}>
                            <Weave {...{ activeIndex, index }} />
                            <BottomTabItem {...{ activeIndex, afterTransition, index, label, icon, Icon, size }} />
                        </View>
                    ))}
                    <Particular {...{ activeIndex, transitionProcess }} />
                </View>
            </SafeAreaView>
        );
    },
    () => true
);

const BottomTabItem = ({ children, activeIndex, afterTransition, index, onPress, label, icon, Icon, size }) => {
    const isActive = useDerivedValue(() => activeIndex.value == index);
    const indexTransition = useDerivedValue(() => withTiming(activeIndex.value, { duration: DURATION }));
    const transitionProcess = useDerivedValue(() =>
        withTiming(isActive.value && afterTransition.value ? 1 : 0, { duration: DURATION })
    );
    const activeScale = useDerivedValue(() =>
        isActive.value ? interpolate(transitionProcess.value, [0, 0.5, 1], [1, 1.25, 1]) : 1
    );

    const direction = useDerivedValue(() => {
        const isGoingLeft = indexTransition.value > activeIndex.value;
        if (isActive) {
            return isGoingLeft ? "ltr" : "rtl";
        } else {
            return isGoingLeft ? "rtr" : "ltr";
        }
    });

    const itemStyle = useAnimatedStyle(() => {
        return {
            width: transitionProcess.value * size,
        };
    });

    const styleDirection = useAnimatedStyle(() => {
        return {
            direction: direction.value,
            transform: [{ scale: activeScale.value }],
        };
    });

    const colorTitle = useAnimatedStyle(() => {
        return {
            color: isActive.value ? Colors.primary : Colors.border,
        };
    });

    return (
        <Pressable
            onPress={() => {
                if (activeIndex.value == index) return;
                activeIndex.value = index;
            }}
            style={styles.tabContainer}
        >
            <Animated.View style={[styles.tabContentContainer, styleDirection]}>
                <View style={{ width: size, height: size }}>
                    <View style={StyleSheet.absoluteFill}>
                        <Icon size={size} />
                    </View>
                    <Animated.View style={[styles.icon, itemStyle]}>
                        <Icon size={size} active={true} colorActive={Colors.primary} />
                    </Animated.View>
                </View>
            </Animated.View>
            <Animated.Text style={[styles.title, colorTitle]}>{label}</Animated.Text>
        </Pressable>
    );
};

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
