import { AppText, AppTextBold, AppTextMedium } from "@common-ui/AppText";
import Drawer from "@common-ui/Modal/Drawer";
import { Color } from "@theme/colors";
import { ColorDefault } from "@theme/index";
import { WIDTH } from "@theme/scale";
import { rem, unit } from "@theme/styleContants";
import React, { Fragment, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Constants } from "react-native-unimodules";
import { useForm, Controller } from "react-hook-form";
import { Feather } from "@expo/vector-icons";
import { debounce, throttle } from "@utils/helps/functions";

const firms = [
    { key: "", value: "Tất cả" },
    { key: "HUAWEI", value: "HUAWEI" },
    { key: "SMA", value: "SMA" },
];

const Tag = React.memo(
    ({ getValues, onChange, item = { key, value }, isActive }) => {
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                style={[styles.tag, isActive ? { backgroundColor: ColorDefault.primary } : {}]}
                onPress={() => {
                    onChange(item);
                }}
            >
                <AppText style={isActive ? { color: "white" } : { color: "dimgray" }}>{item.value}</AppText>
            </TouchableOpacity>
        );
    },
    (prev, next) => prev.isActive == next.isActive
);

const FilterDrawer = ({ drawerRef, onConfirm, onReset }) => {
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
        defaultValues: {
            station_name: "",
            firm: firms[0],
            gender: { key: "0-10kWp", value: "0-10kWp" },
        },
    });
    const onSubmit = (data) => {
        drawerRef.current.close();
        onConfirm({
            station_name: { key: data.station_name, value: data.station_name },
            firm: data.firm,
        });
    };

    return (
        <Drawer ref={drawerRef} drawerStyle={{ width: WIDTH * 0.8, backgroundColor: "white" }}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                <View
                    style={{
                        paddingTop: Constants.statusBarHeight + 11 * unit,
                        paddingBottom: 12 * unit,
                        paddingHorizontal: 18 * unit,
                        borderBottomWidth: 1,
                        borderBottomColor: Color.gray_2,
                        backgroundColor: Color.gray_0,
                    }}
                >
                    <AppTextBold style={{ fontSize: 17 * unit, color: "black", color: Color.gray_10, letterSpacing: 0.2 }}>
                        BỘ LỌC TÌM KIẾM
                    </AppTextBold>
                </View>

                <View style={{ paddingHorizontal: 18 * unit, flex: 1 }}>
                    {/* Tên */}
                    <View style={{ paddingVertical: rem }}>
                        <AppTextMedium style={{ fontSize: 15, color: Color.gray_10 }}>Tên nhà máy</AppTextMedium>
                        <View style={{ flexDirection: "row", flexWrap: "wrap", paddingVertical: 8 * unit }}>
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    backgroundColor: "white",
                                    borderRadius: 6,
                                    borderWidth: 1,
                                    borderColor: Color.gray_4,
                                    padding: rem / 2,
                                }}
                            >
                                <Feather name="search" size={18 * unit} color="dimgray" />
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
                                                placeholder="Nhập một vài từ để tìm kiếm"
                                                placeholderTextColor={Color.gray_6}
                                                style={{ flex: 1, paddingLeft: 8 * unit }}
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
                    </View>

                    {/* Tổng công suất chuỗi */}
                    <View style={{ paddingVertical: rem }}>
                        <AppTextMedium style={{ fontSize: 15, color: Color.gray_10 }}>Tổng công suất chuỗi</AppTextMedium>
                        <View style={{ flexDirection: "row", flexWrap: "wrap", paddingVertical: 8 * unit }}>
                            <Controller
                                control={control}
                                name="gender"
                                rules={{
                                    required: { value: true, message: "Cần chọn ít nhất 1 giới tính!" },
                                }}
                                render={({
                                    field: { onChange, onBlur, value, name, ref },
                                    fieldState: { invalid, isTouched, isDirty, error },
                                    formState,
                                }) => {
                                    return (
                                        <Fragment>
                                            {["Tất cả", "0-10kWp", "10-50kWp", "50-100kWp", "100kWp-1MWp", ">1MWp"].map(
                                                (item, index) => {
                                                    return (
                                                        <Tag
                                                            key={index}
                                                            getValues={getValues}
                                                            onChange={onChange}
                                                            item={{ key: item, value: item }}
                                                            isActive={item == value.value}
                                                        />
                                                    );
                                                }
                                            )}
                                        </Fragment>
                                    );
                                }}
                            />
                        </View>
                    </View>

                    {/* Hãng */}
                    <View style={{ paddingVertical: rem }}>
                        <AppTextMedium style={{ fontSize: 15, color: Color.gray_10 }}>Hãng</AppTextMedium>
                        <View style={{ flexDirection: "row", flexWrap: "wrap", paddingVertical: 8 * unit }}>
                            <Controller
                                control={control}
                                name="firm"
                                rules={{
                                    required: { value: true, message: "Cần chọn ít nhất 1 giới tính!" },
                                }}
                                render={({
                                    field: { onChange, onBlur, value, name, ref },
                                    fieldState: { invalid, isTouched, isDirty, error },
                                    formState,
                                }) => {
                                    return (
                                        <Fragment>
                                            {firms.map((item, index) => {
                                                return (
                                                    <Tag
                                                        key={index}
                                                        getValues={getValues}
                                                        onChange={onChange}
                                                        item={item}
                                                        isActive={item.key == value.key}
                                                    />
                                                );
                                            })}
                                        </Fragment>
                                    );
                                }}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    paddingHorizontal: 18 * unit,
                    paddingBottom: 10,
                }}
            >
                <TouchableOpacity
                    style={[styles.button, styles.buttonReset]}
                    onPress={() => {
                        reset({}, { keepDefaultValues: true });
                    }}
                >
                    <AppText style={{ color: ColorDefault.primary }}> Đặt lại </AppText>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.buttonConfirm]} onPress={handleSubmit(onSubmit)}>
                    <AppText style={{ color: "white" }}> Xác nhận </AppText>
                </TouchableOpacity>
            </View>
        </Drawer>
    );
};

export default React.memo(FilterDrawer, () => true);

const styles = StyleSheet.create({
    tag: {
        marginVertical: 6 * unit,
        marginRight: 6 * unit,
        paddingHorizontal: 20 * unit,
        paddingVertical: 6 * unit,
        borderRadius: 20 * unit,
        backgroundColor: "#f7f7f7",
    },
    button: {
        marginVertical: 10,
        marginHorizontal: 5,
        padding: 10,
    },
    buttonConfirm: {
        backgroundColor: ColorDefault.primary,
    },
    buttonReset: {
        borderWidth: 1,
        borderColor: ColorDefault.primary,
        backgroundColor: "white",
    },
});
