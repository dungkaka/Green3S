import ModalPortal from "@common-ui/Modal/ModalPortal";
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Image, StyleSheet } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";

const ImageLogViewer = forwardRef((props, ref) => {
    const [images, setImages] = useState([]);
    const modalRef = useRef();

    useImperativeHandle(ref, () => ({
        open: (images) => {
            setImages(images);
            modalRef.current.open();
        },
        close: () => {
            modalRef.current.close();
        },
    }));

    return (
        <ModalPortal
            modalStyle={{ width: "100%", height: "100%", backgroundColor: "black" }}
            ref={modalRef}
            lazyLoad={true}
            unmountOnHide={true}
            onBackHandler={() => modalRef.current.close()}
        >
            <ImageViewer useNativeDriver={true} imageUrls={images} />
        </ModalPortal>
    );
});

export default ImageLogViewer;

const styles = StyleSheet.create({});
