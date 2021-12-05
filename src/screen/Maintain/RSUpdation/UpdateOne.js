import { AppText, AppTextMedium } from "@common-ui/AppText";
import Selection from "@common-ui/Form/Selection";
import { showToast } from "@common-ui/ToastNotify/ToastManager";
import { useRoute, useNavigation } from "@react-navigation/native";
import { closeIconLoadingOverlay, openIconLoadingOverlay } from "@redux/actions/app";
import { useCommonErrorControl } from "@services/error";
import { Color } from "@theme/colors";
import { unit } from "@theme/styleContants";
import React, { Fragment, useCallback, useEffect, useRef } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useDispatch } from "react-redux";
import { AntDesign } from "@expo/vector-icons";

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
    const { device, factory, error_name, created_at, reason, solution, status } = error;
    const reasonInputRef = useRef();
    const reasonRef = useRef();
    const solutionRef = useRef();
    const statusRef = useRef(status);

    const { updateError } = useCommonErrorControl({ key });

    useEffect(() => {
        setTimeout(() => {
            // reasonInputRef.current?.focus();
        }, 500);
    }, []);

    const handleUpdate = async () => {
        try {
            dispatch(openIconLoadingOverlay());
            await updateError({
                ...error,
                reason: reasonRef.current,
                solution: solutionRef.current,
                status: statusRef.current,
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

                <View style={[styles.block, { marginBottom: 0 }]}>
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
});
