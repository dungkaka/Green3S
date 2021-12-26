import React, { useState, useEffect, forwardRef, useImperativeHandle, Fragment, useRef } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import BottomSheet from "@common-ui/Modal/BottomSheet";
import { HEIGHT } from "@theme/scale";
import { unit } from "@theme/styleContants";
import { Ionicons } from "@expo/vector-icons";
import { Color } from "@theme/colors";
import { AppText } from "@common-ui/AppText";

const ImagePickerOne = ({ style, onChangeImage, type = "all", children }) => {
    const bottomSheetChooseMethodPickerRef = useRef();

    useEffect(() => {
        (async () => {
            if (Platform.OS !== "web") {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== "granted") {
                    alert("Rất tiếc, bạn không có quyền truy cập vào ảnh trên thiết bị này !");
                }
            }
        })();
    }, []);

    const pickImage = () => {
        switch (type) {
            case "library":
                return pickImageFromLib();
            case "camera":
                return pickImageFromCamera();
            case "all":
                return chooseMethodPicker();
            default:
                return chooseMethodPicker();
        }
    };

    const chooseMethodPicker = () => {
        bottomSheetChooseMethodPickerRef.current?.open?.();
    };

    const pickImageFromCamera = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            // allowsEditing: true,
            quality: 1,
        });

        if (!result.cancelled) {
            const uri = result.uri;
            const name = uri.substring(uri.lastIndexOf("/") + 1);
            onChangeImage({
                uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
                name: name,
                type: "image/" + name.substring(name.lastIndexOf(".") + 1),
            });
        }
    };

    const pickImageFromLib = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            // allowsEditing: true,
            quality: 1,
        });

        if (!result.cancelled) {
            const uri = result.uri;
            const name = uri.substring(uri.lastIndexOf("/") + 1);
            onChangeImage({
                uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
                name: name,
                type: "image/" + name.substring(name.lastIndexOf(".") + 1),
            });
        }
    };

    return (
        <Fragment>
            <Pressable style={style} onPress={pickImage}>
                {children}
            </Pressable>
            {type == "all" && (
                <BottomSheet ref={bottomSheetChooseMethodPickerRef} bottomSheetStyle={styles.modalContainer}>
                    <View style={styles.modal}>
                        <View style={styles.contentContainer}>
                            <Pressable
                                onPress={() => {
                                    pickImageFromLib();
                                    bottomSheetChooseMethodPickerRef.current.close();
                                }}
                                style={styles.itemContainer}
                            >
                                <Ionicons name="ios-image-outline" size={38} color={Color.gray_8} />
                                <AppText>Thư viện</AppText>
                            </Pressable>
                            <Pressable
                                onPress={() => {
                                    pickImageFromCamera();
                                    bottomSheetChooseMethodPickerRef.current.close();
                                }}
                                style={styles.itemContainer}
                            >
                                <Ionicons name="camera-outline" size={38} color={Color.gray_8} />
                                <AppText>Máy ảnh</AppText>
                            </Pressable>
                        </View>
                    </View>
                </BottomSheet>
            )}
        </Fragment>
    );
};

export default ImagePickerOne;

const styles = StyleSheet.create({
    modalContainer: {
        bottom: -HEIGHT * 0.1,
    },
    modal: {
        flex: 1,
        backgroundColor: "white",
        borderRadius: 12 * unit,
        paddingBottom: HEIGHT * 0.1,
    },
    contentContainer: {
        flexDirection: "row",
        padding: 30 * unit,
    },
    itemContainer: {
        paddingRight: 30 * unit,
        justifyContent: "center",
        alignItems: "center",
    },
});
