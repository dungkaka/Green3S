import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { versionUpdateContent } from "../../configs/version";
import { Color } from "../../themes/colors";
import { FontSize } from "../../themes/fontSize";
import { Space } from "../../themes/spacing";
import { GoogleSansFontType } from "../../themes/typography";
import { numberScale } from "../../utils";
import AppText from "./AppText";
import ModalCustom from "./ModalCustom";
const { width, height } = Dimensions.get("window");

const ModalVersion = ({ modalVersionRef }) => {
  const mount = useRef(true);

  useEffect(() => {
    return () => {
      mount.current = false;
    };
  }, []);

  return (
    <ModalCustom keyMemo={[]} height={height} width={width} ref={modalVersionRef} onBackdropPress={() => {}}>
      <View style={styles.container}>
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            {/* Title */}
            <View>
              <Text style={styles.titleModal}>{versionUpdateContent.title}</Text>
            </View>

            {/* Content */}
            <View style={{ minHeight: numberScale(72) }}>
              <AppText style={styles.content}>{versionUpdateContent.content}</AppText>
            </View>
            {/* Footer */}
            <View style={styles.footerModal}>
              {/* Cancel */}
              <TouchableOpacity style={styles.buttonFooterModal} onPress={() => modalVersionRef.current.close()}>
                <AppText style={styles.textButtonFooterModal}> Cancel </AppText>
              </TouchableOpacity>
              {/* OK */}

              <TouchableOpacity
                style={styles.buttonFooterModal}
                onPress={() => {
                  modalVersionRef.current.close();
                }}
              >
                <Text style={styles.textButtonFooterModal}> OK </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ModalCustom>
  );
};

export default ModalVersion;

const styles = StyleSheet.create({
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
    backgroundColor: "white",
    padding: Space._16,
    borderRadius: numberScale(8),
  },
  titleModal: {
    fontSize: FontSize._20,
    padding: Space._6,
    fontFamily: GoogleSansFontType.bold,
    color: Color.gray_9,
  },
  content: {
    color: Color.gray_10,
    paddingHorizontal: Space._6,
    paddingTop: Space._4,
    paddingBottom: Space._26,
    lineHeight: FontSize._20,
  },
  footerModal: {
    flexDirection: "row",
    marginHorizontal: Space._6,
    paddingTop: Space._12,
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
    fontSize: FontSize._16,
    paddingHorizontal: Space._4,
    color: Color.gray_10,
    fontFamily: GoogleSansFontType.bold,
  },
});
