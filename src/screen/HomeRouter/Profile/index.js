import { AppText } from "@common-ui/AppText";
import { useLogin } from "@services/auth";
import { Color } from "@theme/colors";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const Profile = () => {
    const { data, logout } = useLogin();

    const { username } = data || {};

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <AppText>{username}</AppText>

            <Pressable onPress={() => logout()} style={{ padding: 10, backgroundColor: Color.gray_5 }}>
                <Text>Đăng xuất</Text>
            </Pressable>
        </View>
    );
};

export default Profile;

const styles = StyleSheet.create({});
