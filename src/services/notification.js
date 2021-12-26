import { Linking, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { NAVIGATION } from "constant/navigation";
import { showToast } from "@common-ui/ToastNotify/ToastManager";
// import * as TaskManager from "expo-task-manager";

// const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

// TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }) => {
//     console.log("Received a notification in the background!");
//     // Do something with the notification data
// });

// Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

export const useListenResponseNotification = () => {
    const navigation = useNavigation();
    useEffect(() => {
        const checkLastNoti = async () => {
            const lastNotificationResponse = await Notifications.getLastNotificationResponseAsync();
            if (
                lastNotificationResponse?.notification?.request?.content?.data &&
                lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
            ) {
                navigation.navigate(NAVIGATION.HOME, {
                    screen: NAVIGATION.TAB_HOME,
                    params: {
                        fromErrorNotification: true,
                    },
                });
            }
        };

        checkLastNoti();

        const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
            const data = response.notification.request.content?.data;
            navigation.navigate(NAVIGATION.HOME, {
                screen: NAVIGATION.TAB_HOME,
                params: {
                    fromErrorNotification: true,
                },
            });
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
        showToast({
            type: "error",
            title: "Lỗi",
            description: e.message,
        });
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
