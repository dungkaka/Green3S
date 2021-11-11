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
        render: ({ item, index, defaultBlockStyle }) => (
            <View key={0} style={defaultBlockStyle}>
                <AppText style={styles.contentCell}>{index + 1}</AppText>
            </View>
        ),
    },
    {
        key: "name",
        title: "Chuỗi",
        width: 6 * rem,
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
        render: ({ item, index, defaultBlockStyle }) => {
            if (item.numPV % 2 == 0)
                return (
                    <View key={4} style={defaultBlockStyle}>
                        <AppText style={[styles.contentCell, { top: -28 }]}>{item.mttp}</AppText>
                    </View>
                );

            return <View key={4} style={[defaultBlockStyle, { borderBottomWidth: 0 }]} />;
        },
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
        render: ({ item, index, defaultBlockStyle }) => (
            <View key={6} style={defaultBlockStyle}>
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

const HUAWEIDevice = ({ data }) => {
    const datas = data?.dataDevices || [];
    const {
        a_u,
        b_u,
        c_u,
        a_i,
        b_i,
        c_i,
        elec_freq,
        power_factor,
        total_cap,
        close_time,
        open_time,
        day_cap,
        active_power,
        reactive_power,
    } = data?.data_device || {};

    const { devName, devTypeId, factory, esnCode, invType, softwareVersion } = data?.device;

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
                    <DetailItem title="Trạng thái bộ biến tần" value="On-grid" />
                    <DetailItem title="Công suất thực" value={active_power} />
                    <DetailItem title="Hệ số công suất" value={power_factor} />
                    <DetailItem title="Thời gian tắt bộ biến tần" value={close_time} />
                    <DetailItem title="Dòng điện pha B" value={b_i} />
                    <DetailItem title="Điện áp pha B" value={b_u} />
                    <DetailItem title="Sản lượng hôm nay" value={day_cap} />
                    <DetailItem title="Công suất vô công" value={reactive_power} />
                    <DetailItem title="Tần số lưới điện" value={elec_freq} />
                    <DetailItem title="Chế độ đầu ra" value="" />
                    <DetailItem title="Dòng điện pha C" value={c_i} />
                    <DetailItem title="Điện áp pha C" value={c_u} />
                    <DetailItem title="Tổng sản lượng" value={total_cap} />
                    <DetailItem title="Công suất định mức của bộ biến tần (kW)" value={data?.device.inverter_power} />
                    <DetailItem title="Thời gian khởi động bộ biến tiền" value={open_time} />
                    <DetailItem title="Dòng điện pha A" value={a_i} />
                    <DetailItem title="Điện áp pha A" value={a_u} />
                </View>
            </View>
            <View style={styles.block}>
                <View style={styles.detailContainer}>
                    <AppTextMedium style={{ fontSize: 15 * unit }}>Thông tin cơ bản</AppTextMedium>
                    <DetailItem title="Tên thiết bị" value={devName} />
                    <DetailItem title="Loại thiết bị" value={data.type_devices?.[devTypeId]} />
                    <DetailItem title="Tên nhà máy" value={factory?.stationName} />
                    <DetailItem title="Số seri" value={esnCode} />
                    <DetailItem title="Địa chỉ nhà máy" value={factory?.stationAddr} />
                    <DetailItem title="Model" value={invType} />
                    <DetailItem title="Phiên bản phần mềm" value={softwareVersion} />
                </View>
            </View>
        </Fragment>
    );
};

export default HUAWEIDevice;

const styles = StyleSheet.create({
    tableHeaderContainer: {
        flex: 1,
        flexDirection: "row",
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
