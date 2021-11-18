import { Linking, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { NAVIGATION } from "constant/navigation";
import { showToast } from "@common-ui/ToastNotify/ToastManager";

export const useListenResponseNotification = () => {
    const navigation = useNavigation();
    useEffect(() => {
        const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
            const data = response.notification.request.content?.data;
            console.log("DATA", data);
            // if (data?.story_id) {
            //     navigation.navigate(NAVIGATION.Stack_Story_Detail, {
            //         story: {
            //             id: data.story_id,
            //         },
            //     });
            //     return;
            // }
            // if (data?.url) {
            //     Linking.openURL(data.url);
            // }
        });
        return () => subscription.remove();
    }, []);
};

export const getExpoPushToken = async () => {
    let token = undefined;
    try {
        if (Constants.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== "granted") {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== "granted") {
                return;
            }
            token = (await Notifications.getExpoPushTokenAsync()).data;
            return token;
        } else {
            showToast({
                type: "error",
                title: "Lỗi",
                description: "Must use physical device for Push Notifications",
            });
        }
    } catch (e) {
        return token;
    }
};

export const listenServerNotification = () => {
    if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("server", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
        });
    }
};

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});
