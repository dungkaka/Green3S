import { AppText } from "@common-ui/AppText";
import { useLogin } from "@services/auth";
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
                <AppText style={{ paddingVertical: 12 * unit }}>Version 1.0.5-beta.2</AppText>
            </View>
        );
    };

    const sRef = useRef();

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <View style={{ height: 250, backgroundColor: Color.gray_3 }} />
            {renderContent()}

            <View style={{ flex: 1 }}>
                <ScrollView horizontal ref={sRef} nestedScrollEnabled>
                    <View style={{ width: 500, backgroundColor: "red" }}></View>
                    <ScrollView horizontal style={{ width: 300 }} nestedScrollEnabled>
                        <View style={{ width: 100, backgroundColor: "blue" }}></View>
                        <View style={{ width: 100, backgroundColor: "pink" }}></View>
                        <View style={{ width: 100, backgroundColor: "blue" }}></View>
                        <View style={{ width: 100, backgroundColor: "pink" }}></View>
                        <View style={{ width: 100, backgroundColor: "blue" }}></View>
                        <View style={{ width: 100, backgroundColor: "pink" }}></View>
                        <View style={{ width: 100, backgroundColor: "blue" }}></View>
                        <View style={{ width: 100, backgroundColor: "pink" }}></View>
                    </ScrollView>
                </ScrollView>
            </View>
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
