import { Color } from "@theme/colors";
import { WIDTH } from "@theme/scale";
import { rem, unit } from "@theme/styleContants";
import { GoogleSansFontType, NunitoType } from "@theme/typography";
import React, { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { useLogin } from "@services/auth";
import { useDispatch } from "react-redux";
import { closeIconLoadingOverlay, openIconLoadingOverlay } from "@redux/actions/app";
import ModalAlert from "@common-ui/Modal/ModalAlert";
import { delay } from "@utils/helps/functions";
import { showToast } from "@common-ui/ToastNotify/ToastManager";
import { CacheStorage } from "@utils/local-file-sytem";

const Login = () => {
    const { revalidateRemoteUser } = useLogin();
    const dispatch = useDispatch();
    const modalAlertRef = useRef();

    const navigation = useNavigation();
    const {
        register,
        getValues,
        setValue,
        handleSubmit,
        trigger,
        formState: { errors },
        control,
        reset,
    } = useForm({
        mode: "onTouched",
        reValidateMode: "onChange",
    });

    const animatedImage = useSharedValue(-15);

    const styleImage = useAnimatedStyle(() => ({
        transform: [{ rotateZ: animatedImage.value + "deg" }],
    }));

    useEffect(() => {
        animatedImage.value = withRepeat(
            withTiming(15, {
                duration: 10000,
                easing: Easing.bezier(0, 0, 1, 1),
            }),
            -1,
            true
        );
    }, []);

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <View style={styles.headContainer}>
                <Animated.Image
                    source={require("@assets/images/login-plant.png")}
                    resizeMode="contain"
                    style={[{ width: 0.6 * WIDTH, height: 0.6 * WIDTH }, styleImage]}
                    fadeDuration={0}
                />
            </View>

            <View style={styles.loginFormContainer}>
                <Text style={styles.titleLogin}>LOGIN</Text>
                <View style={styles.formContainer}>
                    <View style={styles.blockInput}>
                        <View style={styles.inputContainer}>
                            <AntDesign name="user" size={18 * unit} color={Color.gray_6} />
                            <Controller
                                name="station_name"
                                control={control}
                                render={({
                                    field: { onChange, onBlur, value, name, ref },
                                    fieldState: { invalid, isTouched, isDirty, error },
                                    formState,
                                }) => {
                                    // const timeOutTextInputRef = useRef();
                                    return (
                                        <TextInput
                                            placeholder="Tên đăng nhập"
                                            placeholderTextColor={Color.gray_6}
                                            style={styles.input}
                                            onBlur={onBlur}
                                            // onChangeText={(text) =>
                                            //     throttle(timeOutTextInputRef, () => onChange(text), 300)
                                            // }
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                    );
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles.blockInput}>
                        <View style={styles.inputContainer}>
                            <AntDesign name="lock" size={18 * unit} color={Color.gray_6} />
                            <Controller
                                name="station_name"
                                control={control}
                                render={({
                                    field: { onChange, onBlur, value, name, ref },
                                    fieldState: { invalid, isTouched, isDirty, error },
                                    formState,
                                }) => {
                                    // const timeOutTextInputRef = useRef();
                                    return (
                                        <TextInput
                                            placeholder="Mật khẩu"
                                            placeholderTextColor={Color.gray_6}
                                            style={styles.input}
                                            onBlur={onBlur}
                                            // onChangeText={(text) =>
                                            //     throttle(timeOutTextInputRef, () => onChange(text), 300)
                                            // }
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                    );
                                }}
                            />
                        </View>
                    </View>

                    <View style={styles.blockForgotPassword}>
                        <Text style={styles.textForgotPassword}>Forgot password !</Text>
                    </View>

                    <View style={styles.blockAction}>
                        <Pressable
                            onPress={async () => {
                                try {
                                    dispatch(openIconLoadingOverlay());
                                    await revalidateRemoteUser(null, () => {
                                        dispatch(closeIconLoadingOverlay);
                                    });
                                } catch (e) {
                                    showToast({ type: "error" });
                                }
                            }}
                            style={styles.buttonLogin}
                        >
                            <Text style={styles.textLogin}>Login</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    headContainer: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        marginVertical: 24,
    },
    loginFormContainer: {
        marginVertical: 20 * unit,
        alignItems: "center",
        justifyContent: "flex-end",
    },
    titleLogin: {
        fontFamily: NunitoType.extrabold,
        fontSize: 30 * unit,
        paddingHorizontal: 2 * rem,
        color: "#2fb1af",
    },
    formContainer: {
        width: "100%",
        paddingHorizontal: 2 * rem,
        paddingVertical: rem,
    },
    blockInput: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingVertical: 8 * unit,
    },
    inputContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Color.gray_1,
        elevation: 1,
        borderRadius: 10,
        paddingHorizontal: rem,
        height: 52 * unit,
    },
    input: {
        flex: 1,
        paddingLeft: 8 * unit,
        paddingVertical: 4 * unit,
        fontFamily: GoogleSansFontType.regular,
    },
    blockForgotPassword: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingVertical: 8 * unit,
    },
    textForgotPassword: {
        fontFamily: GoogleSansFontType.italic,
        color: "#36b8b0",
    },
    blockAction: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingVertical: 8 * unit,
    },
    buttonLogin: {
        flex: 1,
        height: 52 * unit,
        alignItems: "center",
        backgroundColor: "#36b8b0",
        elevation: 1,
        borderRadius: 10,
        padding: rem / 2,
    },
    textLogin: {
        fontFamily: NunitoType.medium,
        color: "white",
        padding: 4 * unit,
        fontSize: 18 * unit,
    },
});
