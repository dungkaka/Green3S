import { HEIGHT } from "@theme/scale";
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import { BackHandler, InteractionManager, Platform, Pressable, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import Animated, {
    Easing,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from "react-native-reanimated";
import Portal from "@burstware/react-native-portal";
import { useOnlyDidUpdateLayoutEffect } from "@hooks/useOnlyDidUpdateLayoutEffetct";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Only use this component wrapped inside a <Portal.Host> component.
// <Portal.Host> component should be inside a full screen component.

// Bug on IOS, sometime, modal onIOS is scale not expect on somewhere first rerender on parent view because of modalAnimated (unknow reason), so please alway render Modal at the first time and control render child inside, see ModalDatePicker to see example ({date && ...}). 

const ModalPortal = forwardRef(
    (
        {
            modalStyle = styles.modal,
            animationTimeIn = 350,
            animationTimeout = 200,
            onPressBackdrop,
            onBackHandler = () => {},
            children,
            lazyLoad = true,
            unmountOnHide = false,
        },
        ref
    ) => {
        const [isReady, setIsReady] = useState(!lazyLoad && !unmountOnHide);
        const animateModal = useSharedValue(0);
        const displayModal = useSharedValue(0);
        const willOpenModal = useRef(false);

        useEffect(() => {
            return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
        }, []);

        useLayoutEffect(() => {
            if (isReady && willOpenModal.current) requestAnimationFrame(() => animatedOpenModal());
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
            onBackHandler();
            return true;
        }, []);

        const animatedOpenModal = () => {
            displayModal.value = "auto";
            animateModal.value = withTiming(1, { easing: Easing.bezier(0.39, 0.35, 0.14, 1.26), duration: animationTimeIn });
            BackHandler.addEventListener("hardwareBackPress", onBackPress);
        };

        const animatedCloseModal = () => {
            // When close right after open, maybe overlay still show, need that to sure close completely run !
            animateModal.value = withDelay(
                2,
                withTiming(0, { duration: animationTimeout }, () => {
                    displayModal.value = 0;
                    unmountOnHide && runOnJS(setIsReady)(false);
                })
            );
            BackHandler.removeEventListener("hardwareBackPress", onBackPress);
        };

        const modalAnimated = useAnimatedStyle(() => {
            return {
                transform: [
                    {
                        scale: 0.5 + animateModal.value / 2,
                    },
                ],
            };
        });

        const containerStyle = useAnimatedStyle(() => ({
            opacity: animateModal.value * 1.2,
            width: displayModal.value,
            height: displayModal.value,
        }));

        return (
            <Portal>
                <Animated.View style={[styles.modalContainer, containerStyle]}>
                    <AnimatedPressable
                        style={styles.backdrop}
                        onPress={() => {
                            onPressBackdrop ? onPressBackdrop() : animatedCloseModal();
                        }}
                    />
                    <Animated.View style={[modalStyle, modalAnimated]}>{isReady && children}</Animated.View>
                </Animated.View>
            </Portal>
        );
    }
);

export default ModalPortal;

const styles = StyleSheet.create({
    modalContainer: {
        ...StyleSheet.absoluteFill,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        backgroundColor: "transparent",
    },
    backdrop: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modal: {},
});
