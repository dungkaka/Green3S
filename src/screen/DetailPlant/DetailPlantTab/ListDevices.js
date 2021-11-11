import { AppText, AppTextMedium } from "@common-ui/AppText";
import { JumpLogo, JumpLogoPage } from "@common-ui/Loading/JumpLogo";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useFetchDetailPlant } from "@services/factory";
import { Color } from "@theme/colors";
import { rem, unit } from "@theme/styleContants";
import { NAVIGATION } from "constant/navigation";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

const ListDevices = () => {
    const navigation = useNavigation();
    const { params } = useRoute();
    const { stationCode } = params ? params : {};

    const { data, isValidating, error } = useFetchDetailPlant({ station_code: stationCode });

    if (isValidating) return <JumpLogoPage />;
    if (error || !data) return null;

    const devices = data.data?.device || [];

    const renderItem = ({ item = {}, index }) => {
        const { device_id, devName, stationCode } = item;

        return (
            <Pressable
                onPress={() => {
                    navigation.navigate(NAVIGATION.DETAIL_DEVICE, {
                        device: item,
                    });
                }}
                style={styles.itemContainer}
            >
                <AppTextMedium style={styles.devName}>{devName}</AppTextMedium>
                <AppText style={styles.devDes}>Loại thiết bị: Interver</AppText>
                <AppText style={styles.devDes}>Phiên bản: V300R001C00SPC040</AppText>
                <AppText style={styles.devDes}>SN: 1020B0169659</AppText>
                <AppText style={styles.devDes}>Model: SUN2000-100KTL-M1</AppText>
            </Pressable>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                contentContainerStyle={styles.containerFlatlist}
                showsVerticalScrollIndicator={false}
                data={devices}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
            />
        </View>
    );
};

export default React.memo(ListDevices);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerFlatlist: {
        padding: 12 * unit,
    },
    itemContainer: {
        padding: rem,
        backgroundColor: "white",
        marginVertical: 6 * unit,
        borderRadius: 4 * unit,
    },
    devName: {
        fontSize: 15 * unit,
        color: Color.gray_10,
        paddingBottom: 2 * unit,
    },
    devDes: {
        color: Color.gray_8,
        paddingBottom: 2 * unit,
    },
});
