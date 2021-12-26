import { AppText, AppTextMedium } from "@common-ui/AppText";
import Selection from "@common-ui/Form/Selection";
import { showToast } from "@common-ui/ToastNotify/ToastManager";
import { useRoute, useNavigation } from "@react-navigation/native";
import { closeIconLoadingOverlay, openIconLoadingOverlay } from "@redux/actions/app";
import { useCommonErrorControl } from "@services/error";
import { Color } from "@theme/colors";
import { unit } from "@theme/styleContants";
import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useDispatch } from "react-redux";
import ImagePickerOne from "@common-ui/Image/ImagePickerOne";
import { MaterialIcons, Feather, AntDesign } from "@expo/vector-icons";
import { hitSlop10 } from "@common-ui/Pressable/utils";

const renderStatus = (code) => {
    switch (code) {
        case 0:
            return "Chưa sửa";
        case 1:
            return "Đã sửa";
        case 2:
            return "Đang sửa";
        case 3:
            return "Đợi vật tư";
        default:
            return null;
    }
};

const dataSelectStatus = [
    {
        key: 0,
        value: "Chưa sửa",
    },
    {
        key: 1,
        value: "Đã sửa",
    },
    {
        key: 2,
        value: "Đang sửa",
    },
    {
        key: 3,
        value: "Đợi vật tư",
    },
];

const StatusItem = React.memo(({ initialOptionId, onChange = () => {}, last }) => {
    return (
        <Selection
            initialOption={dataSelectStatus.find((option) => option.key == initialOptionId)}
            onChange={onChange}
            title="Trạng thái"
            data={dataSelectStatus}
            containerStyle={styles.lastItemContainer}
            renderValueComponent={(select) => {
                return (
                    <Fragment>
                        <AppText>Trạng thái</AppText>
                        <View style={styles.itemDesContainer}>
                            <AppText style={{ paddingHorizontal: 8 * unit, color: Color.gray_8 }}>
                                {select ? select.value : "Chọn trạng thái"}
                            </AppText>
                            <AntDesign name="right" size={16} color="black" />
                        </View>
                    </Fragment>
                );
            }}
        />
    );
});

const DetailItem = ({ title, value, last = false }) => {
    return (
        <View style={last ? styles.lastItemContainer : styles.itemContainer}>
            <AppText>{title}</AppText>
            <View style={styles.itemDesContainer}>
                <AppText style={{ color: Color.gray_8 }}>{value}</AppText>
            </View>
        </View>
    );
};

