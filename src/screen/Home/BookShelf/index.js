import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TabView, TabBar, SceneMap, NavigationState, SceneRendererProps } from "react-native-tab-view";

const Test = () => (
    <View style={{ justifyContent: "center", alignItems: "center" }} collapsable={false}>
        <Text>{`Page ${5}`}</Text>
    </View>
);

const BookShelf = () => {
    const [state, setState] = useState({
        index: 1,
        routes: [
            { key: "article", title: "Article" },
            { key: "contacts", title: "Contacts" },
            { key: "albums", title: "Albums" },
            { key: "chat", title: "Chat" },
            { key: "long", title: "long long long title" },
            { key: "medium", title: "medium title" },
        ],
    });

    const renderScene = SceneMap({
        albums: Test,
        contacts: Test,
        article: Test,
        chat: Test,
        long: Test,
        medium: Test,
    });

    const renderTabBar = (props) => (
        <TabBar
            {...props}
            scrollEnabled
            indicatorStyle={styles.indicator}
            style={styles.tabbar}
            labelStyle={styles.label}
            tabStyle={styles.tabStyle}
        />
    );

    return (
        <TabView
            navigationState={state}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            onIndexChange={(index) => setState({ ...state, index: index })}
        />
    );
};

export default BookShelf;

const styles = StyleSheet.create({
    tabbar: {
        backgroundColor: "#3f51b5",
    },
    indicator: {
        backgroundColor: "#ffeb3b",
    },
    label: {
        fontWeight: "400",
    },
    tabStyle: {
        width: "auto",
    },
});
