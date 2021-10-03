import { AppText, AppTextBold, AppTextMedium } from "@common-ui/AppText";
import { ModalDatePicker } from "@common-ui/Wheel/DatePicker";
import WheelPicker from "@common-ui/Wheel/WheelPicker";
import { Color, PairColor } from "@theme/colors";
import { rem, unit } from "@theme/styleContants";
import React, { useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import ModalError from "./ModalError";

const ErrorsPage = () => {
    const modalErrorRef = useRef();

    return (
        <ScrollView style={styles.container}>
            <AppTextMedium style={{ margin: rem / 2, fontSize: 16 * unit, color: Color.gray_10 }}>
                Tổng quan lỗi trong ngày
            </AppTextMedium>

            <View style={{ flexDirection: "row" }}>
                <Pressable style={styles.blockFlex} onPress={() => modalErrorRef.current.open({})}>
                    <View style={styles.blockContainer}>
                        <View style={[styles.lineDiv, { backgroundColor: PairColor.red.dark }]} />
                        <AppTextMedium style={[styles.title, { color: PairColor.red.dark }]}>Lỗi Dc (0)</AppTextMedium>
                    </View>
                </Pressable>

                <View style={styles.blockFlex}>
                    <View style={styles.blockContainer}>
                        <View style={[styles.lineDiv, { backgroundColor: PairColor.blue.dark }]} />
                        <AppTextMedium style={[styles.title, { color: PairColor.blue.dark }]}>
                            Hiệu suất thấp (14)
                        </AppTextMedium>
                    </View>
                </View>
            </View>

            <View style={{ flexDirection: "row" }}>
                <View style={styles.blockFlex}>
                    <View style={styles.blockContainer}>
                        <View style={[styles.lineDiv, { backgroundColor: PairColor.green.dark }]} />
                        <AppTextMedium style={[styles.title, { color: PairColor.green.dark }]}>
                            Điện áp lưới thấp (0)
                        </AppTextMedium>
                    </View>
                </View>
                <View style={styles.blockFlex}>
                    <View style={styles.blockContainer}>
                        <View style={[styles.lineDiv, { backgroundColor: PairColor.purple.dark }]} />
                        <AppTextMedium style={[styles.title, { color: PairColor.purple.dark }]}>
                            Điện áp lưới cao (0)
                        </AppTextMedium>
                    </View>
                </View>
            </View>

            <View style={{ flexDirection: "row" }}>
                <View style={styles.blockFlex}>
                    <View style={styles.blockContainer}>
                        <View style={[styles.lineDiv, { backgroundColor: PairColor.orange.dark }]} />
                        <AppTextMedium style={[styles.title, { color: PairColor.orange.dark }]}>
                            Mất điện lưới (0)
                        </AppTextMedium>
                    </View>
                </View>

                <View style={styles.blockFlex}>
                    <View style={styles.blockContainer}>
                        <View style={[styles.lineDiv, { backgroundColor: PairColor.indigo.dark }]} />
                        <AppTextMedium style={[styles.title, { color: PairColor.indigo.dark }]}>
                            Mât cân bằng pha (0)
                        </AppTextMedium>
                    </View>
                </View>
            </View>

            <View style={{ flexDirection: "row" }}>
                <View style={styles.blockFlex}>
                    <View style={styles.blockContainer}>
                        <View style={[styles.lineDiv, { backgroundColor: PairColor.gray.dark }]} />
                        <AppTextMedium style={[styles.title, { color: PairColor.gray.dark }]}>
                            Mất tín hiệu (Real Time) - 0
                        </AppTextMedium>
                    </View>
                </View>
            </View>

            <ModalError ref={modalErrorRef} />
        </ScrollView>
    );
};

export default React.memo(ErrorsPage);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: rem / 2,
        paddingVertical: rem,
        backgroundColor: "white",
    },
    blockFlex: {
        flex: 1 / 2,
    },
    blockContainer: {
        height: 8 * rem,
        backgroundColor: Color.gray_2,
        paddingVertical: rem,
        paddingHorizontal: 1.5 * rem,
        borderRadius: 8,
        margin: rem / 2,
    },
    lineDiv: {
        height: 4,
        width: "25%",
        backgroundColor: Color.gray_10,
        borderRadius: 2,
    },
    title: {
        flex: 1,
        paddingVertical: 16 * unit,
        fontSize: 16 * unit,
        color: Color.gray_10,
    },
});
