import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NAVIGATION } from "constant/navigation";
import React, { useEffect } from "react";
import Explorer from "../Explorer";
import Home from "../Home";
import Profile from "../Profile";
import BottomTab from "./BottomTab";
import Portal from "@burstware/react-native-portal";

const Tab = createBottomTabNavigator();

function TabNavigation() {
    return (
        <Portal.Host>
            <Tab.Navigator
                screenOptions={{ headerShown: false }}
                initialRouteName="Explorer"
                tabBar={(props) => <BottomTab {...props} />}
                // tabBar={(props) => null}
            >
                <Tab.Screen name={NAVIGATION.TAB_HOME} component={Home} />
                <Tab.Screen name={NAVIGATION.TAB_FEEDS} component={Explorer} />
                <Tab.Screen name={NAVIGATION.TAB_USER} component={Profile} />
                <Tab.Screen name={"other"} component={Profile} />
            </Tab.Navigator>
        </Portal.Host>
    );
}

export default TabNavigation;
