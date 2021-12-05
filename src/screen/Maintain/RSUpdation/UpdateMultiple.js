import { AppText, AppTextMedium } from "@common-ui/AppText";
import Selection from "@common-ui/Form/Selection";
import { showToast } from "@common-ui/ToastNotify/ToastManager";
import { useRoute, useNavigation } from "@react-navigation/native";
import { closeIconLoadingOverlay, openIconLoadingOverlay } from "@redux/actions/app";
import { useCommonErrorControl } from "@services/error";
import { Color } from "@theme/colors";
import { unit } from "@theme/styleContants";
import React, { useLayoutEffect, useRef } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useDispatch } from "react-redux";
import { AntDesign } from "@expo/vector-icons";

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

const RSMultipleUpdation = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const route = useRoute();
    const { errorIds = [], key } = route.params || {};
    const reasonInputRef = useRef();
    const reasonRef = useRef();
    const solutionRef = useRef();

    const { updateMultipeRSError } = useCommonErrorControl({ key });

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Cập nhật " + errorIds.length + " lỗi",
        });
    }, []);

    const handleUpdate = async () => {
        try {
            dispatch(openIconLoadingOverlay());
            await updateMultipeRSError({
                errorIds: errorIds,
                reason: reasonRef.current,
                solution: solutionRef.current,
            });

            dispatch(closeIconLoadingOverlay);
            navigation.goBack();
            showToast({ type: "success", title: "Cập nhật lỗi", description: "Thành công !" });
        } catch (e) {
            dispatch(closeIconLoadingOverlay);
            showToast({ type: "error", title: "Cập nhật lỗi", description: "Lỗi: " + e.message });
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={[styles.block, { marginBottom: 0 }]}>
                    <View style={{ padding: 16 * unit, backgroundColor: "white" }}>
                        <AppText>Nguyên nhân</AppText>
                        <TextInput
                            ref={reasonInputRef}
                            style={styles.input}
                            multiline={true}
                            placeholder="Nhập nguyên nhân"
                            numberOfLines={8}
                            onChangeText={(text) => {
                                reasonRef.current = text;
                            }}
                        />
                        <AppText>Giải pháp</AppText>
                        <TextInput
                            style={styles.input}
                            multiline={true}
                            placeholder="Nhập giải pháp"
                            numberOfLines={8}
                            onChangeText={(text) => {
                                solutionRef.current = text;
                            }}
                        />
                    </View>
                </View>
            </ScrollView>
            <Pressable onPress={handleUpdate} style={styles.updateButton}>
                <AppTextMedium style={{ color: "white", fontSize: 15 * unit }}>Cập nhật</AppTextMedium>
            </Pressable>
        </View>
    );
};

export default RSMultipleUpdation;

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
});
