import { AppText } from "@common-ui/AppText";
import { Color } from "@theme/colors";
import { unit } from "@theme/styleContants";
import { GoogleSansFontType } from "@theme/typography";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import ModalPortal from "./ModalPortal";
import MyModal from "./MyModal";

const LoadingIcon = ({ isIconAnimating, color }) => (
    <ActivityIndicator size={20 * unit} color={color} animating={isIconAnimating} />
);

const ModalAlert = ({
    modalAlertRef = useRef(),
    title = "Alert",
    content = "Alert Content",
    textOK = "OK",
    textCancel = "Cancel",
    onOk,
    onCancel,
    onBackHandler,
    onBackdropPress,
}) => {
    const mount = useRef(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        return () => {
            mount.current = false;
        };
    }, []);

    const otherProps = () => {
        const otherProps = {};
        if (onBackHandler) otherProps.onBackHandler = onBackHandler;
        if (onBackdropPress) otherProps.onBackdropPress = onBackdropPress;

        return otherProps;
    };

    return (
        <ModalPortal ref={modalAlertRef} modalStyle={styles.modalContainer} {...otherProps()}>
            <View style={styles.modal}>
                {/* Title */}
                <View>
                    <Text style={styles.titleModal}>{title}</Text>
                </View>

                {/* Content */}
                <View style={{ minHeight: 72 * unit }}>
                    <AppText style={styles.content}>{content}</AppText>
                </View>
                {/* Footer */}
                <View style={styles.footerModal}>
                    {/* Cancel */}
                    <TouchableOpacity
                        style={styles.buttonFooterModal}
                        onPress={() =>
                            onCancel
                                ? onCancel(() => {
                                      if (mount.current) setLoading(false);
                                  })
                                : modalAlertRef.current.close()
                        }
                    >
                        <AppText style={styles.textButtonFooterModal}> {textCancel} </AppText>
                    </TouchableOpacity>
                    {/* OK */}

                    <TouchableOpacity
                        style={styles.buttonFooterModal}
                        onPress={() => {
                            onOk
                                ? onOk(
                                      () => {
                                          if (mount.current) setLoading(true);
                                      },
                                      () => {
                                          if (mount.current) setLoading(false);
                                      },
                                      () => {
                                          if (mount.current) modalAlertRef.current.close();
                                      }
                                  )
                                : modalAlertRef.current.close();
                        }}
                    >
                        <Text style={styles.textButtonFooterModal}> {textOK} </Text>
                        <LoadingIcon isIconAnimating={loading} color={Color.gray_10} />
                    </TouchableOpacity>
                </View>
            </View>
        </ModalPortal>
    );
};

export default React.memo(ModalAlert, () => true);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        height: "40%",
        width: "78%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    modal: {
        flex: 1,
        backgroundColor: "white",
        padding: 16 * unit,
        borderRadius: 8 * unit,
    },
    titleModal: {
        fontSize: 20 * unit,
        padding: 6 * unit,
        fontFamily: GoogleSansFontType.bold,
        color: Color.gray_9,
    },
    content: {
        color: Color.gray_10,
        paddingHorizontal: 6 * unit,
        paddingTop: 4 * unit,
        paddingBottom: 26 * unit,
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
