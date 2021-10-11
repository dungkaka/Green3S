import React from "react";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeRouter from "screen/HomeRouter";
import { NAVIGATION } from "constant/navigation";
import { GoogleSansFontType } from "@theme/typography";
import { ColorDefault } from "@theme/index";
import Login from "screen/Auth/Login";
import { Fragment } from "react";
import { enableAnimationExperimental, handleKillApp, ignoreLogs } from "@utils/helps/appHandler";
import GlobalUI from "@common-components/GlobalUI";
import Portal from "@burstware/react-native-portal";
import DetailPlantTab from "screen/DetailPlant/DetailPlantTab";
import ReportFactory from "screen/DetailPlant/ReportFactory";
import ReportInverter from "screen/DetailPlant/ReportInverter";
import ReportAC from "screen/DetailPlant/ReportAC";
import ReportDC from "screen/DetailPlant/ReportDC";
import ReportPlantYield from "screen/Management/ReportPlantYield";
import ReportPlantMaterial from "screen/Management/ReportPlantMaterial";
import ReportPlanLogRepair from "screen/Management/ReportPlantLogRepair";
import ReportPotentialError from "screen/Management/ReportPotentialError";
import ErrorAC from "screen/Maintain/ErrorAC";
import ErrorDC from "screen/Maintain/ErrorDC";
import Performance from "screen/Maintain/Performance";
import PotentialError from "screen/Maintain/PotentialError";

enableAnimationExperimental();
handleKillApp();
ignoreLogs();

const Stack = createStackNavigator();

const AppNavigation = ({ isLogin }) => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={NAVIGATION.LOGIN}
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
                {!isLogin ? (
                    <Stack.Screen
                        name={NAVIGATION.LOGIN}
                        component={Login}
                        options={{
                            headerShown: false,
                        }}
                    />
                ) : (
                    <Fragment>
                        <Stack.Screen
                            name={NAVIGATION.HOME}
                            component={HomeRouter}
                            options={{
                                headerShown: false,
                            }}
                        />

                        <Stack.Group screenOptions={{ ...TransitionPresets.ModalPresentationIOS }}>
                            {/* Detail Of A Plants */}
                            <Stack.Group>
                                <Stack.Screen
                                    name={NAVIGATION.DETAIL_PLANT}
                                    component={DetailPlantTab}
                                    options={{
                                        title: "Nhà máy",
                                        // headerBackgroundContainerStyle: {
                                        //     height: "101%",
                                        // },
                                    }}
                                />
                                <Stack.Screen
                                    name={NAVIGATION.REPORT_FACTORY}
                                    component={ReportFactory}
                                    options={{
                                        title: "Nhà máy",
                                    }}
                                />

                                <Stack.Screen
                                    name={NAVIGATION.REPORT_INVERTER}
                                    component={ReportInverter}
                                    options={{
                                        title: "Inverter",
                                    }}
                                />

                                <Stack.Screen
                                    name={NAVIGATION.REPORT_AC}
                                    component={ReportAC}
                                    options={{
                                        title: "Lỗi AC",
                                    }}
                                />

                                <Stack.Screen
                                    name={NAVIGATION.REPORT_DC}
                                    component={ReportDC}
                                    options={{
                                        title: "Lỗi DC và hiệu suất",
                                    }}
                                />
                            </Stack.Group>

                            {/* Report Tab */}
                            <Stack.Group>
                                <Stack.Screen
                                    name={NAVIGATION.REPORT_PLANT_YIELD}
                                    component={ReportPlantYield}
                                    options={{
                                        title: "Báo cáo nhà máy",
                                    }}
                                />
                                <Stack.Screen
                                    name={NAVIGATION.REPORT_PLANT_MATERIAL}
                                    component={ReportPlantMaterial}
                                    options={{
                                        title: "Báo cáo vật tư",
                                    }}
                                />
                                <Stack.Screen
                                    name={NAVIGATION.REPORT_PLANT_LOG_REPAIR}
                                    component={ReportPlanLogRepair}
                                    options={{
                                        title: "Nhật kí sửa chữa",
                                    }}
                                />
                                <Stack.Screen
                                    name={NAVIGATION.REPORT_PLANT_POTENTIAL_ERROR}
                                    component={ReportPotentialError}
                                    options={{
                                        title: "Lỗi tiềm ẩn",
                                    }}
                                />
                            </Stack.Group>

                            {/* Error */}
                            <Stack.Group>
                                <Stack.Screen
                                    name={NAVIGATION.ERROR_AC}
                                    component={ErrorAC}
                                    options={{
                                        title: "Lỗi AC",
                                    }}
                                />
                                <Stack.Screen
                                    name={NAVIGATION.ERROR_DC}
                                    component={ErrorDC}
                                    options={{
                                        title: "Lỗi DC",
                                    }}
                                />
                                <Stack.Screen
                                    name={NAVIGATION.PERFORMANCE}
                                    component={Performance}
                                    options={{
                                        title: "Hiệu suất",
                                    }}
                                />
                                <Stack.Screen
                                    name={NAVIGATION.POTENTIAL_ERROR}
                                    component={PotentialError}
                                    options={{
                                        title: "Lỗi tiềm ẩn",
                                    }}
                                />
                            </Stack.Group>
                        </Stack.Group>
                    </Fragment>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const AppContainer = ({ isLogin }) => {
    return (
        <Portal.Host>
            <AppNavigation isLogin={isLogin} />
            <GlobalUI isLogin={isLogin} />
        </Portal.Host>
    );
};

export default AppContainer;
