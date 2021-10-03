import { AppText } from "@common-ui/AppText";
import { JumpLogo } from "@common-ui/Loading/JumpLogo";
import { RotateLogo } from "@common-ui/Loading/RotateLogo";
import ModalPortal from "@common-ui/Modal/ModalPortal";
import { useOnlyDidUpdateEffect } from "@hooks/useOnlyDidUpdateEffect";
import { closeIconLoadingOverlay } from "@redux/actions/app";
import { getIconLoadingOverlay } from "@redux/reducers/appModal";
import { Color } from "@theme/colors";
import { rem, unit } from "@theme/styleContants";
import { emptyFunc } from "@utils/helps/functions";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Modal, Pressable, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const LoadingIcon = ({ color }) => <ActivityIndicator size={28} color={color} animating={true} />;

const LoadingOverlay = () => {
    const { isOpen, Icon } = useSelector((state) => getIconLoadingOverlay(state));
    const modalRef = useRef();

    useOnlyDidUpdateEffect(() => {
        if (isOpen) {
            modalRef.current.open();
        } else modalRef.current.close();
    }, [isOpen]);

    return useMemo(
        () => (
            <ModalPortal
                ref={modalRef}
                onPressBackdrop={emptyFunc}
                lazyLoad={false}
                animationTimeIn={100}
                animationTimeOut={50}
            >
                {/* <View style={styles.container}>
                    <LoadingIcon color={styles.loadingIcon.color} />
                    <AppText style={styles.textLoading}> Đang tải </AppText>
                </View> */}
                <RotateLogo desColor="white" />
            </ModalPortal>
        ),
        []
    );
};

export default LoadingOverlay;

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
    modalStyle: {
        height: 200,
        width: 200,
        backgroundColor: "white",
    },
    container: {
        backgroundColor: "white",
        width: 148 * unit,
        height: 112 * unit,
        borderRadius: 12 * unit,
        justifyContent: "center",
        alignItems: "center",
        padding: 16 * unit,
    },
    loadingIcon: {
        color: Color.gray_13,
    },
    textLoading: {
        textAlign: "center",
        paddingTop: 12 * unit,
        color: Color.gray_13,
        fontSize: 16 * unit,
    },
});
