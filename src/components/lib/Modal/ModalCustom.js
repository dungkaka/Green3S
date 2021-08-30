import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Dimensions } from "react-native";
import Modal from "react-native-modal";
import { checkKeyMemo } from "../../utils";

const { _width, _height } = Dimensions.get("window");

const ModalCustom = forwardRef((props, ref) => {
    const [modalVisible, setModalVisible] = useState(false);

    useImperativeHandle(ref, () => ({
        open() {
            openModal();
        },
        close() {
            closeModal();
        },
    }));

    const closeModal = () => {
        requestAnimationFrame(() => {
            setModalVisible(false);
        });
    };

    const openModal = () => {
        requestAnimationFrame(() => {
            setModalVisible(true);
        });
    };

    return (
        <Modal
            propagateSwipe
            style={{ margin: 0, alignItems: "center" }}
            isVisible={modalVisible}
            deviceHeight={_height}
            deviceWidth={_width}
            swipeDirection={["down"]}
            onSwipeComplete={() => closeModal()}
            onBackdropPress={() => closeModal()}
            // customBackdrop={<View style={{ flex: 1 }} />}
            animationOut="zoomOut"
            animationIn="zoomIn"
            backdropOpacity={0.5}
            swipeThreshold={150}
            onBackButtonPress={() => {
                closeModal();
            }}
            useNativeDriver={true}
            hideModalContentWhileAnimating={true}
            animationInTiming={300}
            animationOutTiming={300}
            backdropTransitionInTiming={500}
            backdropTransitionOutTiming={400}
            statusBarTranslucent={true}
            {...props}
        >
            {props.children}
        </Modal>
    );
});

export default React.memo(ModalCustom, (prevProps, nextProps) => {
    const prevArray = prevProps.keyMemo;
    const nextArray = nextProps.keyMemo;
    return checkKeyMemo(prevArray, nextArray);
});
