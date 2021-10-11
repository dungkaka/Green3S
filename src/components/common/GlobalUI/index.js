import LoadingOverlay from "@common-components/AppModal/LoadingOverlay";
import { ToastManager } from "@common-ui/ToastNotify/ToastManager";
import React from "react";
import { Fragment } from "react";
import { StyleSheet, Text, View } from "react-native";

const GlobalUI = ({ isLogin }) => {
    return (
        <Fragment>
            <LoadingOverlay />
            <ToastManager position={isLogin ? "bottom" : "top"} />
        </Fragment>
    );
};

export default GlobalUI;

const styles = StyleSheet.create({});
