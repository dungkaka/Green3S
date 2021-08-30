import { Toast, ToastManager } from "@common-ui/ToastNotify/ToastManager";
import AppContainer from "@navigation/index";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Font from "expo-font";
import { GoogleSansFont, MontserratFont } from "@theme/typography";

const defaultErrorHandler = (ErrorUtils.getGlobalHandler && ErrorUtils.getGlobalHandler()) || ErrorUtils._globalHandler;
let handledError = false;

const globalErrorHandler = async (err, isFatal) => {
    if (!handledError) {
        handledError = true;
        try {
            console.log("KILL_APP", isFatal + err.message);
        } catch (e) {}
    }
    return defaultErrorHandler(err, isFatal);
};

ErrorUtils.setGlobalHandler(globalErrorHandler);

export function App() {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        prepareData();
        return () => {};
    }, []);

    const prepareData = async () => {
        await Font.loadAsync({ ...GoogleSansFont, ...MontserratFont });
        setIsReady(true);
    };

    if (!isReady) {
        return null;
    }

    return (
        <View style={{ flex: 1 }}>
            <AppContainer />
            <ToastManager />
        </View>
    );
}

export default function AppLoaded() {
    return <App />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
