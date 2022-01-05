import { AppText, AppTextBold, AppTextMedium } from "@common-ui/AppText";
import BottomSheet from "@common-ui/Modal/BottomSheet";
import { useFetchRealtimeDevices } from "@services/factory";
import { Color } from "@theme/colors";
import { HEIGHT } from "@theme/scale";
import { unit } from "@theme/styleContants";
import { GoogleSansFontType } from "@theme/typography";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Octicons } from "@expo/vector-icons";
import { JumpLogo } from "@common-ui/Loading/JumpLogo";
import { round2 } from "@utils/helps/functions";
import { useNavigation } from "@react-navigation/native";
import { NAVIGATION } from "constant/navigation";

const ModalRealTimeDevice = forwardRef(({}, ref) => {
    const mount = useRef(true);
    const myModalRef = useRef();
    const [plant, setPlant] = useState();
    const navigation = useNavigation();

    const { data, isValidating, error } = useFetchRealtimeDevices({ station_code: plant?.stationCode });

    const devices = data?.data || [];

    useEffect(() => {
        return () => {
            mount.current = false;
        };
    }, []);

    useImperativeHandle(
        ref,
        () => ({
            open: ({ plant }) => {
                myModalRef.current.open();
                requestAnimationFrame(() => setPlant(plant));
            },
            close: () => {
                myModalRef.current.close();
                setTimeout(() => setPlant(null), 300);
            },
        }),
        []
    );

    const renderItem = ({ item, index }) => {
        const { devName, created_at, data, device_id } = item;

        let active_power, day_cap;

        try {
            const decodedData = JSON.parse(data);
            active_power = decodedData.active_power || 0;
            day_cap = decodedData.day_cap || 0;
        } catch (e) {}

        return (
            <View style={styles.itemContainer}>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() =>
                        navigation.navigate(NAVIGATION.DETAIL_DEVICE, {
                            device: {
                                device_id: device_id,
                                devName: devName,
                            },
                        })
                    }
                    style={{ flex: 4 }}
                >
                    <AppText style={{ fontSize: 13 * unit, color: Color.blueDark }}>{devName}</AppText>
                </TouchableOpacity>
                <View style={{ flex: 4, flexDirection: "row", flexWrap: "wrap" }}>
                    <AppTextMedium style={{ color: Color.redPastel, fontSize: 13 * unit }}>
                        {round2(active_power) || 0}
                    </AppTextMedium>
                    <Text> / </Text>
                    <AppTextMedium style={{ color: Color.blueModernDark, fontSize: 13 * unit }}>
                        {round2(day_cap) || 0}
                    </AppTextMedium>
                </View>

                <View style={{ flex: 3 }}>
                    <AppText style={{ fontSize: 13 * unit }}>{created_at}</AppText>
                </View>
            </View>
        );
    };

    return (
        <BottomSheet onAnimatedCloseEnd={() => setPlant(undefined)} ref={myModalRef} bottomSheetStyle={styles.modalContainer}>
            <View style={styles.modal}>
                {/* Title */}
                <View style={styles.blockTitle}>
                    <View style={styles.titleContainer}>
                        <Octicons
                            name="x"
                            size={26}
                            color={Color.gray_10}
                            style={styles.backIcon}
                            onPress={() => myModalRef.current.close()}
                        />
                        <Text style={styles.titleModal}>Thiết bị nhà máy</Text>
                    </View>

                    <AppText style={styles.content}>{plant?.stationName}</AppText>
                </View>

                {/* List Detail Machine */}
                {plant && (
                    <View style={{ flex: 1 }}>
                        {isValidating ? (
                            <View style={styles.loading}>
                                <JumpLogo />
                            </View>
                        ) : (
                            <FlatList
                                contentContainerStyle={styles.flatlistContainer}
                                ListHeaderComponent={
                                    <View style={styles.headerContainer}>
                                        <View style={{ flex: 4 }}>
                                            <AppTextBold>Thiết bị</AppTextBold>
                                        </View>
                                        <View style={{ flex: 4 }}>
                                            <AppTextBold>CS phát / SL</AppTextBold>
                                        </View>

                                        <View style={{ flex: 3 }}>
                                            <AppTextBold>Time</AppTextBold>
                                        </View>
                                    </View>
                                }
                                ListEmptyComponent={
                                    <View>
                                        <AppText>Dữ liệu trống</AppText>
                                    </View>
                                }
                                data={devices}
                                keyExtractor={(i) => i.device_id}
                                renderItem={renderItem}
                                stickyHeaderIndices={[0]}
                            />
                        )}
                    </View>
                )}
            </View>
        </BottomSheet>
    );
});

export default ModalRealTimeDevice;

const styles = StyleSheet.create({
    modalContainer: {
        height: HEIGHT * 0.95,
        bottom: -HEIGHT * 0.1,
    },
    modal: {
        flex: 1,
        backgroundColor: "white",
        borderRadius: 12 * unit,
        paddingBottom: HEIGHT * 0.1,
    },
    blockTitle: {
        paddingVertical: 20 * unit,
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    backIcon: {
        paddingHorizontal: 20 * unit,
        paddingVertical: 8 * unit,
    },
    loading: {
        minHeight: 360 * unit,
        justifyContent: "center",
        alignItems: "center",
    },
    titleModal: {
        fontSize: 20 * unit,
        fontFamily: GoogleSansFontType.bold,
        color: Color.gray_9,
    },
    flatlistContainer: {
        padding: 20 * unit,
        paddingTop: 0,
    },
    headerContainer: {
        flex: 1,
        flexDirection: "row",
        paddingVertical: 8 * unit,
        backgroundColor: "white",
    },
    itemContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8 * unit,
        borderTopWidth: 1,
        borderTopColor: Color.gray_3,
    },
    content: {
        color: Color.gray_10,
        paddingHorizontal: 20 * unit,
    },
    footerModal: {
        flexDirection: "row",
        marginHorizontal: 6 * unit,
        paddingTop: 12 * unit,
        borderTopWidth: 1,
        borderTopColor: Color.gray_2,
    },
    buttonFooterModal: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    textButtonFooterModal: {
        fontSize: 16 * unit,
        paddingHorizontal: 4 * unit,
        color: Color.gray_10,
        fontFamily: GoogleSansFontType.bold,
    },
});
