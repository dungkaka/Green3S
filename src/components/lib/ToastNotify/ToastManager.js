import AppText from "@common-ui/AppText";
import { Color } from "@theme/colors";
import { fontUnit, rem, unit } from "@theme/styleContants";
import { GoogleSansFontType } from "@theme/typography";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Dimensions, FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
    runOnJS,
    Transition,
    Transitioning,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming,
} from "react-native-reanimated";

const width = Dimensions.get("window").width;
const TRANSLATE_X_THRESHOLD = -width * 0.3;

const contextClass = {
    success: {
        bg: "white",
        title: Color.greenBlue,
        progress: Color.greenBlue,
        IconFamily: Ionicons,
        iconName: "checkmark-circle-outline",
    },
    error: {
        bg: "white",
        title: Color.redPastel,
        progress: Color.redPastel,
        IconFamily: Feather,
        iconName: "x-circle",
    },
    warning: {
        bg: "white",
        title: Color.orangePastel,
        progress: Color.orangePastel,
        IconFamily: Feather,
        iconName: "alert-circle",
    },
    info: {
        bg: "white",
        title: Color.blueModern_1,
        progress: Color.blueModern_1,
        IconFamily: Feather,
        iconName: "info",
    },
    default: {
        bg: "white",
        title: Color.blueModern_1,
        progress: Color.blueModern_1,
        IconFamily: Feather,
        iconName: "info",
    },
};

const springItem = {
    damping: 26,
    stiffness: 200,
    mass: 1.8,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 1,
};

const AnimatedItem = React.memo(
    ({ didShowToast, removeToast, item: { id, type, title, description } }) => {
        const context = contextClass[type] || contextClass["default"];
        const animatedItem = useSharedValue(-1);
        let timeOutDeleteToast = 0;

        useEffect(() => {
            animatedItem.value = withSpring(0, springItem, () => {
                runOnJS(didShowToast)();
                runOnJS(deleteItemDelay)();

                animatedItem.value = withDelay(300, withTiming(0.001));
            });
        }, []);

        const onStartTouchToast = () => {
            clearTimeout(timeOutDeleteToast);
        };

        const deleteItemDelay = () => {
            if (timeOutDeleteToast || animatedItem.value != 0) clearTimeout(timeOutDeleteToast);

            timeOutDeleteToast = setTimeout(() => {
                deleteItem();
            }, 3000);
        };

        const deleteItem = () => {
            animatedItem.value = withTiming(-1, null, () => {
                runOnJS(removeToast)(id);
            });
        };

        const panGesture = useAnimatedGestureHandler({
            onStart: () => {
                runOnJS(onStartTouchToast)();
            },
            onActive: (event) => {
                animatedItem.value = event.translationX / width;
            },
            onEnd: () => {
                const shouldDeleteItem = animatedItem.value * width < TRANSLATE_X_THRESHOLD;
                if (shouldDeleteItem) {
                    runOnJS(deleteItem)();
                } else {
                    animatedItem.value = withTiming(0, null, () => {
                        runOnJS(deleteItemDelay)();
                    });
                }
            },
        });

        const animatedContainer = useAnimatedStyle(() => {
            const translateX = width * animatedItem.value;
            const opacity = 1 - animatedItem.value * animatedItem.value;

            return {
                transform: [{ translateX: translateX }],
                opacity: opacity,
            };
        });

        return (
            <PanGestureHandler onGestureEvent={panGesture}>
                <Animated.View style={[styles.singleItemView, animatedContainer]}>
                    <View style={styles.singleItemContainer}>
                        <View style={styles.singleItemContentContainer}>
                            <context.IconFamily name={context.iconName} size={24} color={context.title} />
                        </View>
                        <View>
                            <AppText style={[styles.title, { color: context.title }]}>{title}</AppText>
                            <AppText style={styles.description}>{description}</AppText>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.closeButton} onPress={deleteItem}>
                        <Text style={styles.deleteIcon}>{"\u00D7"}</Text>
                    </TouchableOpacity>
                </Animated.View>
            </PanGestureHandler>
        );
    },
    (prevProps, nextProps) => prevProps.item.id == nextProps.item.id
);

export const ToastManager = () => {
    const [valueArray, setValueArray] = useState([]);
    const scrollViewRef = useRef();
    const transitionRef = useRef();
    const transition = useRef(<Transition.Change interpolation="easeInOut" />).current;

    const didShowToast = useCallback(() => {}, []);

    const showToast = useCallback(({ type = "default", title = "Thông báo", description = "Nội dung" }) => {
        setValueArray((arrayToast) => {
            const newToast = {
                id: Date.now().toString(),
                type,
                title,
                description,
            };
            return [...arrayToast, newToast];
        });
    }, []);

    const removeToast = useCallback((id) => {
        transitionRef.current.animateNextTransition();
        setValueArray((arrayToast) => {
            const newArray = arrayToast.filter((toast) => toast.id != id);
            return newArray;
        });
    }, []);

    Toast.showToast = showToast;

    return (
        <Transitioning.View ref={transitionRef} transition={transition} style={styles.container}>
            <FlatList
                data={valueArray}
                ref={scrollViewRef}
                scrollEnabled={false}
                removeClippedSubviews={true}
                contentContainerStyle={styles.flatlistContainer}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <AnimatedItem item={item} removeToast={removeToast} didShowToast={didShowToast} />}
            />
        </Transitioning.View>
    );
};

const Toast = {};

export const showToast = ({ type, title, description } = {}) => {
    Toast.showToast && Toast.showToast({ type, title, description });
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 0,
        left: 0,
        zIndex: 99999,
        justifyContent: "center",
        backgroundColor: "transparent",
        marginBottom: 2.5 * rem,
    },

    flatlistContainer: {
        flex: 1,
        flexGrow: 1,
        paddingBottom: 2,
        paddingRight: 2 * rem,
        flexDirection: "column-reverse",
        justifyContent: "flex-start",
    },

    contentContainer: {
        flexDirection: "column",
    },

    singleItemView: {
        flexDirection: "row",
        width: 320 * unit,
        marginLeft: 14 * unit,
        marginTop: rem,
        backgroundColor: "white",
        alignItems: "flex-start",
        justifyContent: "center",
        borderRadius: 4 * unit,
        elevation: 1,
    },

    singleItemContainer: {
        flex: 1,
        padding: 1 * rem,
        flexDirection: "row",
        justifyContent: "flex-start",
    },

    singleItemContentContainer: { paddingRight: 8 * unit },

    title: {
        fontSize: 15 * fontUnit,
        fontFamily: GoogleSansFontType.bold,
    },

    description: {
        color: Color.gray_8,
    },

    TouchableOpacityStyle: {
        position: "absolute",
        width: 50,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        right: 30,
        bottom: 30,
    },

    FloatingButtonStyle: {
        resizeMode: "contain",
        width: 50,
        height: 50,
    },

    closeButton: {
        position: "absolute",
        right: 0,
        margin: 10 * unit,
        width: 25,
        height: 25,
    },

    deleteIcon: {
        width: "100%",
        color: Color.gray_10,
        fontSize: 28 * unit,
    },
});
