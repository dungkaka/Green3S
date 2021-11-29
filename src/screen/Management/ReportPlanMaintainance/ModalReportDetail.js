import React, {
    forwardRef,
    Fragment,
    useCallback,
    useEffect,
    useImperativeHandle,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { BackHandler, Pressable, StyleSheet, View } from "react-native";
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import Portal from "@burstware/react-native-portal";
import TableStickBasicTemplate from "@common-ui/Table/TableStickBasicTemplate";
import { rem, unit } from "@theme/styleContants";
import { AppText, AppTextMedium } from "@common-ui/AppText";
import { Color } from "@theme/colors";
import { WIDTH } from "@theme/scale";
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const options = [
    {
        key: "order",
        title: "STT",
        width: 3 * rem,
        render: ({ item, index, cellStyle }) => (
            <View key={0} style={cellStyle}>
                <AppText style={styles.contentCell}>{index + 1}</AppText>
            </View>
        ),
    },
    {
        key: "name_work",
        title: "Công việc",
        width: 8 * rem,
        render: ({ item, index, cellStyle }) => (
            <View key={1} style={cellStyle}>
                <AppText style={styles.contentCell}>{item.maintance_work?.name_work}</AppText>
            </View>
        ),
    },

    {
        key: "stationName",
        title: "Nhà máy",
        width: 8 * rem,
        render: ({ item, index, cellStyle }) => (
            <View key={2} style={cellStyle}>
                <AppText style={styles.contentCell}>{item.maintance_work?.factory.stationName}</AppText>
            </View>
        ),
    },

    {
        key: "amount",
        title: "Tần suất trên năm",
        width: 6 * rem,
    },
    {
        key: "amount_done",
        title: "Đã thực hiện",
        width: 6 * rem,
    },

    {
        key: "amount_rest",
        title: "Còn lại",
        width: 6 * rem,
        render: ({ item, index, cellStyle }) => (
            <View key={5} style={cellStyle}>
                <AppText style={styles.contentCell}>{item.amount - item.amount_done}</AppText>
            </View>
        ),
    },
    {
        key: "date",
        title: "Theo kế hoạch",
        width: 7 * rem,
    },
    {
        key: "date_recent",
        title: "Gần nhất",
        width: 8 * rem,
    },
    {
        key: "date_future",
        title: "Tiếp theo",
        width: 8 * rem,
    },
    {
        key: "note",
        title: "Ghi chú",
        width: 16 * rem,
    },
];

const ModalReportDetail = forwardRef(
    (
        {
            modalStyle = styles.modal,
            animationTimeIn = 250,
            animationTimeout = 150,
            onPressBackdrop,
            data = [],
            title = "Chi tiết",
            lazyLoad = true,
            unmountOnHide = false,
        },
        ref
    ) => {
        const [isReady, setIsReady] = useState(!lazyLoad && !unmountOnHide);
        const animateModal = useSharedValue(0);
        const displayModal = useSharedValue(0);
        const willOpenModal = useRef(false);

        useEffect(() => {
            return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
        }, []);

        useLayoutEffect(() => {
            if (isReady && willOpenModal.current) requestAnimationFrame(() => animatedOpenModal());
            willOpenModal.current = false;
        }, [isReady]);

        useImperativeHandle(ref, () => ({
            open: () => {
                if (!isReady) {
                    willOpenModal.current = true;
                    setIsReady(true);
                    return;
                }
                requestAnimationFrame(() => animatedOpenModal());
            },
            close: () => {
                requestAnimationFrame(() => animatedCloseModal());
            },
        }));

        const onBackPress = useCallback(() => {
            animatedCloseModal();
            return true;
        }, []);

        const animatedOpenModal = () => {
            displayModal.value = "auto";
            animateModal.value = withTiming(1, { easing: Easing.bezier(0.39, 0.35, 0.14, 1.26), duration: animationTimeIn });
            BackHandler.addEventListener("hardwareBackPress", onBackPress);
        };

        const animatedCloseModal = () => {
            // When close right after open, maybe overlay still show, need that to sure close completely run !
            animateModal.value = withDelay(
                2,
                withTiming(0, { duration: animationTimeout }, () => {
                    displayModal.value = 0;
                    unmountOnHide && runOnJS(setIsReady)(false);
                })
            );
            BackHandler.removeEventListener("hardwareBackPress", onBackPress);
        };

        const modalAnimated = useAnimatedStyle(() => {
            return {
                transform: [
                    {
                        scale: 0.8 + animateModal.value / 5,
                    },
                ],
            };
        });

        const containerStyle = useAnimatedStyle(() => ({
            opacity: animateModal.value * 1.2,
            width: displayModal.value,
            height: displayModal.value,
        }));

        return (
            <Portal>
                <Animated.View style={[styles.modalContainer, containerStyle]}>
                    <AnimatedPressable
                        style={styles.backdrop}
                        onPress={() => {
                            onPressBackdrop ? onPressBackdrop() : animatedCloseModal();
                        }}
                    />
                    <Animated.View style={[modalStyle, modalAnimated]}>
                        {isReady && (
                            <View style={{ flex: 1 }}>
                                <AppTextMedium
                                    style={{
                                        paddingVertical: 24 * unit,
                                        paddingHorizontal: 18 * unit,
                                        fontSize: 17 * unit,
                                        color: Color.gray_11,
                                    }}
                                >
                                    {title}
                                </AppTextMedium>
                                <TableStickBasicTemplate
                                    heightRow={120}
                                    left={[0, 1]}
                                    stickPosition={3 * rem}
                                    options={options}
                                    data={data}
                                    headerContainerStyle={styles.tableHeaderContainer}
                                    textHeaderStyle={styles.tableTextHeader}
                                    numberLinesContentCell={5}
                                />
                            </View>
                        )}
                    </Animated.View>
                </Animated.View>
            </Portal>
        );
    }
);

export default ModalReportDetail;

const styles = StyleSheet.create({
    modalContainer: {
        ...StyleSheet.absoluteFill,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        backgroundColor: "transparent",
    },
    backdrop: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modal: {
        width: "100%",
        height: 48 * rem,
        maxHeight: "80%",
        backgroundColor: "white",
    },
    contentCell: {
        fontSize: 13 * unit,
        textAlign: "center",
        color: Color.gray_11,
    },
    contentCellTag: {
        fontSize: 13 * unit,
        textAlign: "center",
        color: "white",
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    tableHeaderContainer: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: Color.gray_2,
    },
    tableTextHeader: {
        color: Color.gray_11,
    },
});
