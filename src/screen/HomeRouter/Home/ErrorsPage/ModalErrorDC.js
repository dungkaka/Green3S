import { AppText, AppTextBold, AppTextMedium } from "@common-ui/AppText";
import BottomSheet from "@common-ui/Modal/BottomSheet";
import { Color, PairColor } from "@theme/colors";
import { HEIGHT } from "@theme/scale";
import { unit } from "@theme/styleContants";
import { GoogleSansFontType } from "@theme/typography";
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { Octicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NAVIGATION } from "constant/navigation";
import { format } from "@utils/helps/time";

const ErrorItem = React.memo(
    ({ item, index, imageRef }) => {
        const navigation = useNavigation();
        return (
            <View style={styles.itemListContainer}>
                <Pressable
                    onPress={() => {
                        navigation.push(NAVIGATION.DETAIL_PLANT, {
                            ...item.factory,
                        });
                    }}
                    style={{ flex: 4, marginRight: 8 }}
                >
                    <AppText style={styles.itemTextLink}>
                        {index + 1}. {item.factory?.stationName}
                    </AppText>
                </Pressable>
                <Pressable
                    onPress={() => {
                        item.images &&
                            imageRef.current.open(
                                item.images.map((image) => ({
                                    url: image,
                                }))
                            );
                    }}
                    style={{ flex: 3, flexDirection: "row", color: Color.redPastel, marginRight: 8 }}
                >
                    <AppTextMedium
                        style={[
                            styles.itemText,
                            {
                                color: "white",
                                paddingHorizontal: 10 * unit,
                                paddingVertical: 4 * unit,
                                borderRadius: 6,
                                backgroundColor: Color.redDark,
                            },
                        ]}
                    >
                        {item.string}
                    </AppTextMedium>
                </Pressable>
                <Pressable
                    onPress={() => {
                        navigation.push(NAVIGATION.DETAIL_DEVICE, {
                            device: item.device,
                            initTime: item.created_at,
                        });
                    }}
                    style={{ flex: 3, marginRight: 8, flexDirection: "row", flexWrap: "wrap" }}
                >
                    <AppText style={styles.itemTextLink}>{item.device?.devName}</AppText>
                </Pressable>
                <View style={{ flex: 3 }}>
                    <AppText style={styles.itemText}>{format(item.created_at, "YYYY-MM-DD H:M:S")}</AppText>
                </View>
            </View>
        );
    },
    () => true
);

const ModalErrorDC = forwardRef(({ data = [], imageRef }, ref) => {
    const mount = useRef(true);
    const myModalRef = useRef();

    useEffect(() => {
        return () => {
            mount.current = false;
        };
    }, []);

    useImperativeHandle(
        ref,
        () => ({
            open: () => {
                myModalRef.current.open();
            },
            close: () => {
                myModalRef.current.close();
            },
        }),
        []
    );

    const renderItem = ({ item, index }) => {
        return <ErrorItem item={item} index={index} imageRef={imageRef} />;
    };

    return (
        <BottomSheet ref={myModalRef} unmountOnHide={true} bottomSheetStyle={styles.modalContainer}>
            <View style={styles.modal}>
                {/* Title */}
                <View style={styles.titleBlock}>
                    <View style={styles.titleContainer}>
                        <Octicons
                            name="x"
                            size={26}
                            color={PairColor.red.dark}
                            style={styles.xIcon}
                            onPress={() => myModalRef.current.close()}
                        />
                        <Text style={styles.titleModal}>Lỗi DC</Text>
                    </View>
                </View>

                <FlatList
                    initialNumToRender={3}
                    contentContainerStyle={styles.listContainer}
                    ListHeaderComponent={
                        <View style={styles.headerList}>
                            <View style={{ flex: 4, marginRight: 8 }}>
                                <AppTextBold>Nhà máy</AppTextBold>
                            </View>
                            <View style={{ flex: 3, marginRight: 8 }}>
                                <AppTextBold>String</AppTextBold>
                            </View>
                            <View style={{ flex: 3, marginRight: 8 }}>
                                <AppTextBold>Thiết bị</AppTextBold>
                            </View>
                            <View style={{ flex: 3 }}>
                                <AppTextBold>Ngày tạo</AppTextBold>
                            </View>
                        </View>
                    }
                    ListEmptyComponent={
                        <View>
                            <AppText>Dữ liệu trống</AppText>
                        </View>
                    }
                    data={data}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    stickyHeaderIndices={[0]}
                />
            </View>
        </BottomSheet>
    );
});

export default ModalErrorDC;

const styles = StyleSheet.create({
    modalContainer: {
        height: HEIGHT * 0.9,
        bottom: -HEIGHT * 0.1,
    },
    modal: {
        flex: 1,
        backgroundColor: "white",
        borderRadius: 12 * unit,
        paddingBottom: HEIGHT * 0.1,
    },
    titleModal: {
        fontSize: 20 * unit,
        fontFamily: GoogleSansFontType.bold,
        color: PairColor.red.dark,
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
    titleBlock: {
        paddingVertical: 20 * unit,
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    xIcon: {
        paddingHorizontal: 20 * unit,
        paddingVertical: 8 * unit,
    },
    listContainer: {
        padding: 20 * unit,
        paddingTop: 0,
    },
    headerList: {
        flex: 1,
        flexDirection: "row",
        paddingVertical: 8 * unit,
        backgroundColor: "white",
    },
    itemListContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8 * unit,
        borderTopWidth: 1,
        borderTopColor: Color.gray_3,
    },
    itemText: {
        fontSize: 13 * unit,
    },
    itemTextLink: {
        fontSize: 13 * unit,
        color: Color.blueDark,
    },
});