const RSUpdation = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { params } = useRoute();
    const { error = {}, key } = params || {};
    const { device, factory, error_name, created_at, reason, solution, status, image_repairs } = error;
    const reasonInputRef = useRef();
    const reasonRef = useRef();
    const solutionRef = useRef();
    const [images, setImages] = useState([]);
    const statusRef = useRef(status);

    const { updateError } = useCommonErrorControl({ key });

    const handleUpdate = async () => {
        try {
            dispatch(openIconLoadingOverlay());

            await updateError({
                ...error,
                reason: reasonRef.current,
                solution: solutionRef.current,
                status: statusRef.current,
                images: images,
            });

            dispatch(closeIconLoadingOverlay);
            navigation.goBack();
            showToast({ type: "success", title: "Cập nhật lỗi", description: "Thành công !" });
        } catch (e) {
            dispatch(closeIconLoadingOverlay);
            showToast({ type: "error", title: "Cập nhật lỗi", description: "Lỗi: " + e.message });
        }
    };

    const renderImages = () => {
        if (image_repairs?.length > 0) {
            return (
                <ScrollView
                    horizontal
                    style={{
                        paddingVertical: 8 * unit,
                        flexDirection: "row",
                        flexWrap: "wrap",
                    }}
                >
                    {image_repairs?.map((imageUrl, index) => (
                        <Image
                            key={index}
                            source={{
                                uri: imageUrl,
                            }}
                            style={{
                                width: 120,
                                height: 120,
                                borderRadius: 8,
                                marginRight: 8,
                            }}
                        />
                    ))}
                </ScrollView>
            );
        }

        return (
            <ScrollView horizontal>
                <ImagePickerOne
                    style={{
                        paddingVertical: 8 * unit,
                    }}
                    onChangeImage={(newImage) => {
                        setImages([newImage, ...images]);
                    }}
                >
                    <View style={styles.imageCreate}>
                        <MaterialIcons name="add" size={18} color={Color.gray_8} />
                        <AppText style={styles.imageCreateText}>Thêm ảnh</AppText>
                    </View>
                </ImagePickerOne>

                {images?.map((image, index) => (
                    <ImagePickerOne
                        key={image.uri}
                        style={{
                            margin: 8 * unit,
                        }}
                        onChangeImage={(newImage) => {
                            images[index] = newImage;
                            setImages([...images]);
                        }}
                    >
                        <Image source={{ uri: image.uri || null }} style={styles.imageShow} />
                        <View style={styles.iconFixContainer}>
                            <MaterialIcons name="auto-fix-high" size={18} color="white" />
                        </View>
                        <Pressable
                            hitSlop={hitSlop10}
                            onPress={() => setImages(images.filter((ig) => ig.uri != image.uri))}
                            style={styles.iconDeteleImageContainer}
                        >
                            <Feather name="trash-2" size={18} color="white" />
                        </Pressable>
                    </ImagePickerOne>
                ))}
            </ScrollView>
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.block}>
                    <View style={{ padding: 16 * unit, backgroundColor: "white" }}>
                        <AppTextMedium>Thông tin</AppTextMedium>
                        <DetailItem title="Lỗi" value={error_name} />
                        <DetailItem title="Tên nhà máy" value={factory?.stationName} />
                        <DetailItem title="Tên thiết bị" value={device?.devName} />
                        <DetailItem title="Thời gian xuất hiện" value={created_at} />
                        <StatusItem
                            initialOptionId={statusRef.current}
                            onChange={(select) => {
                                statusRef.current = select?.key;
                            }}
                        />
                    </View>
                </View>

                <View style={styles.block}>
                    <View style={{ padding: 16 * unit, backgroundColor: "white" }}>
                        <AppTextMedium style={{ paddingBottom: 16 * unit }}>Cập nhật</AppTextMedium>
                        <AppText>Nguyên nhân</AppText>
                        <TextInput
                            ref={reasonInputRef}
                            defaultValue={reason}
                            style={styles.input}
                            multiline={true}
                            placeholder="Nhập nguyên nhân"
                            numberOfLines={6}
                            onChangeText={(text) => {
                                reasonRef.current = text;
                            }}
                        />
                        <AppText>Giải pháp</AppText>
                        <TextInput
                            style={styles.input}
                            defaultValue={solution}
                            multiline={true}
                            placeholder="Nhập giải pháp"
                            numberOfLines={6}
                            onChangeText={(text) => {
                                solutionRef.current = text;
                            }}
                        />
                    </View>
                </View>
                <View style={[styles.block, { marginBottom: 0 }]}>
                    <View style={{ padding: 16 * unit, backgroundColor: "white" }}>
                        <AppTextMedium style={{ paddingBottom: 8 * unit }}>Ảnh mô tả</AppTextMedium>
                        {renderImages()}
                    </View>
                </View>
            </ScrollView>
            <Pressable onPress={handleUpdate} style={styles.updateButton}>
                <AppTextMedium style={{ color: "white", fontSize: 15 * unit }}>Cập nhật</AppTextMedium>
            </Pressable>
        </View>
    );
};

export default RSUpdation;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    block: {
        marginBottom: 10,
        elevation: 0.5,
    },
    itemContainer: {
        flexDirection: "row",
        paddingVertical: 12 * unit,
        borderBottomColor: Color.gray_2,
        borderBottomWidth: 1,
    },
    lastItemContainer: {
        flexDirection: "row",
        paddingVertical: 12 * unit,
    },
    itemDesContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingLeft: 24 * unit,
    },
    input: {
        width: "100%",
        marginVertical: 12 * unit,
        padding: 12 * unit,
        textAlignVertical: "top",
        backgroundColor: Color.gray_2,
        borderRadius: 8 * unit,
    },
    updateButton: {
        width: "100%",
        height: 52 * unit,
        backgroundColor: Color.greenBlueDark,
        justifyContent: "center",
        alignItems: "center",
    },
    imageCreate: {
        width: 150,
        height: 160,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderRadius: 12,
        borderStyle: "dashed",
        borderColor: Color.gray_8,
    },
    imageCreateText: {
        paddingVertical: 4 * unit,
        color: Color.gray_8,
    },
    imageContainer: {
        width: 150,
        height: 160,
    },
    imageShow: {
        width: 150,
        height: 160,
        borderRadius: 8 * unit,
    },
    iconFixContainer: {
        position: "absolute",
        bottom: 6,
        right: 6,
        padding: 6,
        backgroundColor: "rgba(0,0,0,0.3)",
        borderRadius: 20,
    },
    iconDeteleImageContainer: {
        position: "absolute",
        top: 6,
        right: 6,
        padding: 6,
        backgroundColor: "rgba(0,0,0,0.3)",
        borderRadius: 20,
    },
});
