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
import ReportPlantYield from "screen/Management/ReportPlantYield";
import ReportPlantMaterial from "screen/Management/ReportPlantMaterial";
import ReportPlanLogRepair from "screen/Management/ReportPlantLogRepair";
import ReportPotentialError from "screen/Management/ReportPotentialError";
import ErrorAC from "screen/Maintain/ErrorAC";
import ErrorDC from "screen/Maintain/ErrorDC";
import Performance from "screen/Maintain/Performance";
import PotentialError from "screen/Maintain/PotentialError";
import ErrorResistor from "screen/Maintain/ErrorResistor";
import ErrorDisconnect from "screen/Maintain/ErrorDisconnect";
import Alarm from "screen/HomeRouter/Home/Alarm";
import { Color } from "@theme/colors";
import Material from "screen/Management/Material";
import MaintainanceListWork from "screen/Maintain/MaintananceListWork";
import MaintainanceCategory from "screen/Maintain/MaintainanceCategory";
import ReportMaintainance from "screen/Management/ReportMaintaiance";
import ReportPlanMaintainance from "screen/Management/ReportPlanMaintainance";
import DPReportAC from "screen/DetailPlant/ReportAC";
import DPReportDC from "screen/DetailPlant/ReportDC";
import DPReportFactory from "screen/DetailPlant/ReportFactory";
import DPReportInverter from "screen/DetailPlant/ReportInverter";
import DPReportPerformance from "screen/DetailPlant/ReportPerformance";
import DPReportPotentialError from "screen/DetailPlant/ReportPotentialError";
import Device from "screen/Device/index";

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
                                        headerBackgroundContainerStyle: {
                                            height: "101%",
                                        },
                                    }}
                                />
                                <Stack.Screen
                                    name={NAVIGATION.DP_REPORT_FACTORY}
                                    component={DPReportFactory}
                                    options={{
                                        title: "Nhà máy",
                                    }}
                                />

                                <Stack.Screen
                                    name={NAVIGATION.DP_REPORT_INVERTER}
                                    component={DPReportInverter}
                                    options={{
                                        title: "Inverter",
                                    }}
                                />

                                <Stack.Screen
                                    name={NAVIGATION.DP_REPORT_AC}
                                    component={DPReportAC}
                                    options={{
                                        title: "Lỗi AC",
                                    }}
                                />

                                <Stack.Screen
                                    name={NAVIGATION.DP_REPORT_DC}
                                    component={DPReportDC}
                                    options={{
                                        title: "Lỗi DC",
                                    }}
                                />

                                <Stack.Screen
                                    name={NAVIGATION.DP_REPORT_PERFORMANCE}
                                    component={DPReportPerformance}
                                    options={{
                                        title: "Hiệu suất thấp",
                                    }}
                                />

                                <Stack.Screen
                                    name={NAVIGATION.DP_REPORT_POTENTIAL_ERROR}
                                    component={DPReportPotentialError}
                                    options={{
                                        title: "Lỗi tiềm ẩn",
                                    }}
                                />
                            </Stack.Group>

                            {/* Detail Of A Device */}
                            <Stack.Group screenOptions={{ ...TransitionPresets.ModalPresentationIOS }}>
                                <Stack.Screen
                                    name={NAVIGATION.DETAIL_DEVICE}
                                    component={Device}
                                    options={{
                                        title: "Thiết bị",
                                        headerBackgroundContainerStyle: {
                                            height: "101%",
                                        },
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
                                <Stack.Screen
                                    name={NAVIGATION.REPORT_MAINTENANCE}
                                    component={ReportMaintainance}
                                    options={{
                                        title: "Báo cáo bảo trì",
                                    }}
                                />
                                <Stack.Screen
                                    name={NAVIGATION.REPORT_PLAN_MAINTENANCE}
                                    component={ReportPlanMaintainance}
                                    options={{
                                        title: "Báo cáo kế hoạch bảo trì",
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
                                <Stack.Screen
                                    name={NAVIGATION.ERROR_RESISTOR}
                                    component={ErrorResistor}
                                    options={{
                                        title: "Lỗi điện trở cách điện thấp",
                                    }}
                                />
                                <Stack.Screen
                                    name={NAVIGATION.ERROR_DISCONNECT}
                                    component={ErrorDisconnect}
                                    options={{
                                        title: "Lỗi mất tín hiệu trong ngày",
                                    }}
                                />
                            </Stack.Group>

                            {/* Báo động */}
                            <Stack.Screen
                                name={NAVIGATION.ALARM}
                                component={Alarm}
                                options={{
                                    title: "Báo động",
                                    headerStyle: {
                                        backgroundColor: Color.redDark,
                                    },
                                }}
                            />

                            {/* Vật tư */}
                            <Stack.Screen
                                name={NAVIGATION.MATERIAL}
                                component={Material}
                                options={{
                                    title: "Danh sách vật tư",
                                }}
                            />

                            {/* Bảo trì */}
                            <Stack.Group>
                                <Stack.Screen
                                    name={NAVIGATION.MAINTAINANCE_LIST_WORK}
                                    component={MaintainanceListWork}
                                    options={{
                                        title: "Danh sách bảo trì",
                                    }}
                                />
                                <Stack.Screen
                                    name={NAVIGATION.MAINTAINANCE_CATEGORY}
                                    component={MaintainanceCategory}
                                    options={{
                                        title: "Danh sách hạng mục bảo trì",
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
