import { AppText, AppTextMedium } from "@common-ui/AppText";
import { JumpLogoPage } from "@common-ui/Loading/JumpLogo";
import { useRoute } from "@react-navigation/native";
import { useFetchDetailPlant } from "@services/factory";
import { Color } from "@theme/colors";
import { rem, unit } from "@theme/styleContants";
import React from "react";
import { StyleSheet, View } from "react-native";

const ItemRowDetail = ({ title, des }) => (
    <View
        style={{
            flexDirection: "row",
            marginHorizontal: rem,
            paddingVertical: rem,
            borderBottomWidth: 1,
            borderBottomColor: Color.gray_2,
        }}
    >
        <View style={{ flex: 2, paddingRight: rem, flexWrap: "wrap" }}>
            <AppTextMedium numberOfLines={1} style={{ color: Color.gray_11 }}>
                {title}
            </AppTextMedium>
        </View>
        <View style={{ flex: 3, alignItems: "flex-end", paddingLeft: rem }}>
            <AppText numberOfLines={3} style={{ color: Color.gray_8 }}>
                {des}
            </AppText>
        </View>
    </View>
);

const PlantInfo = () => {
    const { params } = useRoute();
    const { stationCode } = params ? params : {};

    const { data, isValidating, error } = useFetchDetailPlant({ station_code: stationCode });

    if (isValidating) return <JumpLogoPage />;
    if (error || !data) return null;

    const info = data.data || {};

    return (
        <View style={styles.container}>
            <AppTextMedium style={{ marginHorizontal: 12 * unit, fontSize: 16 * unit, color: Color.gray_12 }}>
                Thông tin chi tiết
            </AppTextMedium>
            <View style={{ margin: 12 * unit, backgroundColor: "white", borderRadius: 6 * unit }}>
                <ItemRowDetail title="Tên nhà máy" des={info.stationName} />
                <ItemRowDetail title="Quốc gia / Khu vực" des="Việt Nam" />
                <ItemRowDetail title="Kinh độ / Vĩ độ" des={`${info.longitude} / ${info.latitude} `} />
                <ItemRowDetail title="Tổng công suất chuỗi" des={info.capacity} />
                <ItemRowDetail title="Địa chỉ" des={info.stationAddr} />
            </View>
        </View>
    );
};

export default React.memo(PlantInfo, () => true);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 2 * rem,
    },
});
