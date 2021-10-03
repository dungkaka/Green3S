import LoadingOverlay from "@common-components/AppModal/LoadingOverlay";
import React from "react";
import { Fragment } from "react";
import { StyleSheet, Text, View } from "react-native";

const GlobalUI = () => {
    return (
        <Fragment>
            <LoadingOverlay />
        </Fragment>
    );
};

export default GlobalUI;

const styles = StyleSheet.create({});
