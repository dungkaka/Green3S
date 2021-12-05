import { AppText, AppTextMedium } from "@common-ui/AppText";
import { showToast } from "@common-ui/ToastNotify/ToastManager";
import { closeIconLoadingOverlay, openIconLoadingOverlay } from "@redux/actions/app";
import { Color } from "@theme/colors";
import { AppColor, ColorDefault } from "@theme/index";
import { rem, unit } from "@theme/styleContants";
import { GoogleSansFontType, NunitoType } from "@theme/typography";
import React, { useMemo, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View, TextInput, Image, ScrollView } from "react-native";
import { useAnimatedRef } from "react-native-reanimated";
import FormErrorMessage from "@common-ui/Form/FormErrorMessage";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import Selection from "@common-ui/Form/Selection";
import { useUser } from "@services/user";
import ImagePickerOne from "@common-ui/Image/ImagePickerOne";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { hitSlop10 } from "@common-ui/Pressable/utils";
import { Int } from "@utils/helps/number";
import { isUrl } from "@utils/helps/isType";
import { useListPlants } from "@services/factory";
import { useListDevice } from "@services/device";

const dataSelectString = new Array(24).fill(0).map((_, i) => {
    return { key: `pv${i + 1}`, value: `pv${i + 1}` };
});

const ErrorPotentialCreation = () => {
    const dispatch = useDispatch();
    // const { addRequestPriceItem } = useRequestPriceCreation({ handleData: false });
    const scrollRef = useAnimatedRef();
    const navigation = useNavigation();
    const formLayout = useRef({});

    const {
        handleSubmit,
        formState: { errors },
        control,
        watch,
    } = useForm({
        mode: "onTouched",
        reValidateMode: "onChange",
    });

    const fieldArray = useRef([
        "error_name",
        "image",
        "plant",
        "device",
        "other_device",
        "string",
        "status",
        "reason",
        "suggest",
    ]).current;

    const onError = (errors) => {
        for (let i = 0; i < fieldArray.length; i++) {
            if (errors[fieldArray[i]]) {
                scrollRef.current.scrollTo({ y: formLayout.current[fieldArray[i]] });
                return;
            }
        }
    };

    const onSubmit = async (data, e) => {
        try {
            console.log("DATA", data);
            // const newPriceRequest = {
            //     id: Date.now() + Math.floor(Math.random() * 8000),
            //     sTenSanPham: data.product_name,
            //     imageFile: data.image,
            //     sKichThuoc: data.size,
            //     iSoLuongKhachDat: Int(data.count || 0),
            //     iDonGiaKhachDat: Int(data.price || 0),
            //     sLink: data.link,
            //     sMauSac: data.color,
            //     sGhiChu: data.note,
            // };
            // await addRequestPriceItem(newPriceRequest);
            // navigation.goBack();
            showToast({ type: "success", title: "Thêm lỗi", description: "Tính năng đang phát triển !" });
        } catch (e) {
            dispatch(closeIconLoadingOverlay);
            showToast({ type: "error", title: "Thêm lỗi", description: "Lỗi: " + e.message });
        }
    };

    const measureY = (event, fieldName) => {
        formLayout.current[fieldName] = event.nativeEvent.layout.y;
    };

    const plant = watch("plant");

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <View style={styles.registerBlock}>
                    <View style={styles.formContainer}>
                        <AppTextMedium style={{ color: Color.redOrange }}>Tính năng đang phát triển</AppTextMedium>

                        {/* Tên lỗi */}
                        <View onLayout={(event) => measureY(event, "error_name")} style={styles.blockInput}>
                            <View style={styles.inputContainer}>
                                <View style={styles.titleInput}>
                                    <AppTextMedium>Tên lỗi</AppTextMedium>
                                    <AppText style={styles.requireIcon}>*</AppText>
                                    <FormErrorMessage error={errors?.error_name} />
                                </View>

                                <Controller
                                    name="error_name"
                                    control={control}
                                    rules={{
                                        required: { value: true, message: "Bắt buộc !" },
                                    }}
                                    render={({
                                        field: { onChange, onBlur, value, name, ref },
                                        fieldState: { invalid, isTouched, isDirty, error },
                                        formState,
                                    }) => {
                                        return (
                                            <TextInput
                                                placeholder="Nhập tên lỗi tiềm ẩn"
                                                placeholderTextColor={Color.gray_6}
                                                style={styles.input}
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                            />
                                        );
                                    }}
                                />
                            </View>
                        </View>

                        {/* Ảnh */}
                        <View onLayout={(event) => measureY(event, "image")} style={styles.blockInput}>
                            <View style={styles.inputContainer}>
                                <View style={styles.titleInput}>
                                    <AppTextMedium>Ảnh mô tả</AppTextMedium>
                                    <AppText style={styles.requireIcon}></AppText>
                                </View>

                                <Controller
                                    name="image"
                                    control={control}
                                    render={({
                                        field: { onChange, onBlur, value, name, ref },
                                        fieldState: { invalid, isTouched, isDirty, error },
                                        formState,
                                    }) => {
                                        const pickerRef = useRef();
                                        return (
                                            <View>
                                                <ImagePickerOne
                                                    ref={pickerRef}
                                                    style={{
                                                        paddingVertical: 8 * unit,
                                                    }}
                                                    initialValue={value}
                                                    onChangeImage={onChange}
                                                    renderItem={(image) => {
                                                        if (!image) {
                                                            return (
                                                                <View
                                                                    style={{
                                                                        width: 150,
                                                                        height: 160,
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                        borderWidth: 2,
                                                                        borderRadius: 12,
                                                                        borderStyle: "dashed",
                                                                        borderColor: Color.gray_8,
                                                                    }}
                                                                >
                                                                    <MaterialIcons name="add" size={18} color={Color.gray_8} />
                                                                    <AppText
                                                                        style={{
                                                                            paddingVertical: 4 * unit,
                                                                            color: Color.gray_8,
                                                                        }}
                                                                    >
                                                                        Thêm ảnh
                                                                    </AppText>
                                                                </View>
                                                            );
                                                        }
                                                        return (
                                                            <View style={{ width: 150, height: 160 }}>
                                                                <Image
                                                                    source={{ uri: image.uri }}
                                                                    style={{
                                                                        width: "100%",
                                                                        height: "100%",
                                                                        borderRadius: 8 * unit,
                                                                    }}
                                                                />
                                                                <View
                                                                    style={{
                                                                        position: "absolute",
                                                                        bottom: 6,
                                                                        right: 6,
                                                                        padding: 6,
                                                                        backgroundColor: "rgba(0,0,0,0.3)",
                                                                        borderRadius: 20,
                                                                    }}
                                                                >
                                                                    <MaterialIcons
                                                                        name="auto-fix-high"
                                                                        size={18}
                                                                        color="white"
                                                                    />
                                                                </View>
                                                                <Pressable
                                                                    hitSlop={hitSlop10}
                                                                    onPress={() => pickerRef.current.setImage(null)}
                                                                    style={{
                                                                        position: "absolute",
                                                                        top: 6,
                                                                        right: 6,
                                                                        padding: 6,
                                                                        backgroundColor: "rgba(0,0,0,0.3)",
                                                                        borderRadius: 20,
                                                                    }}
                                                                >
                                                                    <Feather name="trash-2" size={18} color="white" />
                                                                </Pressable>
                                                            </View>
                                                        );
                                                    }}
                                                />
                                            </View>
                                        );
                                    }}
                                />
                            </View>
                        </View>

                        {/* Nhà máy */}
                        <View onLayout={(event) => measureY(event, "plant")} style={styles.blockInput}>
                            <View style={styles.inputContainer}>
                                <View style={styles.titleInput}>
                                    <AppTextMedium>Nhà máy</AppTextMedium>
                                    <AppText style={styles.requireIcon}>*</AppText>
                                    <FormErrorMessage error={errors?.device} />
                                </View>

                                <Controller
                                    name="plant"
                                    control={control}
                                    rules={{
                                        required: { value: true, message: "Bắt buộc!" },
                                    }}
                                    render={({
                                        field: { onChange, onBlur, value, name, ref },
                                        fieldState: { invalid, isTouched, isDirty, error },
                                        formState,
                                    }) => {
                                        const { data: plantData } = useListPlants();

                                        return useMemo(() => {
                                            const plants = plantData?.plants || [];
                                            const dataSelectPlants = plants.map((plant) => ({
                                                key: plant.stationCode,
                                                value: plant.stationName,
                                            }));

                                            return (
                                                <Selection
                                                    data={dataSelectPlants}
                                                    containerStyle={styles.selection}
                                                    title="Danh mục"
                                                    required
                                                    onChange={onChange}
                                                    renderValueComponent={(select) => {
                                                        if (select)
                                                            return <AppText style={{ color: "black" }}>{select.value}</AppText>;
                                                        return <AppText style={{ color: Color.gray_6 }}>Chọn nhà máy</AppText>;
                                                    }}
                                                />
                                            );
                                        }, [plantData]);
                                    }}
                                />
                            </View>
                        </View>

                        {/* Device */}
                        <View onLayout={(event) => measureY(event, "device")} style={styles.blockInput}>
                            <View style={styles.inputContainer}>
                                <View style={styles.titleInput}>
                                    <AppTextMedium>Thiết bị</AppTextMedium>
                                    <AppText style={styles.requireIcon}>*</AppText>
                                    <FormErrorMessage error={errors?.device} />
                                </View>

                                <Controller
                                    name="device"
                                    control={control}
                                    rules={{
                                        required: { value: true, message: "Bắt buộc!" },
                                    }}
                                    render={({
                                        field: { onChange, onBlur, value, name, ref },
                                        fieldState: { invalid, isTouched, isDirty, error },
                                        formState,
                                    }) => {
                                        const { data: deviceData } = useListDevice({ stationCode: plant?.key });

                                        return useMemo(() => {
                                            const devices = deviceData?.devices || [];
                                            const dataSelectDevices = devices.map((device) => ({
                                                key: device.device_id,
                                                value: device.devName,
                                            }));

                                            return (
                                                <Selection
                                                    data={dataSelectDevices}
                                                    containerStyle={styles.selection}
                                                    title="Thiết bị"
                                                    required
                                                    onChange={onChange}
                                                    renderValueComponent={(select) => {
                                                        if (select)
                                                            return <AppText style={{ color: "black" }}>{select.value}</AppText>;
                                                        return <AppText style={{ color: Color.gray_6 }}>Chọn thiết bị</AppText>;
                                                    }}
                                                />
                                            );
                                        }, [deviceData]);
                                    }}
                                />
                            </View>
                        </View>

                        {/* String */}
                        <View onLayout={(event) => measureY(event, "string")} style={styles.blockInput}>
                            <View style={styles.inputContainer}>
                                <View style={styles.titleInput}>
                                    <AppTextMedium>String</AppTextMedium>
                                    <AppText style={styles.requireIcon}></AppText>
                                    <FormErrorMessage error={errors?.string} />
                                </View>

                                <Controller
                                    name="link"
                                    control={control}
                                    render={({
                                        field: { onChange, onBlur, value, name, ref },
                                        fieldState: { invalid, isTouched, isDirty, error },
                                        formState,
                                    }) => {
                                        return (
                                            <Selection
                                                data={dataSelectString}
                                                containerStyle={styles.selection}
                                                title="String"
                                                required
                                                onChange={onChange}
                                                renderValueComponent={(select) => {
                                                    if (select)
                                                        return <AppText style={{ color: "black" }}>{select.value}</AppText>;
                                                    return <AppText style={{ color: Color.gray_6 }}>Chọn string</AppText>;
                                                }}
                                            />
                                        );
                                    }}
                                />
                            </View>
                        </View>

                        {/* Trạng thái */}
                        <View onLayout={(event) => measureY(event, "status")} style={styles.blockInput}>
                            <View style={styles.inputContainer}>
                                <View style={styles.titleInput}>
                                    <AppTextMedium>Trạng thái</AppTextMedium>
                                    <AppText style={styles.requireIcon}></AppText>
                                    <FormErrorMessage error={errors?.status} />
                                </View>

                                <Controller
                                    name="status"
                                    control={control}
                                    render={({
                                        field: { onChange, onBlur, value, name, ref },
                                        fieldState: { invalid, isTouched, isDirty, error },
                                        formState,
                                    }) => {
                                        return (
                                            <TextInput
                                                placeholder="Sữa chữa phòng ngừa"
                                                placeholderTextColor={Color.gray_6}
                                                style={styles.input}
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                            />
                                        );
                                    }}
                                />
                            </View>
                        </View>

                        {/* Nguyên nhân */}
                        <View onLayout={(event) => measureY(event, "reason")} style={styles.blockInput}>
                            <View style={styles.inputContainer}>
                                <View style={styles.titleInput}>
                                    <AppTextMedium>Nguyên nhân</AppTextMedium>
                                    <AppText style={styles.requireIcon}>*</AppText>
                                    <FormErrorMessage error={errors?.reason} />
                                </View>

                                <Controller
                                    name="reason"
                                    control={control}
                                    rules={{
                                        required: { value: true, message: "Bắt buộc !" },
                                    }}
                                    render={({
                                        field: { onChange, onBlur, value, name, ref },
                                        fieldState: { invalid, isTouched, isDirty, error },
                                        formState,
                                    }) => {
                                        return (
                                            <TextInput
                                                placeholder="Nhập nguyên nhân"
                                                numberOfLines={8}
                                                placeholderTextColor={Color.gray_6}
                                                style={[styles.input, { textAlignVertical: "top" }]}
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                            />
                                        );
                                    }}
                                />
                            </View>
                        </View>

                        {/* Đề xuất */}
                        <View onLayout={(event) => measureY(event, "suggest")} style={styles.blockInput}>
                            <View style={styles.inputContainer}>
                                <View style={styles.titleInput}>
                                    <AppTextMedium>Đề xuất</AppTextMedium>
                                    <AppText style={styles.requireIcon}>*</AppText>
                                    <FormErrorMessage error={errors?.suggest} />
                                </View>

                                <Controller
                                    name="suggest"
                                    control={control}
                                    rules={{
                                        required: { value: true, message: "Bắt buộc !" },
                                    }}
                                    render={({
                                        field: { onChange, onBlur, value, name, ref },
                                        fieldState: { invalid, isTouched, isDirty, error },
                                        formState,
                                    }) => {
                                        return (
                                            <TextInput
                                                placeholder="Nhập đề xuất"
                                                numberOfLines={8}
                                                placeholderTextColor={Color.gray_6}
                                                style={[styles.input, { textAlignVertical: "top" }]}
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                            />
                                        );
                                    }}
                                />
                            </View>
                        </View>

                        <View style={styles.blockAction}>
                            <Pressable onPress={handleSubmit(onSubmit, onError)} style={styles.buttonRegister}>
                                <Text style={styles.textRegister}>Tạo lỗi</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default ErrorPotentialCreation;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    headContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "#e34d4a",
        overflow: "hidden",
    },
    scrollContainer: {
        flexGrow: 1,
        paddingVertical: 12 * unit,
        backgroundColor: "transparent",
    },
    registerBlock: {
        flex: 1,
        backgroundColor: "white",
    },
    formContainer: {
        width: "100%",
        paddingHorizontal: 16 * unit,
        // paddingBottom: 4 * rem,
    },
    blockInput: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    inputContainer: {
        flex: 1,
        paddingVertical: 8 * unit,
    },
    titleInput: {
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: 3 * unit,
    },
    requireIcon: {
        color: "red",
        paddingLeft: 6 * unit,
        marginTop: 4 * unit,
        fontSize: 18 * unit,
    },
    input: {
        flex: 1,
        paddingVertical: 10 * unit,
        paddingHorizontal: 12 * unit,
        justifyContent: "center",
        borderRadius: 8,
        backgroundColor: Color.gray_2,
        fontFamily: GoogleSansFontType.regular,
    },
    blockAction: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingVertical: 26 * unit,
    },
    buttonRegister: {
        flex: 1,
        height: 46 * unit,
        alignItems: "center",
        backgroundColor: ColorDefault.primary,
        elevation: 1,
        borderRadius: 4,
        padding: rem / 2,
    },
    textRegister: {
        fontFamily: NunitoType.medium,
        color: "white",
        padding: 4 * unit,
        fontSize: 16 * unit,
    },
    selection: {
        flex: 1,
        paddingVertical: 12 * unit,
        paddingHorizontal: 12 * unit,
        justifyContent: "center",
        borderRadius: 6,
        backgroundColor: Color.gray_2,
        fontFamily: GoogleSansFontType.regular,
    },
    displaySelect: {},
});
