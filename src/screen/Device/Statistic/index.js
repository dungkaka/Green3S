import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import CapacityChart from "./CapacityChart";

const Statistic = () => {
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <CapacityChart />
        </ScrollView>
    );
};

export default React.memo(Statistic, () => true);

const styles = StyleSheet.create({});
