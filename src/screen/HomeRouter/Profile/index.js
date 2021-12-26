import { AppText } from "@common-ui/AppText";
import { useLogin } from "@services/auth";
import { configService } from "@services/config";
import { Color } from "@theme/colors";
import { unit } from "@theme/styleContants";
import React, { useEffect, useRef, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const Profile = () => {
    const { data, logout } = useLogin();
    const [reload, setReload] = useState(false);

    const renderContent = () => {
        useEffect(() => {}, []);

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
                <AppText style={{ paddingVertical: 12 * unit }}>Version {configService._versionText}</AppText>
            </View>
        );
    };

    const sRef = useRef();

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
