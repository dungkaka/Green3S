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

export default React.memo(Statistic, () => true);

const styles = StyleSheet.create({});
