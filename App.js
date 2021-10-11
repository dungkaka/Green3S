import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import * as Font from "expo-font";
import { useLogin } from "@services/auth";
import { appFont } from "@theme/typography";
import * as SplashScreen from "expo-splash-screen";
import { Provider } from "react-redux";
import { store } from "@redux/store";
let AppContainer = require("@navigation/index").default;

function App() {
    const [isReady, setIsReady] = useState(false);
    const { data, error, revalidateLocalUser } = useLogin();
    const isLogin = !!data && !error;

    useEffect(() => {
        const prepareData = async () => {
            await SplashScreen.preventAutoHideAsync();
            // AppContainer = require("@navigation/index").default;
            await Promise.all([revalidateLocalUser(), Font.loadAsync(appFont)]);
            setIsReady(true);
        };
        prepareData();
        return () => {};
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (isReady) {
            await SplashScreen.hideAsync();
        }
    }, [isReady]);

    if (!isReady) return null;

    return (
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <AppContainer isLogin={isLogin} />
        </View>
    );
}

export default function AppLoaded() {
    return (
        <Provider store={store}>
            <App />
        </Provider>
    );
}
