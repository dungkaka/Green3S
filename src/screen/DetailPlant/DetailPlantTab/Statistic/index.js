import { AppText, AppTextMedium } from "@common-ui/AppText";
import EchartsWebView from "@common-ui/EchartsWebView";
import { ModalDatePicker } from "@common-ui/Wheel/DatePicker";
import { Color } from "@theme/colors";
import { ColorDefault } from "@theme/index";
import React, { useRef } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import CapacityChart from "./CapacityChart";
import RevenueChart from "./RevenueChart";

const Statistic = () => {
    return (
        <ScrollView style={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <CapacityChart />
            <View style={{ height: 10 }} />
            <RevenueChart />
        </ScrollView>
    );
};

export default React.memo(Statistic);

const styles = StyleSheet.create({});
