import { AppText, AppTextBold, AppTextMedium } from "@common-ui/AppText";
import { LoadingIcon } from "@common-ui/Loading/DefaultIconLoading";
import { Color } from "@theme/colors";
import { rem, unit } from "@theme/styleContants";
import { GoogleSansFontType } from "@theme/typography";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { useHintRS } from "@services/error";
import ModalPortal from "@common-ui/Modal/ModalPortal";

const HintRS = () => {
    const { reason, solution } = useHintRS();
    return (
        <ScrollView contentContainerStyle={styles.content}>
            <AppTextMedium>Nguyên nhân</AppTextMedium>
            <View style={styles.cellRS}>
                <AppText>{reason}</AppText>
            </View>
            <AppTextMedium>Giải pháp</AppTextMedium>
            <View style={styles.cellRS}>
                <AppText>{solution}</AppText>
            </View>
        </ScrollView>
    );
};

const ModalHintRS = ({ modalRef = useRef() }) => {
    return (
        <ModalPortal ref={modalRef} modalStyle={styles.modalStyle}>
            <View style={styles.modalContainer}>
                {/* Title */}
                <View style={styles.headerModal}>
                    <AppTextBold style={styles.titleModal}>Tổng hợp nguyên nhân, giải pháp</AppTextBold>
                </View>

                {/* Content */}
                <HintRS />

                {/* Footer */}
                <View style={styles.footerModal}>
                    {/* Cancel */}
                    <TouchableOpacity style={styles.buttonFooterModal} onPress={() => modalRef.current.close()}>
                        <AppText style={styles.textButtonFooterModal}> Đóng </AppText>
                    </TouchableOpacity>
                    {/* OK */}

                    <TouchableOpacity
                        style={styles.buttonFooterModal}
                        onPress={() => {
                            modalRef.current.close();
                        }}
                    >
                        <Text style={styles.textButtonFooterModal}> OK </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ModalPortal>
    );
};

export default React.memo(ModalHintRS, () => true);

const styles = StyleSheet.create({
    modalStyle: {
        width: 24 * rem,
        minWidth: "60%",
        minHeight: 30 * rem,
        maxHeight: "75%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "white",
        borderRadius: 8 * unit,
    },
    headerModal: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 24 * unit,
        paddingTop: 2 * rem,
        paddingBottom: rem,
    },
    titleModal: {
        fontSize: 16 * unit,
        fontFamily: GoogleSansFontType.bold,
        color: Color.gray_10,
    },
    content: {
        paddingVertical: rem,
        paddingHorizontal: 24 * unit,
    },
    cellRS: {
        borderRadius: 6,
        marginTop: 12 * unit,
        marginBottom: 24 * unit,
    },
    footerModal: {
        flexDirection: "row",
        marginHorizontal: 6 * unit,
        borderTopWidth: 1,
        borderTopColor: Color.gray_2,
    },
    buttonFooterModal: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 14 * unit,
    },
    textButtonFooterModal: {
        fontSize: 16 * unit,
        paddingHorizontal: 4 * unit,
        color: Color.gray_10,
        fontFamily: GoogleSansFontType.bold,
    },
});
