import { AppText, AppTextBold, AppTextMedium } from "@common-ui/AppText";
import { JumpLogoPage } from "@common-ui/Loading/JumpLogo";
import EcoLight from "@components/icon/EcoLight";
import SolarEnergy from "@components/icon/SolarEnergy";
import SolarPanel from "@components/icon/SolarPanel";
import ThunderBolt from "@components/icon/ThunderBolt";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useFetchDetailPlant } from "@services/factory";
import { ColorDefault } from "@theme/index";
import { Color, PairColor } from "@theme/colors";
import { rem, unit } from "@theme/styleContants";
import { GoogleSansFontType, MontserratFontType } from "@theme/typography";
import React, { useRef } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Factory from "@components/icon/Factory";
import Inverter from "@components/icon/Inverter";
import AC from "@components/icon/AC";
import Circuit from "@components/icon/Circuit";
import { NAVIGATION } from "constant/navigation";
import { ModalDatePicker } from "@common-ui/Wheel/DatePicker";

const Item = ({ title, icon, textColor }) => {
    return (
        <View style={styles.itemContainer}>
            <View style={styles.iconItem}>{icon}</View>
            <View style={styles.contentContainer}>
                <AppTextMedium style={{ fontSize: 20 * unit, color: textColor, paddingBottom: 4 * unit }}>
                    1.61 kWh
                </AppTextMedium>
                <AppText style={styles.titleItem}>{title}</AppText>
            </View>
        </View>
    );
};

const ItemReport = ({ icon, title, onPress }) => {
    return (
        <Pressable onPress={onPress} style={styles.itemReport}>
            <View style={styles.iconReport}>{icon}</View>
            <AppTextMedium style={styles.titleReport}>{title}</AppTextMedium>
        </Pressable>
    );
};

const General = () => {
    console.log("REN");
    const { params } = useRoute();
    const navigation = useNavigation();
    const { stationCode } = params ? params : {};

    const { data, isValidating, error } = useFetchDetailPlant({ station_code: stationCode });

    if (isValidating) return <JumpLogoPage />;
    if (error || !data) return null;

    const info = data?.data || {};

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={{ backgroundColor: "white", paddingVertical: 24 * unit }}>
                <Text style={styles.title}>Sản lượng năng lượng</Text>
                <View style={styles.itemRow}>
                    <Item
                        title="Tổng sản lượng"
                        icon={<EcoLight size={42 * unit} color={PairColor.purple.dark} />}
                        textColor="rgba(192, 142, 70, 0.9)"
                    />
                    <Item
                        title="Sản lượng hôm nay"
                        icon={<ThunderBolt size={42 * unit} color="#d6980f" />}
                        textColor="rgba(200, 84, 37, 0.9)"
                    />
                </View>
                <View style={{ flexDirection: "row", paddingHorizontal: 8 * unit }}>
                    <Item
                        title="Sản lượng tháng này"
                        icon={<SolarEnergy size={42 * unit} color={PairColor.red.dark} />}
                        textColor="rgba(42, 154, 42, 0.9)"
                    />
                    <Item
                        title="Sản lượng năm nay"
                        icon={<SolarPanel size={42 * unit} color={PairColor.blue.dark} />}
                        textColor="rgba(34, 100, 180, 0.9)"
                    />
                </View>
            </View>

            <View style={styles.reportBlock}>
                <Text style={styles.title}>Báo cáo</Text>
                <View style={styles.itemRow}>
                    <ItemReport
                        onPress={() => {
                            navigation.push(NAVIGATION.REPORT_FACTORY);
                        }}
                        backgroundColor="rgba(159, 51, 171, 0.1)"
                        title="Nhà máy"
                        icon={<Factory size={32 * unit} color={Color.gray_10} />}
                    />
                    <ItemReport
                        onPress={() => {
                            navigation.push(NAVIGATION.REPORT_INVERTER);
                        }}
                        backgroundColor="rgba(204, 151, 61, 0.15)"
                        title="Inverter"
                        icon={<Inverter size={32 * unit} color={Color.gray_10} />}
                    />
                    <ItemReport
                        onPress={() => {
                            navigation.push(NAVIGATION.REPORT_AC);
                        }}
                        backgroundColor="rgba(232, 58, 78, 0.1)"
                        title="Lỗi AC"
                        icon={<AC size={32 * unit} color={Color.gray_10} />}
                    />
                    <ItemReport
                        onPress={() => {
                            navigation.push(NAVIGATION.REPORT_DC);
                        }}
                        backgroundColor="rgba(56, 110, 199, 0.1)"
                        title="Lỗi DC & hiệu suất"
                        icon={<Circuit size={32 * unit} color={Color.gray_10} />}
                    />
                </View>
            </View>
        </ScrollView>
    );
};

export default React.memo(General);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ColorDefault.background,
    },
    title: {
        marginBottom: 6 * unit,
        paddingHorizontal: 16 * unit,
        fontSize: 16 * unit,
        fontFamily: GoogleSansFontType.medium,
        color: Color.gray_10,
    },
    itemRow: {
        flexDirection: "row",
        paddingHorizontal: 8 * unit,
    },
    itemContainer: {
        height: 180 * unit,
        margin: 8 * unit,
        flex: 1,
        backgroundColor: Color.gray_1,
        borderRadius: 12 * unit,
    },
    iconItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        top: 4,
    },
    contentContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20 * unit,
    },
    titleContainer: {
        flex: 3,
        justifyContent: "center",
        alignItems: "center",
        padding: 8 * unit,
    },
    titleItem: { fontSize: 14 * unit, color: Color.gray_9, textAlign: "center" },
    reportBlock: {
        marginVertical: 10 * unit,
        backgroundColor: "white",
        paddingVertical: 24 * unit,
    },
    itemReport: {
        height: 100 * unit,
        width: 65 * unit,
        marginVertical: 8 * unit,
        marginLeft: 8 * unit,
        marginRight: 10 * unit,
    },
    iconReport: {
        height: 65 * unit,
        width: 65 * unit,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Color.gray_2,
        borderRadius: 16 * unit,
    },
    titleReport: {
        textAlign: "center",
        paddingVertical: 4 * unit,
        color: Color.gray_10,
    },
});
