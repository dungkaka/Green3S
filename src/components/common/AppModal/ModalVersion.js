import { AppText, AppTextBold } from "@common-ui/AppText";
import ModalPortal from "@common-ui/Modal/ModalPortal";
import { configService } from "@services/config";
import { Color } from "@theme/colors";
import { rem, unit } from "@theme/styleContants";
import { GoogleSansFontType } from "@theme/typography";
import { Int } from "@utils/helps/number";
import React, { useEffect, useRef } from "react";
import { Pressable, StyleSheet, Text, View, ScrollView } from "react-native";

const ModalVersion = () => {
    const modalRef = useRef();
    const mount = useRef(true);

    const { version } = configService.useConfig();
    const { updateConfig } = configService.useConfigControl();

    useEffect(() => {
        setTimeout(() => {
            if (version && configService._version != Int(version)) {
                configService.shouldShowNotification && modalRef.current.open();
                updateConfig({ version: configService._version });
            }
        }, 1000);
        return () => {
            mount.current = false;
        };
    }, []);

    return (
        <ModalPortal lazyLoad={false} unmountOnHide={true} ref={modalRef} modalStyle={styles.modalStyle}>
            <View style={styles.modalContainer}>
                {/* Title */}
                <View style={styles.headerModal}>
                    <AppTextBold style={styles.titleModal}>{configService.versionUpdateContent.title}</AppTextBold>
                </View>

                {/* Content */}
                <ScrollView contentContainerStyle={styles.content}>
                    <AppText>{configService.versionUpdateContent.content}</AppText>
                </ScrollView>
                {/* Footer */}
                <View style={styles.footerModal}>
                    {/* Cancel */}
                    <Pressable style={styles.buttonFooterModal} onPress={() => modalRef.current.close()}>
                        <AppText style={styles.textButtonFooterModal}> Đóng </AppText>
                    </Pressable>
                    {/* OK */}

                    <Pressable style={styles.buttonFooterModal} onPress={() => modalRef.current.close()}>
                        <Text style={styles.textButtonFooterModal}> OK </Text>
                    </Pressable>
                </View>
            </View>
        </ModalPortal>
    );
};

export default React.memo(ModalVersion, () => true);

const styles = StyleSheet.create({
    modalStyle: {
        width: 23 * rem,
        minWidth: "60%",
        minHeight: 23 * rem,
        maxHeight: "65%",
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
        fontSize: 18 * unit,
        fontFamily: GoogleSansFontType.bold,
        color: Color.gray_10,
    },
    content: {
        paddingVertical: rem,
        paddingHorizontal: 24 * unit,
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
