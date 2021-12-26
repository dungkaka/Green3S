import { AppText, AppTextMedium } from "@common-ui/AppText";
import { showToast } from "@common-ui/ToastNotify/ToastManager";
import { closeIconLoadingOverlay, openIconLoadingOverlay } from "@redux/actions/app";
import { Color } from "@theme/colors";
import { AppColor, ColorDefault } from "@theme/index";
import { rem, unit } from "@theme/styleContants";
import { GoogleSansFontType, NunitoType } from "@theme/typography";
import React, { Fragment, useEffect, useMemo, useRef } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View, TextInput, Image, ScrollView } from "react-native";
import { useAnimatedRef } from "react-native-reanimated";
import FormErrorMessage from "@common-ui/Form/FormErrorMessage";
import { useDispatch } from "react-redux";
import { useCommonErrorControl } from "@services/error";
import { useRoute, useNavigation } from "@react-navigation/native";
import { CRUD } from "constant/crud";
import { useSettingController } from "@services/device";

const SettingPV = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    // const {rData} = useDeviceOverview();
    const { updateStrings } = useSettingController();
    const scrollRef = useAnimatedRef();
    const formLayout = useRef({});

    const {
        handleSubmit,
        formState: { errors },
        control,
        watch,
        reset,
    } = useForm({
        mode: "onTouched",
        reValidateMode: "onChange",
        defaultValues: {
            strings: ["1", "0", "1", "0", "1", "0", "1", "1", "1", "1", "1", "1", "1", "1", "1", "0", "1", "1", "1", "0"],
        },
    });

    const { fields } = useFieldArray({
        control,
        name: "strings",
    });

    const fieldArrayString = useRef(fields.map((item, index) => `strings.${index}`)).current;

    const onError = (errors) => {
        for (let i = 0; i < fieldArrayString.length; i++) {
            if (errors.strings?.[i]) {
                scrollRef.current.scrollTo({ y: formLayout.current[fieldArrayString[i]] });
                return;
            }
        }
    };

    const onSubmit = async (data, e) => {
        try {
            dispatch(openIconLoadingOverlay());

            updateStrings(data);
            dispatch(closeIconLoadingOverlay);
            showToast({ type: "success", title: "Thêm lỗi tiềm ẩn", description: "Thành công !" });
            reset({}, { keepDefaultValues: true });
        } catch (e) {
            dispatch(closeIconLoadingOverlay);
            showToast({ type: "error", title: "Thêm lỗi", description: "Lỗi: " + e.message });
        }
    };

    const measureY = (event, fieldName) => {
        formLayout.current[fieldName] = event.nativeEvent.layout.y;
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={styles.container}>
            <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <View style={styles.registerBlock}>
                    <View style={styles.formContainer}>
                        {/* Tên lỗi */}
                        {fields.map((item, index) => {
                            return (
                                <View
                                    key={item.id}
                                    onLayout={(event) => measureY(event, `strings.${index}`)}
                                    style={styles.blockInput}
                                >
                                    <View style={styles.inputContainer}>
                                        <View style={styles.titleInput}>
                                            <AppTextMedium>pv{index}</AppTextMedium>
                                            <AppText style={styles.requireIcon}>*</AppText>
                                            <FormErrorMessage error={errors?.strings?.[index]} />
                                        </View>

                                        <Controller
                                            name={`strings.${index}`}
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
                                                        placeholder="Nhập giá trị"
                                                        placeholderTextColor={Color.gray_6}
                                                        style={styles.input}
                                                        onBlur={onBlur}
                                                        defaultValue={value}
                                                        onChangeText={onChange}
                                                        value={value}
                                                    />
                                                );
                                            }}
                                        />
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>
            <View style={styles.blockAction}>
                <Pressable onPress={handleSubmit(onSubmit, onError)} style={styles.buttonRegister}>
                    <Text style={styles.textRegister}>Cập nhật</Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
};

export default SettingPV;

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
        flex: 1,
        flexDirection: "row",
        paddingHorizontal: 8 * unit,
        flexWrap: "wrap",
        // paddingBottom: 4 * rem,
    },
    blockInput: {
        width: "50%",
        paddingHorizontal: 8 * unit,
        flexDirection: "row",
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
        paddingVertical: 8 * unit,
        paddingHorizontal: 12 * unit,
        justifyContent: "center",
        borderRadius: 8,
        backgroundColor: Color.gray_2,
        fontFamily: GoogleSansFontType.regular,
    },
    blockAction: {
        flexDirection: "row",
        flexWrap: "wrap",
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
        flexDirection: "row",
        paddingVertical: 12 * unit,
        paddingHorizontal: 12 * unit,
        alignItems: "center",
        borderRadius: 6,
        backgroundColor: Color.gray_2,
        fontFamily: GoogleSansFontType.regular,
    },
    displaySelect: {},
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
    itemSelectStringContainer: {
        flexDirection: "row",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    itemStringSelect: {
        flex: 1,
        textAlign: "center",
        textAlignVertical: "center",
        paddingVertical: 6 * unit,
        paddingHorizontal: 16 * unit,
        fontFamily: GoogleSansFontType.medium,
        fontSize: 15 * unit,
        color: Color.gray_9,
        backgroundColor: Color.gray_1,
        borderRadius: 16,
    },
    activeItemStringSelect: {
        flex: 1,
        color: "white",
        backgroundColor: ColorDefault.primary,
        borderRadius: 24 * unit,
    },
});
