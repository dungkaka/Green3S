import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NAVIGATION } from "constant/navigation";
import React, { useEffect } from "react";
import BookShelf from "../BookShelf";
import Explorer from "../Explorer";
import Profile from "../Profile";
import BottomTab from "./BottomTab";

const Tab = createBottomTabNavigator();

function TabNavigation() {
    return (
        <Tab.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="Explorer"
            tabBar={(props) => <BottomTab {...props} />}
        >
            <Tab.Screen name={NAVIGATION.TAB_HOME} component={BookShelf} />
            <Tab.Screen name={NAVIGATION.TAB_FEEDS} component={Explorer} />
            <Tab.Screen name={NAVIGATION.TAB_USER} component={Profile} />
            <Tab.Screen name={"other"} component={Profile} />
        </Tab.Navigator>
    );
}

export default TabNavigation;
