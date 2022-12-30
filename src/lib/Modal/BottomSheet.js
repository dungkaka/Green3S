import { HEIGHT } from "@theme/scale";
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import { BackHandler, Pressable, StyleSheet, TouchableWithoutFeedback } from "react-native";
import Animated, { Easing, interpolate, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Portal from "@burstware/react-native-portal";
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Only use this component wrapped inside a <Portal.Host> component.
// <Portal.Host> component should be inside a full screen component.

const springConfig = {
    damping: 32,
    stiffness: 200,
    mass: 2,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
};

const BottomSheet = forwardRef(
    (
        {
            lazyLoad = true,
            unmountOnHide = false,
            animationTimeIn = 500,
            animationTimeOut = 400,
            bottomSheetStyle = {},
            onPressBackdrop,
            onAnimatedOpenEnd = () => {},
            onAnimatedCloseEnd = () => {},
            children,
        },
        ref
    ) => {
        const [isReady, setIsReady] = useState(!lazyLoad && !unmountOnHide);
        const animateModal = useSharedValue(1);
        const displayModal = useSharedValue(0);
        const willOpenModal = useRef(false);

        useEffect(() => {
            return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
        }, []);

        useLayoutEffect(() => {
            if (isReady && willOpenModal.current) {
                requestAnimationFrame(() => animatedOpenModal());
            }
            willOpenModal.current = false;
        }, [isReady]);

        useImperativeHandle(ref, () => ({
            open: () => {
                if (!isReady) {
                    willOpenModal.current = true;
                    setIsReady(true);
                    return;
                }
                requestAnimationFrame(() => animatedOpenModal());
            },
            close: () => {
                requestAnimationFrame(() => animatedCloseModal());
            },
        }));

        const onBackPress = useCallback(() => {
            animatedCloseModal();
            return true;
        }, []);

        const animatedOpenModal = () => {
            displayModal.value = "100%";
            animateModal.value = withTiming(
                0,
                { easing: Easing.bezier(0.51, 0.13, 0.05, 1.13), duration: animationTimeIn },
                () => {
                    runOnJS(onAnimatedOpenEnd)();
                }
            );
            BackHandler.addEventListener("hardwareBackPress", onBackPress);
        };

        const animatedCloseModal = () => {
            animateModal.value = withTiming(1, { duration: animationTimeOut }, () => {
                displayModal.value = 0;
                runOnJS(onAnimatedCloseEnd)();
                unmountOnHide && runOnJS(setIsReady)(false);
            });
            BackHandler.removeEventListener("hardwareBackPress", onBackPress);
        };

        const modalAnimated = useAnimatedStyle(() => {
            return {
                transform: [
                    {
                        translateY: animateModal.value * HEIGHT,
                    },
                ],
            };
        });

        const backDropAnimated = useAnimatedStyle(() => ({
            opacity: interpolate(animateModal.value, [0, 0.8], [1, 0]),
        }));

        const containerStyle = useAnimatedStyle(() => ({
            width: displayModal.value,
            height: displayModal.value,
        }));

        return (
            <Portal>
                <Animated.View style={[styles.modalContainer, containerStyle]}>
                    <AnimatedPressable
                        style={[styles.backdrop, backDropAnimated]}
                        onPress={() => {
                            onPressBackdrop ? onPressBackdrop : animatedCloseModal();
                        }}
                    />
                    <Animated.View style={[styles.modal, bottomSheetStyle, modalAnimated]}>{isReady && children}</Animated.View>
                </Animated.View>
            </Portal>
        );
    }
);

export default BottomSheet;

const styles = StyleSheet.create({
    modalContainer: {
        ...StyleSheet.absoluteFill,
        overflow: "hidden",
        backgroundColor: "transparent",
    },
    backdrop: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modal: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        transform: [
            {
                translateY: 0,
            },
        ],
    },
});
