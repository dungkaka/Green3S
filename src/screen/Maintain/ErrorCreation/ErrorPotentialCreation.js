import { AppText, AppTextMedium } from "@common-ui/AppText";
import { showToast } from "@common-ui/ToastNotify/ToastManager";
import { closeIconLoadingOverlay, openIconLoadingOverlay } from "@redux/actions/app";
import { Color } from "@theme/colors";
import { AppColor, ColorDefault } from "@theme/index";
import { rem, unit } from "@theme/styleContants";
import { GoogleSansFontType, NunitoType } from "@theme/typography";
import React, { Fragment, useEffect, useMemo, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View, TextInput, Image, ScrollView } from "react-native";
import { useAnimatedRef } from "react-native-reanimated";
import FormErrorMessage from "@common-ui/Form/FormErrorMessage";
import { useDispatch } from "react-redux";
import Selection from "@common-ui/Form/Selection";
import ImagePickerOne from "@common-ui/Image/ImagePickerOne";
import { MaterialIcons, Feather, AntDesign } from "@expo/vector-icons";
import { hitSlop10 } from "@common-ui/Pressable/utils";
import { useListPlants } from "@services/factory";
import { useListDevice } from "@services/device";
import { useCommonErrorControl } from "@services/error";
import { useRoute, useNavigation } from "@react-navigation/native";
import { CRUD } from "constant/crud";
import { ModalDatePicker } from "@common-ui/Calendar/DatePickerModal";
import { time, format } from "@utils/helps/time";
import MultipleSelection from "@common-ui/Form/MultipleSelection";

const dataSelectString = new Array(24).fill(0).map((_, i) => {
    return { key: `pv${i + 1}`, value: `pv${i + 1}` };
});

const statusAcceptSelection = [
    {
        key: 0,
        value: "Chưa sửa",
    },
    {
        key: 1,
        value: "Đã sửa",
    },
];

