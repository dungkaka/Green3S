import LoadingOverlay from "@common-components/AppModal/LoadingOverlay";
import ModalVersion from "@common-components/AppModal/ModalVersion";
import ConfirmAlert from "@common-ui/Alert/ConfirmAlert";
import { ToastManager } from "@common-ui/ToastNotify/ToastManager";
import React from "react";
import { Fragment } from "react";
import { StyleSheet, Text, View } from "react-native";

const GlobalUI = ({ isLogin }) => {
    return (
        <Fragment>
            <ConfirmAlert />
            <ToastManager position="top" />
            <LoadingOverlay />
            <ModalVersion />
        </Fragment>
    );
};

export default GlobalUI;
