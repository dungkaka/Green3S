import React, { useState, useEffect, forwardRef } from "react";
import { Button, Image, View, Platform, Pressable } from "react-native";
import * as ImagePicker from "expo-image-picker";

const ImagePickerOne = forwardRef(
    ({ initialValue, style, onChangeImage, type = "library", renderItem = (image) => null }, ref) => {
        const [image, setImage] = useState(initialValue);

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

        useEffect(() => {
            onChangeImage(image);
        }, [image]);

        const pickImage = () => {
            switch (type) {
                case "library":
                    return pickImageFromLib();
                case "camera":
                    return pickImageFromCamera();
                default:
                    return pickImageFromLib();
            }
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
                setImage({
                    uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
                    name: name,
                    type: "image/" + name.substring(uri.lastIndexOf(".") + 1),
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
                setImage({
                    uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
                    name: name,
                    type: "image/" + name.substring(name.lastIndexOf(".") + 1),
                });
            }
        };

        return (
            <Pressable style={style} onPress={pickImage}>
                {renderItem(image)}
            </Pressable>
        );
    }
);

export default ImagePickerOne;
