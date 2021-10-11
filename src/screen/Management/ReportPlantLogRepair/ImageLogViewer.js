import ModalPortal from "@common-ui/Modal/ModalPortal";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Image, StyleSheet, Text, View, I18nManager } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";

const ImageLogViewer = forwardRef((props, ref) => {
    const [images, setImages] = useState([]);
    const modalRef = useRef();

    useImperativeHandle(ref, () => ({
        open: (image) => {
            requestAnimationFrame(() => {
                Image.getSize(image, (w, h) =>
                    setImages([
                        {
                            url: image,
                            width: w * 2,
                            height: h * 2,
                        },
                    ])
                );

                modalRef.current.open();
            });
        },
        close: () => {
            modalRef.current.close();
        },
    }));

    return (
        <ModalPortal
            modalStyle={{ width: "100%", height: "100%", backgroundColor: "white" }}
            ref={modalRef}
            lazyLoad={true}
            unmountOnHide={true}
            onBackHandler={() => modalRef.current.close()}
        >
            <ImageViewer renderImage={(props) => <Image {...props} />} useNativeDriver={true} imageUrls={images} />
        </ModalPortal>
    );
});

export default ImageLogViewer;

const styles = StyleSheet.create({});
