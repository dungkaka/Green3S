import { AppTextMedium } from "@common-ui/AppText";
import { useFetchPreViewAllError } from "@services/error";
import { Color, PairColor } from "@theme/colors";
import { rem, unit } from "@theme/styleContants";
import React, { Fragment, useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import ModalErrorDisconnect from "./ModalErrorDisconnect";
import ModalErrorDC from "./ModalErrorDC";
import ModalPerformance from "./ModalPerformance";
import ModalErrorResistor from "./ModalResistor";
import ModalPhaseUnbalance from "./ModalPhaseUnbalance";
import ModalGridHigh from "./ModalGridHigh";
import ModalGridLow from "./ModalGridLow";
import ModalMiss from "./ModalMiss";
import { JumpLogoPage } from "@common-ui/Loading/JumpLogo";
import ErrorPage from "@common-components/ErrorPage";
import ModalInactiveInverter from "./ModalInactiveInverter";
import ImageLogViewer from "./ImageLogViewer";

const ErrorsPage = () => {
    const imageRef = useRef();
    const modalErrorDisconnectRef = useRef();
    const modalErrorDCRef = useRef();
    // const modalErrorResistorRef = useRef();
    const modelInactiveInverterRef = useRef();
    const modalErrorPerformanceRef = useRef();
    const modalPhaseUnbalanceRef = useRef();
    const modalGrigHighRef = useRef();
    const modalGridLowRef = useRef();
    const modalMissRef = useRef();

    const { rData, rIsValidating, error, mutate } = useFetchPreViewAllError();
    const datas = rData?.datas || [];

    return (
        <ScrollView style={styles.container}>
            <AppTextMedium style={{ margin: rem / 2, fontSize: 16 * unit, color: Color.gray_10 }}>
                Tổng quan lỗi trong ngày
            </AppTextMedium>

            {rIsValidating ? (
                <View style={{ height: 360 }}>
                    <JumpLogoPage />
                </View>
            ) : error ? (
                <View style={{ height: 360 }}>
                    <ErrorPage />
                </View>
            ) : (
                <Fragment>
                    <View style={{ flexDirection: "row" }}>
                        <Pressable onPress={() => modalErrorDCRef.current.open()} style={styles.blockFlex}>
                            <View style={styles.blockContainer}>
                                <View style={[styles.lineDiv, { backgroundColor: PairColor.red.dark }]} />
                                <AppTextMedium style={[styles.title, { color: PairColor.red.dark }]}>
                                    Lỗi Dc ({datas.count_dc || 0})
                                </AppTextMedium>
                            </View>
                        </Pressable>

                        <Pressable onPress={() => modalErrorPerformanceRef.current.open()} style={styles.blockFlex}>
                            <View style={styles.blockContainer}>
                                <View style={[styles.lineDiv, { backgroundColor: PairColor.blue.dark }]} />
                                <AppTextMedium style={[styles.title, { color: PairColor.blue.dark }]}>
                                    Hiệu suất thấp ({datas.count_performance || 0})
                                </AppTextMedium>
                            </View>
                        </Pressable>
                    </View>

                    <View style={{ flexDirection: "row" }}>
                        <Pressable onPress={() => modalGridLowRef.current.open()} style={styles.blockFlex}>
                            <View style={styles.blockContainer}>
                                <View style={[styles.lineDiv, { backgroundColor: PairColor.green.dark }]} />
                                <AppTextMedium style={[styles.title, { color: PairColor.green.dark }]}>
                                    Điện áp lưới thấp ({datas.ac?.["grid low"]?.length || 0})
                                </AppTextMedium>
                            </View>
                        </Pressable>
                        <Pressable onPress={() => modalGrigHighRef.current.open()} style={styles.blockFlex}>
                            <View style={styles.blockContainer}>
                                <View style={[styles.lineDiv, { backgroundColor: PairColor.purple.dark }]} />
                                <AppTextMedium style={[styles.title, { color: PairColor.purple.dark }]}>
                                    Điện áp lưới cao ({datas.ac?.["grid high"]?.length || 0})
                                </AppTextMedium>
                            </View>
                        </Pressable>
                    </View>

                    <View style={{ flexDirection: "row" }}>
                        <Pressable onPress={() => modalMissRef.current.open()} style={styles.blockFlex}>
                            <View style={styles.blockContainer}>
                                <View style={[styles.lineDiv, { backgroundColor: PairColor.orange.dark }]} />
                                <AppTextMedium style={[styles.title, { color: PairColor.orange.dark }]}>
                                    Mất điện lưới ({datas.ac?.miss?.length || 0})
                                </AppTextMedium>
                            </View>
                        </Pressable>

                        <Pressable onPress={() => modalPhaseUnbalanceRef.current.open()} style={styles.blockFlex}>
                            <View style={styles.blockContainer}>
                                <View style={[styles.lineDiv, { backgroundColor: PairColor.indigo.dark }]} />
                                <AppTextMedium style={[styles.title, { color: PairColor.indigo.dark }]}>
                                    Mât cân bằng pha ({datas.ac?.phase_unbalance?.length || 0})
                                </AppTextMedium>
                            </View>
                        </Pressable>
                    </View>

                    <View style={{ flexDirection: "row" }}>
                        <Pressable onPress={() => modalErrorDisconnectRef.current.open()} style={styles.blockFlex}>
                            <View style={styles.blockContainer}>
                                <View style={[styles.lineDiv, { backgroundColor: PairColor.gray.dark }]} />
                                <AppTextMedium style={[styles.title, { color: PairColor.gray.dark }]}>
                                    Mất tín hiệu (Real Time) ({datas.disconnect?.length || 0})
                                </AppTextMedium>
                            </View>
                        </Pressable>
                        <Pressable onPress={() => modelInactiveInverterRef.current.open()} style={styles.blockFlex}>
                            <View style={styles.blockContainer}>
                                <View style={[styles.lineDiv, { backgroundColor: PairColor.red.dark }]} />
                                <AppTextMedium style={[styles.title, { color: PairColor.red.dark }]}>
                                    Inverter không hoạt động ({datas.ac?.device_in_active?.length || 0})
                                </AppTextMedium>
                            </View>
                        </Pressable>
                        {/* <Pressable onPress={() => modalErrorResistorRef.current.open()} style={styles.blockFlex}>
                            <View style={styles.blockContainer}>
                                <View style={[styles.lineDiv, { backgroundColor: PairColor.red.dark }]} />
                                <AppTextMedium style={[styles.title, { color: PairColor.red.dark }]}>
                                    Điện trở cách điện thấp ({datas.count_resistor || 0})
                                </AppTextMedium>
                            </View>
                        </Pressable> */}
                    </View>
                </Fragment>
            )}

            <ModalErrorDisconnect ref={modalErrorDisconnectRef} imageRef={imageRef} data={datas.disconnect} />
            <ModalErrorDC ref={modalErrorDCRef} imageRef={imageRef} data={datas.error_dc} />
            <ModalInactiveInverter ref={modelInactiveInverterRef} imageRef={imageRef} data={datas.ac?.device_in_active} />
            <ModalPerformance ref={modalErrorPerformanceRef} imageRef={imageRef} data={datas.error_performance} />
            {/* <ModalErrorResistor ref={modalErrorResistorRef} data={datas.resistor} /> */}
            <ModalPhaseUnbalance ref={modalPhaseUnbalanceRef} imageRef={imageRef} data={datas.ac?.phase_unbalance} />
            <ModalGridHigh ref={modalGrigHighRef} imageRef={imageRef} data={datas.ac?.["grid high"]} />
            <ModalGridLow ref={modalGridLowRef} imageRef={imageRef} data={datas.ac?.["grid low"]} />
            <ModalMiss ref={modalMissRef} imageRef={imageRef} data={datas.ac?.miss} />
            <ImageLogViewer ref={imageRef} />
        </ScrollView>
    );
};

export default React.memo(ErrorsPage, () => true);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexGrow: 1,
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
