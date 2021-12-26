import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NAVIGATION } from "constant/navigation";
import React, { useEffect } from "react";
import Home from "../Home";
import Profile from "../Profile";
import BottomTab from "./BottomTab";
import Portal from "@burstware/react-native-portal";
import Management from "../Management";
import Maintain from "../Maintain";
import { ColorDefault } from "@theme";
import { GoogleSansFontType } from "@theme/typography";
import Alarm from "../Home/Alarm";
import { Color } from "@theme/colors";

const Tab = createBottomTabNavigator();

function TabNavigation() {
    return (
        <Portal.Host>
            <Tab.Navigator
                initialRouteName="Explorer"
                tabBar={(props) => <BottomTab {...props} />}
                // tabBar={(props) => null}
                screenOptions={{
                    headerTitleStyle: {
                        fontFamily: GoogleSansFontType.medium,
                    },
                    headerTintColor: "white",
                    headerStyle: {
                        backgroundColor: ColorDefault.primary,
                        elevation: 0,
                        shadowColor: "transparent",
                    },
                }}
            >
                <Tab.Screen
                    options={{
                        headerShown: false,
                    }}
                    name={NAVIGATION.TAB_HOME}
                    component={Home}
                />
                <Tab.Screen
                    options={{
                        title: "Báo động",
                        headerStyle: {
                            backgroundColor: "#c94234",
                            elevation: 0,
                            shadowColor: "transparent",
                        },
                    }}
                    name={NAVIGATION.TAB_ALARM}
                    component={Alarm}
                />
                <Tab.Screen
                    options={{
                        title: "Quản lý",
                        headerShown: false,
                    }}
                    name={NAVIGATION.TAB_MANAGEMENT}
                    component={Management}
                />
                <Tab.Screen
                    options={{
                        title: "Bảo trì",
                        headerShown: false,
                    }}
                    name={NAVIGATION.TAB_MAINTAIN}
                    component={Maintain}
                />
                <Tab.Screen
                    options={{
                        headerShown: false,
                    }}
                    name={NAVIGATION.TAB_USER}
                    component={Profile}
                />
            </Tab.Navigator>
        </Portal.Host>
    );
}

export default TabNavigation;
