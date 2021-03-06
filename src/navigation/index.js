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
import InactiveInverter from "screen/Maintain/InactiveInterver";
import AllError from "screen/Maintain/AllError";
import RSUpdation from "screen/Maintain/RSUpdation/UpdateOne";
import RSMultipleUpdation from "screen/Maintain/RSUpdation/UpdateMultiple";
import ErrorPotentialCreation from "screen/Maintain/ErrorCreation/ErrorPotentialCreation";
import SettingPV from "screen/Device/Setting/SettingPV";
import SettingDirection from "screen/Device/Setting/SettingDirection";
import SettingShade from "screen/Device/Setting/SettingShade";

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

                        {/* Detail Of A Plants */}
                        <Stack.Group screenOptions={{ ...TransitionPresets.ModalPresentationIOS }}>
                            <Stack.Screen
                                name={NAVIGATION.DETAIL_PLANT}
                                component={DetailPlantTab}
                                options={{
                                    title: "Nh?? m??y",
                                    headerBackgroundContainerStyle: {
                                        height: "101%",
                                    },
                                }}
                            />
                            <Stack.Screen
                                name={NAVIGATION.DP_REPORT_FACTORY}
                                component={DPReportFactory}
                                options={{
                                    title: "Nh?? m??y",
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
                                    title: "L???i AC",
                                }}
                            />

                            <Stack.Screen
                                name={NAVIGATION.DP_REPORT_DC}
                                component={DPReportDC}
                                options={{
                                    title: "L???i DC",
                                }}
                            />

                            <Stack.Screen
                                name={NAVIGATION.DP_REPORT_PERFORMANCE}
                                component={DPReportPerformance}
                                options={{
                                    title: "Hi???u su???t th???p",
                                }}
                            />

                            <Stack.Screen
                                name={NAVIGATION.DP_REPORT_POTENTIAL_ERROR}
                                component={DPReportPotentialError}
                                options={{
                                    title: "L???i ti???m ???n",
                                }}
                            />
                        </Stack.Group>

                        {/* Report Tab */}
                        <Stack.Group screenOptions={{ ...TransitionPresets.SlideFromRightIOS }}>
                            <Stack.Screen
                                name={NAVIGATION.REPORT_PLANT_YIELD}
                                component={ReportPlantYield}
                                options={{
                                    title: "B??o c??o nh?? m??y",
                                }}
                            />
                            <Stack.Screen
                                name={NAVIGATION.REPORT_PLANT_MATERIAL}
                                component={ReportPlantMaterial}
                                options={{
                                    title: "B??o c??o v???t t??",
                                }}
                            />
                            <Stack.Screen
                                name={NAVIGATION.REPORT_PLANT_LOG_REPAIR}
                                component={ReportPlanLogRepair}
                                options={{
                                    title: "Nh???t k?? s???a ch???a",
                                }}
                            />
                            <Stack.Screen
                                name={NAVIGATION.REPORT_PLANT_POTENTIAL_ERROR}
                                component={ReportPotentialError}
                                options={{
                                    title: "L???i ti???m ???n",
                                }}
                            />
                            <Stack.Screen
                                name={NAVIGATION.REPORT_MAINTENANCE}
                                component={ReportMaintainance}
                                options={{
                                    title: "B??o c??o b???o tr??",
                                }}
                            />
                            <Stack.Screen
                                name={NAVIGATION.REPORT_PLAN_MAINTENANCE}
                                component={ReportPlanMaintainance}
                                options={{
                                    title: "B??o c??o k??? ho???ch b???o tr??",
                                }}
                            />
                        </Stack.Group>

                        {/* Error */}
                        <Stack.Group
                            screenOptions={{
                                ...TransitionPresets.SlideFromRightIOS,
                            }}
                        >
                            <Stack.Screen
                                name={NAVIGATION.ALLE_ERROR}
                                component={AllError}
                                options={{
                                    title: "T???t c??? l???i",
                                }}
                            />
                            <Stack.Screen
                                name={NAVIGATION.ERROR_AC}
                                component={ErrorAC}
                                options={{
                                    title: "L???i AC",
                                }}
                            />
                            <Stack.Screen
                                name={NAVIGATION.ERROR_DC}
                                component={ErrorDC}
                                options={{
                                    title: "L???i DC",
                                }}
                            />
                            <Stack.Screen
                                name={NAVIGATION.PERFORMANCE}
                                component={Performance}
                                options={{
                                    title: "Hi???u su???t",
                                }}
                            />
                            <Stack.Screen
                                name={NAVIGATION.POTENTIAL_ERROR}
                                component={PotentialError}
                                options={{
                                    title: "L???i ti???m ???n",
                                }}
                            />
                            {/* <Stack.Screen
                                    name={NAVIGATION.ERROR_RESISTOR}
                                    component={ErrorResistor}
                                    options={{
                                        title: "L???i ??i???n tr??? c??ch ??i???n th???p",
                                    }}
                                /> */}
                            <Stack.Screen
                                name={NAVIGATION.INACTIVE_INVERTER}
                                component={InactiveInverter}
                                options={{
                                    title: "Inverter d???ng ho???t ?????ng",
                                }}
                            />
                            <Stack.Screen
                                name={NAVIGATION.ERROR_DISCONNECT}
                                component={ErrorDisconnect}
                                options={{
                                    title: "L???i m???t t??n hi???u trong ng??y",
                                }}
                            />
                            <Stack.Screen
                                name={NAVIGATION.RS_UPDATION}
                                component={RSUpdation}
                                options={{
                                    title: "C???p nh???t l???i",
                                }}
                            />
                            <Stack.Screen
                                name={NAVIGATION.RS_UPDATE_MULTIPLE}
                                component={RSMultipleUpdation}
                                options={{
                                    title: "C???p nh???t l???i",
                                }}
                            />
                            <Stack.Screen
                                name={NAVIGATION.ERROR_POTENTIEL_CREATION}
                                component={ErrorPotentialCreation}
                                options={{
                                    title: "T???o l???i ti???m ???n",
                                }}
                            />
                        </Stack.Group>

                        {/* V???t t?? */}
                        <Stack.Screen
                            name={NAVIGATION.MATERIAL}
                            component={Material}
                            options={{
                                ...TransitionPresets.ModalPresentationIOS,
                                title: "Danh s??ch v???t t??",
                            }}
                        />

                        {/* Detail Of A Device */}
                        <Stack.Group screenOptions={{ ...TransitionPresets.ModalPresentationIOS }}>
                            <Stack.Screen
                                name={NAVIGATION.DETAIL_DEVICE}
                                component={Device}
                                options={{
                                    title: "Thi???t b???",
                                    headerBackgroundContainerStyle: {
                                        height: "101%",
                                    },
                                }}
                            />
                            <Stack.Screen
                                name={NAVIGATION.DEVICE_SETTING_PV}
                                component={SettingPV}
                                options={{
                                    title: "C??i ?????t PV",
                                }}
                            />
                            <Stack.Screen
                                name={NAVIGATION.DEVICE_SETTING_DIRECTION}
                                component={SettingDirection}
                                options={{
                                    title: "C??i ?????t h?????ng",
                                }}
                            />
                            <Stack.Screen
                                name={NAVIGATION.DEVICE_SETTING_SHADE}
                                component={SettingShade}
                                options={{
                                    title: "C??i ?????t b??ng che",
                                }}
                            />
                        </Stack.Group>

                        {/* B???o tr?? */}
                        <Stack.Group screenOptions={{ ...TransitionPresets.ModalPresentationIOS }}>
                            <Stack.Screen
                                name={NAVIGATION.MAINTAINANCE_LIST_WORK}
                                component={MaintainanceListWork}
                                options={{
                                    title: "Danh s??ch b???o tr??",
                                }}
                            />
                            <Stack.Screen
                                name={NAVIGATION.MAINTAINANCE_CATEGORY}
                                component={MaintainanceCategory}
                                options={{
                                    title: "Danh s??ch h???ng m???c b???o tr??",
                                }}
                            />
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
            <Portal.Host>
                <AppNavigation isLogin={isLogin} />
            </Portal.Host>
            <GlobalUI isLogin={isLogin} />
        </Portal.Host>
    );
};

export default AppContainer;
