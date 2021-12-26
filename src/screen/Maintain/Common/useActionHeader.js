import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";
import { AppText } from "@common-ui/AppText";
import { unit } from "@theme/styleContants";
import { NAVIGATION } from "constant/navigation";
import { WIDTH } from "@theme/scale";
import { CRUD } from "constant/crud";
import { useUser } from "@services/user";

export const useActionHeader = ({ key, arrayMarks, deleteErrors }) => {
    const navigation = useNavigation();

    useEffect(() => {
        if (arrayMarks.length > 0) {
            navigation.setOptions({
                headerTitleContainerStyle: {
                    maxWidth: WIDTH - 240,
                },
                headerRight: () => {
                    return (
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                marginRight: 16 * unit,
                            }}
                        >
                            <AppText style={{ color: "white", paddingRight: 12 * unit }}>( Chọn {arrayMarks.length} )</AppText>
                            <Pressable onPress={() => deleteErrors(arrayMarks)}>
                                <Feather name="trash-2" size={20} color="white" />
                            </Pressable>
                            <Pressable
                                style={{ paddingLeft: 12 * unit }}
                                onPress={() => {
                                    navigation.push(NAVIGATION.RS_UPDATE_MULTIPLE, {
                                        errorIds: arrayMarks,
                                        key: key,
                                    });
                                }}
                            >
                                <Feather name="edit-3" size={20} color="white" />
                            </Pressable>
                        </View>
                    );
                },
            });
        } else {
            navigation.setOptions({
                headerTitleContainerStyle: {},
                headerRight: () => null,
            });
        }
    }, [arrayMarks]);
};

export const useActionErrorPotentialHeader = ({ key, arrayMarks, deleteErrors }) => {
    const navigation = useNavigation();
    const { isEmployee } = useUser();

    useEffect(() => {
        if (arrayMarks.length > 0) {
            navigation.setOptions({
                headerTitleContainerStyle: {
                    maxWidth: WIDTH - 240,
                },
                headerRight: () => {
                    return (
                        <View style={styles.rightContainer}>
                            <AppText style={{ color: "white", paddingRight: 12 * unit }}>( Chọn {arrayMarks.length} )</AppText>
                            <Pressable onPress={() => deleteErrors(arrayMarks)}>
                                <Feather name="trash-2" size={20} color="white" />
                            </Pressable>
                        </View>
                    );
                },
            });
        } else {
            navigation.setOptions({
                headerTitleContainerStyle: {},
                headerRight: () => {
                    if (isEmployee)
                        return (
                            <View style={styles.rightContainer}>
                                <Pressable
                                    style={{ flexDirection: "row", alignItems: "center" }}
                                    onPress={() =>
                                        navigation.push(NAVIGATION.ERROR_POTENTIEL_CREATION, {
                                            type: CRUD.CREATE,
                                            key: key,
                                        })
                                    }
                                >
                                    <AppText style={{ color: "white", fontSize: 13 * unit, paddingRight: 6 * unit }}>
                                        Thêm lỗi
                                    </AppText>
                                    <Entypo name="plus" size={24} color="white" />
                                </Pressable>
                            </View>
                        );
                    else return null;
                },
            });
        }
    }, [arrayMarks]);
};

const styles = StyleSheet.create({
    rightContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14 * unit,
    },
});
