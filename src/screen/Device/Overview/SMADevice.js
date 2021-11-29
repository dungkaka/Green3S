import { AppText, AppTextMedium } from "@common-ui/AppText";
import { rem, unit } from "@theme/styleContants";
import React, { Fragment } from "react";
import { StyleSheet, View } from "react-native";
import { Color } from "@theme/colors";
import TableStickBasicTemplate from "@common-ui/Table/TableStickBasicTemplate";

const options = [
    {
        key: "order",
        title: "STT",
        width: 3 * rem,
        render: ({ item, index, cellStyle }) => (
            <View key={0} style={cellStyle}>
                <AppText style={styles.contentCell}>{index + 1}</AppText>
            </View>
        ),
    },
    {
        key: "name",
        title: "Chuỗi",
        width: 8 * rem,
    },
    {
        key: "u",
        title: "Điện áp đầu vào (V)",
        width: 8 * rem,
    },
    {
        key: "i",
        title: "Dòng điện vào (A)",
        width: 8 * rem,
    },
    {
        key: "mttp",
        title: "MTTP (KWH)",
        width: 8 * rem,
    },
    {
        key: "numString",
        title: "Chuỗi/String sử dụng",
        width: 8 * rem,
    },

    {
        key: "status",
        title: "Trạng thái",
        width: 10 * rem,
        render: ({ item, index, cellStyle }) => (
            <View key={6} style={cellStyle}>
                <AppText style={styles.contentCell}>{item.numString == 0 ? "Không dùng" : "Bình thường"}</AppText>
            </View>
        ),
    },
];

const DetailItem = ({ title, value }) => {
    return (
        <View style={styles.itemContainer}>
            <AppText>{title}</AppText>
            <View style={styles.itemDesContainer}>
                <AppText style={{ color: Color.gray_8 }}>{value}</AppText>
            </View>
        </View>
    );
};

const SMADevice = ({ data }) => {
    const datas = data?.dataDevices || [];
    const {
        a_u,
        ab_u,
        b_u,
        bc_u,
        c_u,
        ca_u,
        a_i,
        b_i,
        c_i,
        grid_frequency,
        power_factor,
        mppt_total_cap,
        apparent_power,
        open_time,
        pvGeneration,
        active_power,
        reactive_power,
    } = data?.data_device || {};

    return (
        <Fragment>
            <TableStickBasicTemplate
                heightRow={56}
                left={[0, 1]}
                stickPosition={3 * rem}
                options={options}
                data={datas}
                headerContainerStyle={styles.tableHeaderContainer}
                textHeaderStyle={styles.tableTextHeader}
                numberLinesContentCell={2}
            />
            <View style={styles.block}>
                <View style={styles.detailContainer}>
                    <AppTextMedium style={{ fontSize: 15 * unit }}>Chi tiết</AppTextMedium>
                    <DetailItem title="Dòng điện pha A" value={a_i} />
                    <DetailItem title="Điện áp pha A" value={a_u - ab_u} />
                    <DetailItem title="Dòng điện pha B" value={b_i} />
                    <DetailItem title="Điện áp pha B" value={b_u - bc_u} />
                    <DetailItem title="Dòng điện pha C" value={c_i} />
                    <DetailItem title="Điện áp pha C" value={c_u - ca_u} />
                    <DetailItem title="Công suất thực" value={active_power} />
                    <DetailItem title="Công suất vô công" value={reactive_power} />
                    <DetailItem title="Apparent power" value={apparent_power} />
                    <DetailItem title="Tần số lưới điện" value={grid_frequency} />
                    <DetailItem title="PV Generation" value={pvGeneration} />
                    <DetailItem title="Tổng sản lượng" value={mppt_total_cap} />
                </View>
            </View>
            <View style={styles.block}>
                <View style={styles.detailContainer}>
                    <AppTextMedium style={{ fontSize: 15 * unit }}>Chi tiết</AppTextMedium>
                    <DetailItem title="Dòng điện pha A" value={a_i} />
                    <DetailItem title="Điện áp pha A" value={a_u - ab_u} />
                    <DetailItem title="Dòng điện pha B" value={b_i} />
                    <DetailItem title="Điện áp pha B" value={b_u - bc_u} />
                    <DetailItem title="Dòng điện pha C" value={c_i} />
                    <DetailItem title="Điện áp pha C" value={c_u - ca_u} />
                    <DetailItem title="Công suất thực" value={active_power} />
                    <DetailItem title="Công suất vô công" value={reactive_power} />
                    <DetailItem title="Apparent power" value={apparent_power} />
                    <DetailItem title="Tần số lưới điện" value={grid_frequency} />
                    <DetailItem title="PV Generation" value={pvGeneration} />
                    <DetailItem title="Tổng sản lượng" value={mppt_total_cap} />
                </View>
            </View>
        </Fragment>
    );
};

export default SMADevice;

const styles = StyleSheet.create({
    tableHeaderContainer: {
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: Color.gray_2,
    },
    tableTextHeader: {
        color: Color.gray_11,
    },
    contentCell: {
        fontSize: 13 * unit,
        textAlign: "center",
        color: Color.gray_11,
    },
    block: {
        marginTop: 10,
        elevation: 0.5,
        backgroundColor: "white",
    },
    detailContainer: {
        padding: 16 * unit,
    },
    itemContainer: {
        flexDirection: "row",
        paddingVertical: 12 * unit,
        borderBottomColor: Color.gray_2,
        borderBottomWidth: 1,
    },
    itemDesContainer: {
        flex: 1,
        alignItems: "flex-end",
        paddingLeft: 24 * unit,
    },
});