const ErrorPotentialCreation = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { params } = useRoute();
    const { type: TYPE = CRUD.CREATE, key, error } = params || {};
    const { addPotentialError, updatePotentialError } = useCommonErrorControl({ key });
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
        defaultValues:
            TYPE == CRUD.UPDATE
                ? {
                      error_name: error.name,
                      plant: error.factory
                          ? {
                                key: error.factory.stationCode,
                                value: error.factory.stationName,
                            }
                          : undefined,
                      device: error.device
                          ? {
                                key: error.device.device_id,
                                value: error.device.devName,
                            }
                          : undefined,
                      suggest: error.idea,
                      reason: error.reason,
                      status: error.status_name,
                      string: (() => {
                          const strings = JSON.parse(error.string) || [];
                          return dataSelectString.filter((string) => strings.some((s) => s == string.key));
                      })(),
                      date_repair: error.date_repair ? time(error.date_repair).toDateObject() : undefined,
                      content: error.content,
                      status_accept:
                          statusAcceptSelection.find((status) => status.key == error.status_accept) || statusAcceptSelection[0],
                  }
                : {
                      images: [],
                  },
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

    useEffect(() => {
        if (TYPE == CRUD.UPDATE)
            navigation.setOptions({
                title: "Cập nhật lỗi tiềm ẩn",
            });
    }, []);

    const onError = (errors) => {
        for (let i = 0; i < fieldArray.length; i++) {
            if (errors[fieldArray[i]]) {
                scrollRef.current.scrollTo({ y: formLayout.current[fieldArray[i]] });
                return;
            }
        }
    };

    const createError = async (data) => {
        try {
            dispatch(openIconLoadingOverlay());
            const newPotentialError = {
                errorName: data.error_name,
                stationCode: data.plant.key,
                deviceId: data.device.key,
                other_device: data.other_device,
                status: data.status,
                string: data.string.map((s) => s.key),
                reason: data.reason,
                idea: data.suggest,
                images: data.images,
            };

            await addPotentialError(newPotentialError);
            dispatch(closeIconLoadingOverlay);
            showToast({ type: "success", title: "Thêm lỗi tiềm ẩn", description: "Thành công !" });
            reset({}, { keepDefaultValues: true });
        } catch (e) {
            dispatch(closeIconLoadingOverlay);
            showToast({ type: "error", title: "Thêm lỗi", description: "Lỗi: " + e.message });
        }
    };

    const updateError = async (data) => {
        try {
            dispatch(openIconLoadingOverlay());
            const newPotentialError = {
                id: error.id,
                errorName: data.error_name,
                stationCode: data.plant.key,
                deviceId: data.device.key,
                other_device: data.other_device,
                status: data.status,
                string: data.string.map((s) => s.key),
                reason: data.reason,
                idea: data.suggest,
                date_repair: format(data.date_repair),
                status_accept: data.status_accept.key,
            };

            await updatePotentialError(newPotentialError);
            dispatch(closeIconLoadingOverlay);
            navigation.goBack();
            showToast({ type: "success", title: "Cập nhật lỗi tiềm ẩn", description: "Thành công !" });
        } catch (e) {
            dispatch(closeIconLoadingOverlay);
            showToast({ type: "error", title: "Cập nhật lỗi", description: "Thất bại: " + e.message });
        }
    };

    const onSubmit = (data, e) => {
        switch (TYPE) {
            case CRUD.CREATE:
                return createError(data);
            case CRUD.UPDATE:
                return updateError(data);
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
                        {TYPE == CRUD.UPDATE && (
                            <Fragment>
                                {/* Ngày sửa */}
                                <View onLayout={(event) => measureY(event, "date_repair")} style={styles.blockInput}>
                                    <View style={styles.inputContainer}>
                                        <View style={styles.titleInput}>
                                            <AppTextMedium>Ngày sửa</AppTextMedium>
                                            <AppText style={styles.requireIcon}></AppText>
                                            <FormErrorMessage error={errors?.date_repair} />
                                        </View>

                                        <Controller
                                            name="date_repair"
                                            control={control}
                                            render={({
                                                field: { onChange, onBlur, value, name, ref },
                                                fieldState: { invalid, isTouched, isDirty, error },
                                                formState,
                                            }) => {
                                                const modalDatePickerRef = useRef();
                                                return (
                                                    <Fragment>
                                                        <Pressable
                                                            onPress={() => {
                                                                modalDatePickerRef.current.open(value);
                                                            }}
                                                            style={styles.selection}
                                                        >
                                                            <AntDesign name="calendar" size={18} color={Color.gray_8} />
                                                            <AppTextMedium
                                                                style={{ color: Color.gray_8, paddingHorizontal: 8 * unit }}
                                                            >
                                                                {value
                                                                    ? `${value.day}/${value.month}/${value.year}`
                                                                    : "Chọn ngày"}
                                                            </AppTextMedium>
                                                        </Pressable>
                                                        <ModalDatePicker
                                                            ref={modalDatePickerRef}
                                                            initialDate={value || time().toDateObject()}
                                                            delayRender={1000}
                                                            onOk={() => {
                                                                modalDatePickerRef.current.close();
                                                                onChange(modalDatePickerRef.current.getData().date);
                                                            }}
                                                        />
                                                    </Fragment>
                                                );
                                            }}
                                        />
                                    </View>
                                </View>

                                {/* Nội dung sửa */}
                                <View onLayout={(event) => measureY(event, "content")} style={styles.blockInput}>
                                    <View style={styles.inputContainer}>
                                        <View style={styles.titleInput}>
                                            <AppTextMedium>Nội dung sửa</AppTextMedium>
                                            <AppText style={styles.requireIcon}></AppText>
                                            <FormErrorMessage error={errors?.content} />
                                        </View>

                                        <Controller
                                            name="content"
                                            control={control}
                                            render={({
                                                field: { onChange, onBlur, value, name, ref },
                                                fieldState: { invalid, isTouched, isDirty, error },
                                                formState,
                                            }) => {
                                                return (
                                                    <TextInput
                                                        placeholder="Nhập nội dung sửa"
                                                        multiline
                                                        placeholderTextColor={Color.gray_6}
                                                        style={[styles.input, { textAlignVertical: "top", height: 200 }]}
                                                        onBlur={onBlur}
                                                        onChangeText={onChange}
                                                        value={value}
                                                    />
                                                );
                                            }}
                                        />
                                    </View>
                                </View>

                                {/* Nhà máy */}
                                <View onLayout={(event) => measureY(event, "status_accept")} style={styles.blockInput}>
                                    <View style={styles.inputContainer}>
                                        <View style={styles.titleInput}>
                                            <AppTextMedium>Trạng thái sửa</AppTextMedium>
                                            <AppText style={styles.requireIcon}></AppText>
                                            <FormErrorMessage error={errors?.status_accept} />
                                        </View>

                                        <Controller
                                            name="status_accept"
                                            control={control}
                                            render={({
                                                field: { onChange, onBlur, value, name, ref },
                                                fieldState: { invalid, isTouched, isDirty, error },
                                                formState,
                                            }) => {
                                                return useMemo(() => {
                                                    return (
                                                        <Selection
                                                            initialOption={statusAcceptSelection.find(
                                                                (status) => status.key == value?.key
                                                            )}
                                                            data={statusAcceptSelection}
                                                            containerStyle={styles.selection}
                                                            title="Nhà máy"
                                                            required
                                                            onChange={onChange}
                                                            renderValueComponent={(select) => {
                                                                if (select)
                                                                    return (
                                                                        <AppText style={{ color: "black" }}>
                                                                            {select.value}
                                                                        </AppText>
                                                                    );
                                                                return (
                                                                    <AppText style={{ color: Color.gray_6 }}>
                                                                        Chọn trạng thái
                                                                    </AppText>
                                                                );
                                                            }}
                                                        />
                                                    );
                                                }, []);
                                            }}
                                        />
                                    </View>
                                </View>
                            </Fragment>
                        )}

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
                                    name="images"
                                    control={control}
                                    render={({
                                        field: { onChange, onBlur, value, name, ref },
                                        fieldState: { invalid, isTouched, isDirty },
                                        formState,
                                    }) => {
                                        if (TYPE == CRUD.UPDATE) {
                                            const imageUrl = JSON.parse(error?.image);

                                            if (!imageUrl) return <AppText>Trống</AppText>;

                                            return (
                                                <View
                                                    style={{
                                                        paddingVertical: 8 * unit,
                                                        flexDirection: "row",
                                                        flexWrap: "wrap",
                                                    }}
                                                >
                                                    {imageUrl?.map((imageUrl, index) => (
                                                        <Image
                                                            key={index}
                                                            source={{
                                                                uri: `https://green3s.vn/uploads/errors/${error.stationCode}/${imageUrl}`,
                                                            }}
                                                            style={{
                                                                width: 96,
                                                                height: 96,
                                                                borderRadius: 8,
                                                                marginRight: 8,
                                                            }}
                                                        />
                                                    ))}
                                                </View>
                                            );
                                        }

                                        return (
                                            <ScrollView horizontal>
                                                <ImagePickerOne
                                                    style={{
                                                        paddingVertical: 8 * unit,
                                                    }}
                                                    initialValue={value}
                                                    onChangeImage={(newImage) => {
                                                        onChange([newImage, ...value]);
                                                    }}
                                                >
                                                    <View style={styles.imageCreate}>
                                                        <MaterialIcons name="add" size={18} color={Color.gray_8} />
                                                        <AppText style={styles.imageCreateText}>Thêm ảnh</AppText>
                                                    </View>
                                                </ImagePickerOne>

                                                {value?.map((image, index) => (
                                                    <ImagePickerOne
                                                        key={image.uri}
                                                        style={{
                                                            margin: 8 * unit,
                                                        }}
                                                        initialValue={value}
                                                        onChangeImage={(newImage) => {
                                                            value[index] = newImage;
                                                            onChange([...value]);
                                                        }}
                                                    >
                                                        <Image source={{ uri: image.uri || null }} style={styles.imageShow} />
                                                        <View style={styles.iconFixContainer}>
                                                            <MaterialIcons name="auto-fix-high" size={18} color="white" />
                                                        </View>
                                                        <Pressable
                                                            hitSlop={hitSlop10}
                                                            onPress={() => onChange(value.filter((ig) => ig.uri != image.uri))}
                                                            style={styles.iconDeteleImageContainer}
                                                        >
                                                            <Feather name="trash-2" size={18} color="white" />
                                                        </Pressable>
                                                    </ImagePickerOne>
                                                ))}
                                            </ScrollView>
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
                                    <FormErrorMessage error={errors?.plant} />
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
                                                    disabled={!plantData}
                                                    initialOption={dataSelectPlants.find((plant) => plant.key == value?.key)}
                                                    data={dataSelectPlants}
                                                    containerStyle={styles.selection}
                                                    title="Nhà máy"
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
                                                    disabled={!deviceData}
                                                    initialOption={dataSelectDevices.find((device) => device.key == value?.key)}
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

                        {/* Trạng thái */}
                        <View onLayout={(event) => measureY(event, "other_device")} style={styles.blockInput}>
                            <View style={styles.inputContainer}>
                                <View style={styles.titleInput}>
                                    <AppTextMedium>Thiết bị khác (Nếu có)</AppTextMedium>
                                    <AppText style={styles.requireIcon}></AppText>
                                    <FormErrorMessage error={errors?.other_device} />
                                </View>

                                <Controller
                                    name="other_device"
                                    control={control}
                                    render={({
                                        field: { onChange, onBlur, value, name, ref },
                                        fieldState: { invalid, isTouched, isDirty, error },
                                        formState,
                                    }) => {
                                        return (
                                            <TextInput
                                                placeholder="Nhập thiết bị khác"
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

                        {/* String */}
                        <View onLayout={(event) => measureY(event, "string")} style={styles.blockInput}>
                            <View style={styles.inputContainer}>
                                <View style={styles.titleInput}>
                                    <AppTextMedium>String</AppTextMedium>
                                    <AppText style={styles.requireIcon}></AppText>
                                    <FormErrorMessage error={errors?.string} />
                                </View>

                                <Controller
                                    name="string"
                                    control={control}
                                    render={({
                                        field: { onChange, onBlur, value, name, ref },
                                        fieldState: { invalid, isTouched, isDirty, error },
                                        formState,
                                    }) => {
                                        return (
                                            <MultipleSelection
                                                data={dataSelectString}
                                                containerStyle={styles.selection}
                                                initialOptions={value}
                                                title="String"
                                                required
                                                onChange={onChange}
                                                renderValueComponent={(selects) => {
                                                    if (selects.length > 0)
                                                        return selects.map((select) => (
                                                            <AppText key={select.key} style={{ color: "black" }}>
                                                                {select.value},{" "}
                                                            </AppText>
                                                        ));
                                                    return <AppText style={{ color: Color.gray_6 }}>Chọn string</AppText>;
                                                }}
                                                flatListProps={{
                                                    numColumns: 3,
                                                }}
                                                OptionItem={({ option, isActive }) => (
                                                    <View style={styles.itemSelectStringContainer}>
                                                        <AppText
                                                            style={[
                                                                styles.itemStringSelect,
                                                                isActive ? styles.activeItemStringSelect : {},
                                                            ]}
                                                        >
                                                            {option?.value.toString()}
                                                        </AppText>
                                                    </View>
                                                )}
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
                                                multiline
                                                placeholderTextColor={Color.gray_6}
                                                style={[styles.input, { textAlignVertical: "top", height: 200 }]}
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
                                                multiline={true}
                                                placeholderTextColor={Color.gray_6}
                                                style={[styles.input, { textAlignVertical: "top", height: 200 }]}
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
                                <Text style={styles.textRegister}>{TYPE == CRUD.UPDATE ? "Cập nhật lỗi" : "Tạo lỗi"}</Text>
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
