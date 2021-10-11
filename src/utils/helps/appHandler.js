import { LogBox, Platform, UIManager } from "react-native";

export const handleKillApp = () => {
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
};

export const ignoreLogs = () => {
    LogBox.ignoreLogs(["Setting a timer for a long period of time"]);
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
};

export const enableAnimationExperimental = () => {
    if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
};
