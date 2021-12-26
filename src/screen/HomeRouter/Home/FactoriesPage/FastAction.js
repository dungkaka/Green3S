import { AppText, AppTextMedium } from "@common-ui/AppText";
import { useNavigation } from "@react-navigation/native";
import { NAVIGATION } from "constant/navigation";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Color } from "@theme/colors";
import { CRUD } from "constant/crud";
import { rem, unit } from "@theme/styleContants";
import Unknown from "@components/icon/Unknown";

const FastAction = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <AppTextMedium>Lối tắt</AppTextMedium>
            <View style={{ flexDirection: "row", paddingVertical: 4 * unit }}>
                <Pressable
                    onPress={() =>
                        navigation.navigate(NAVIGATION.ERROR_POTENTIEL_CREATION, {
                            type: CRUD.CREATE,
                        })
                    }
                    style={styles.itemReport}
                >
                    <View style={styles.iconReport}>
                        <Unknown size={24 * unit} />
                    </View>
                    <AppText numberOfLines={2} style={styles.textItemReport}>
                        Thêm lỗi tiềm ẩn
                    </AppText>
                </Pressable>
            </View>
        </View>
    );
};

export default FastAction;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 14 * unit,
        paddingVertical: 8 * unit,
    },
    itemReport: {
        width: 56 * unit,
        paddingTop: 8 * unit,
        marginRight: 12 * unit,
    },
    iconReport: {
        height: 56 * unit,
        width: 56 * unit,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Color.gray_2,
        borderRadius: 16 * unit,
    },
    textItemReport: {
        textAlign: "center",
        paddingVertical: 4 * unit,
        fontSize: 12 * unit,
        color: Color.gray_10,
    },
});
