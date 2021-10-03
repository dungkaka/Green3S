import { HEIGHT } from "@theme/scale";
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import Animated, { Easing, interpolate, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

const MyModal = forwardRef(({ containerStyle = styles.modalContainer, modalStyle, children }, ref) => {
    const [visible, setVisible] = useState(false);
    const animatedModal = useSharedValue(visible ? 1 : 0);

    useImperativeHandle(
        ref,
        () => ({
            open: openModal,
            close: animatedCloseModal,
        }),
        []
    );

    const openModal = () => {
        setVisible(true);
    };

    const closeModal = () => {
        requestAnimationFrame(() => {
            setVisible(false);
        });
    };

    const animatedCloseModal = useCallback(() => {
        animatedModal.value = withTiming(0, { duration: 250 }, () => {
            runOnJS(closeModal)();
        });
    }, []);

    const animatedOpenModal = useCallback(() => {
        animatedModal.value = withTiming(1, { easing: Easing.bezier(0.39, 0.35, 0.14, 1.26), duration: 350 });
    }, []);

    const animatedScale = useAnimatedStyle(() => ({
        opacity: interpolate(animatedModal.value, [0, 0.2, 0.8], [0, 0.4, 1]),
        transform: [
            {
                scale: interpolate(animatedModal.value, [0, 1], [0.2, 1]),
            },
        ],
    }));

    const animatedBackdrop = useAnimatedStyle(() => ({
        opacity: animatedModal.value * 1.2,
    }));

    return (
        <Modal onShow={animatedOpenModal} onRequestClose={animatedCloseModal} transparent visible={visible}>
            <Pressable style={StyleSheet.absoluteFillObject} onPress={animatedCloseModal}>
                <Animated.View style={[styles.backdrop, animatedBackdrop]} />
            </Pressable>
            <View style={StyleSheet.absoluteFillObject}>
                <View style={containerStyle}>
                    <Animated.View style={[modalStyle, animatedScale]}>{children}</Animated.View>
                </View>
            </View>
        </Modal>
    );
});

export default MyModal;

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
