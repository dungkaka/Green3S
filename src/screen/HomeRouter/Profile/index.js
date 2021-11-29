import { AppText } from "@common-ui/AppText";
import { useLogin } from "@services/auth";
import { Color } from "@theme/colors";
import { unit } from "@theme/styleContants";
import React, { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

const Profile = () => {
    const { data, logout } = useLogin();
    const [reload, setReload] = useState(false);

    const renderContent = () => {
        useEffect(() => {
            console.log("RUN");
        }, []);

        return (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
                <View style={{ height: 100, width: 100, borderRadius: 50, backgroundColor: Color.gray_5, marginTop: -40 }} />
                <AppText style={{ paddingVertical: 12 * unit }}>{data?.user?.email}</AppText>
                <Pressable
                    onPress={() => logout()}
                    style={{ padding: 16, backgroundColor: Color.gray_3, borderRadius: 6 * unit }}
                >
                    <Text>Đăng xuất</Text>
                </Pressable>
                <AppText style={{ paddingVertical: 12 * unit }}>Version 1.0.4-beta.2</AppText>
            </View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <View style={{ height: 250, backgroundColor: Color.gray_3 }} />
            {renderContent()}
            {/* 
            <Pressable
                onPress={() => setReload(!reload)}
                style={{ padding: 16, backgroundColor: Color.gray_3, borderRadius: 6 * unit }}
            >
                <Text>Đăng xuất</Text>
            </Pressable> */}
        </View>
    );
};

export default Profile;

const styles = StyleSheet.create({});
