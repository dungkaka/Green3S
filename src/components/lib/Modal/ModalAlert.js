import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import { Color } from "../../themes/colors";
import { FontSize } from "../../themes/fontSize";
import { Space } from "../../themes/spacing";
import { GoogleSansFontType } from "../../themes/typography";
import { numberScale } from "../../utils";
import AppText from "./AppText";
import ModalCustom from "./ModalCustom";
const { width, height } = Dimensions.get("window");

const LoadingIcon = ({ isIconAnimating, color }) => (
    <ActivityIndicator size={FontSize._20} color={color} animating={isIconAnimating} />
);

const ModalAlert = ({
    modalAlertRef = useRef(),
    title = "Alert",
    content = "Alert Content",
    textOK = "OK",
    textCancel = "Cancel",
    onOk,
    onCancel,
    onBackButtonPress,
    onBackdropPress,
}) => {
    const appColor = useSelector((state) => state.theme.appColor);
    const styles = reStyles[appColor];
    const mount = useRef(true);
    const modalCustomRef = useRef();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            modalAlertRef.current = modalCustomRef.current;
        }, 50);
        return () => {
            mount.current = false;
        };
    }, []);

    const otherProps = () => {
        const otherProps = {};
        if (onBackButtonPress) otherProps.onBackButtonPress = onBackButtonPress;
        if (onBackdropPress) otherProps.onBackdropPress = onBackdropPress;

        return otherProps;
    };

    return (
        <ModalCustom
            keyMemo={[loading, appColor, Math.random()]}
            height={height}
            width={width}
            ref={modalCustomRef}
            {...otherProps()}
        >
            <View style={styles.container}>
                <View style={styles.modalContainer}>
                    <View style={styles.modal}>
                        {/* Title */}
                        <View>
                            <Text style={styles.titleModal}>{title}</Text>
                        </View>

                        {/* Content */}
                        <View style={{ minHeight: numberScale(72) }}>
                            <AppText style={styles.content}>{content}</AppText>
                        </View>
                        {/* Footer */}
                        <View style={styles.footerModal}>
                            {/* Cancel */}
                            <TouchableOpacity
                                style={styles.buttonFooterModal}
                                onPress={() => (onCancel ? onCancel() : modalCustomRef.current.close())}
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
                                                  if (mount.current) {
                                                      setLoading(false);
                                                      modalCustomRef.current.close();
                                                  }
                                              },
                                              () => {
                                                  if (mount.current) {
                                                      setLoading(false);
                                                      modalCustomRef.current.close();
                                                  }
                                              }
                                          )
                                        : modalCustomRef.current.close();
                                }}
                            >
                                <Text style={styles.textButtonFooterModal}> {textOK} </Text>
                                <LoadingIcon isIconAnimating={loading} color={Color.gray_10} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </ModalCustom>
    );
};

export default React.memo(ModalAlert, () => true);

const customStyle = ({
    background = "white",
    title = Color.gray_9,
    content = Color.gray_10,
    borderTopFooter = Color.gray_2,
    buttonFooter = Color.gray_10,
}) =>
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
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
            backgroundColor: background,
            padding: Space._16,
            borderRadius: numberScale(8),
        },
        titleModal: {
            fontSize: FontSize._20,
            padding: Space._6,
            fontFamily: GoogleSansFontType.bold,
            color: title,
        },
        content: {
            color: content,
            paddingHorizontal: Space._6,
            paddingTop: Space._4,
            paddingBottom: Space._26,
        },
        footerModal: {
            flexDirection: "row",
            marginHorizontal: Space._6,
            paddingTop: Space._12,
            borderTopWidth: 1,
            borderTopColor: borderTopFooter,
        },
        buttonFooterModal: {
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
        },
        textButtonFooterModal: {
            fontSize: FontSize._16,
            paddingHorizontal: Space._4,
            color: buttonFooter,
            fontFamily: GoogleSansFontType.bold,
        },
    });

const reStyles = {
    default: customStyle({}),
    dark: customStyle({
        background: Color.gray_12,
        title: Color.gray_4,
        content: Color.gray_3,
        borderTopFooter: Color.gray_10,
        buttonFooter: Color.gray_3,
    }),
};
