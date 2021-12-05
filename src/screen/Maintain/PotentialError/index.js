import { AppText } from "@common-ui/AppText";
import { rem, unit } from "@theme/styleContants";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Image, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { Color } from "@theme/colors";
import { time } from "@utils/helps/time";
import { JumpLogoPage } from "@common-ui/Loading/JumpLogo";
import Filter from "./Filter";
import { useFetchPotentialError } from "@services/error";
import TableStickBasicTemplate from "@common-ui/Table/TableStickBasicTemplate";
import { useNavigation } from "@react-navigation/native";
import { NAVIGATION } from "constant/navigation";
import ModalImageViewer from "@common-ui/Image/ModalImageViewer";
import { Entypo } from "@expo/vector-icons";
import { WIDTH } from "@theme/scale";

const initEndDate = time().toDateObject();

const renderStatus = (code) => {
    switch (code) {
        case 0:
            return <AppText style={[styles.contentCellTag, { backgroundColor: Color.redPastelDark }]}>Chưa sửa</AppText>;
        case 1:
            return <AppText style={[styles.contentCellTag, { backgroundColor: Color.greenBlueDark }]}>Đã sửa</AppText>;
        case -1:
            return <AppText style={[styles.contentCellTag, { backgroundColor: Color.gray_10 }]}>Toàn bộ trạng thái</AppText>;
        default:
            return null;
    }
};

const PotentialError = () => {
    const navigation = useNavigation();
    const [filter, setFilter] = useState({
        month: initEndDate.month,
        year: initEndDate.year,
        stationCode: "-1",
        name: "",
    });
    const imageLogViewerRef = useRef();
    const { rData, rIsValidating, mutate } = useFetchPotentialError({ ...filter });
    const datas = rData?.datas || [];

    const handleFilter = (filter) => {
        setFilter({
            month: filter.month,
            year: filter.year,
            stationCode: filter.plant.stationCode,
            name: "",
        });
    };

    const options = useMemo(
        () => [
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
                key: "created_at",
                title: "Ngày tạo",
                width: 4 * rem,
                render: ({ item, index, cellStyle }) => (
                    <View key={1} style={cellStyle}>
                        <AppText style={styles.contentCell}>{item.created_at.slice(0, 10)}</AppText>
                    </View>
                ),
            },
            {
                key: "name",
                title: "Tên lỗi",
                width: 7 * rem,
            },
            {
                key: "stationName",
                title: "Nhà máy",
                width: 8 * rem,
                render: ({ item, index, cellStyle }) => (
                    <TouchableOpacity
                        key={3}
                        onPress={() =>
                            item.factory &&
                            navigation.navigate(NAVIGATION.DETAIL_PLANT, {
                                ...item.factory,
                            })
                        }
                        activeOpacity={0.8}
                        style={cellStyle}
                    >
                        <AppText style={styles.contentCellPress}>{item.factory?.stationName}</AppText>
                    </TouchableOpacity>
                ),
            },
            {
                key: "content",
                title: "Nội dung sửa",
                width: 10 * rem,
            },
            {
                key: "image",
                title: "Ảnh",
                width: 8 * rem,
                render: ({ item, index, cellStyle }) => {
                    if (!item.image) return <View key={5} style={cellStyle} />;
                    const imageUrl = JSON.parse(item.image)[0];
                    return (
                        <Pressable
                            key={5}
                            onPress={() =>
                                imageLogViewerRef.current.open([
                                    {
                                        url: `https://green3s.vn/uploads/errors/${item.stationCode}/${imageUrl}`,
                                    },
                                ])
                            }
                            style={cellStyle}
                        >
                            <Image
                                source={{
                                    uri: `https://green3s.vn/uploads/errors/${item.stationCode}/${imageUrl}`,
                                    width: "100%",
                                    height: "100%",
                                }}
                                resizeMode="contain"
                            />
                        </Pressable>
                    );
                },
            },

            {
                key: "device",
                title: "Thiết bị",
                width: 12 * rem,
                render: ({ item, index, cellStyle }) => (
                    <TouchableOpacity
                        key={6}
                        onPress={() =>
                            item.factory &&
                            navigation.navigate(NAVIGATION.DETAIL_DEVICE, {
                                device: item.device,
                            })
                        }
                        activeOpacity={0.8}
                        style={cellStyle}
                    >
                        <AppText style={styles.contentCellPress}>{item.device?.devName}</AppText>
                    </TouchableOpacity>
                ),
            },
            {
                key: "string",
                title: "MTTP/String",
                width: 8 * rem,
            },
            {
                key: "reason",
                title: "Nguyên nhân",
                width: 20 * rem,
                render: ({ item, index, cellStyle }) => (
                    <View key={8} style={cellStyle}>
                        <AppText numberOfLines={8} style={styles.contentCell}>
                            {item.reason?.replace(/\n/g, "")}
                        </AppText>
                    </View>
                ),
            },
            {
                key: "idea",
                title: "Đề xuất",
                width: 10 * rem,
            },
            {
                key: "date_repair",
                title: "Ngày sửa",
                width: 7 * rem,
                render: ({ item, index, cellStyle }) => (
                    <View key={10} style={cellStyle}>
                        <AppText style={styles.contentCell}>{item.date_repair?.slice(0, 10)}</AppText>
                    </View>
                ),
            },
            {
                key: "status_name",
                title: "Trạng thái",
                width: 8 * rem,
            },
            {
                key: "status_accept",
                title: "Tình trạng",
                width: 7 * rem,
                render: ({ item, index, cellStyle }) => (
                    <View key={12} style={cellStyle}>
                        {renderStatus(item.status_accept)}
                    </View>
                ),
            },
        ],
        [rData]
    );

    // useEffect(() => {
    //     navigation.setOptions({
    //         headerTitleContainerStyle: {
    //             maxWidth: WIDTH - 150,
    //         },
    //         headerRight: () => {
    //             return (
    //                 <View
    //                     style={{
    //                         flexDirection: "row",
    //                         justifyContent: "center",
    //                         alignItems: "center",
    //                         marginRight: 16 * unit,
    //                     }}
    //                 >
    //                     <Pressable
    //                         style={{ paddingLeft: 12 * unit }}
    //                         onPress={() => {
    //                             navigation.push(NAVIGATION.ERROR_POTENTIEL_CREATION, {});
    //                         }}
    //                     >
    //                         <Entypo name="plus" size={24} color="white" />
    //                     </Pressable>
    //                 </View>
    //             );
    //         },
    //     });
    // }, []);

    return (
        <View style={styles.container}>
            <Filter filter={filter} handleFilter={handleFilter} />

            {rIsValidating ? (
                <View style={{ flex: 1, backgroundColor: "white" }}>
                    <JumpLogoPage />
                </View>
            ) : rData ? (
                <TableStickBasicTemplate
                    heightRow={154}
                    left={[0, 1]}
                    stickPosition={3 * rem}
                    options={options}
                    data={datas}
                    headerContainerStyle={styles.tableHeaderContainer}
                    textHeaderStyle={styles.tableTextHeader}
                    numberLinesContentCell={8}
                />
            ) : null}
            <ModalImageViewer ref={imageLogViewerRef} />
        </View>
    );
};

export default PotentialError;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    contentCell: {
        fontSize: 13 * unit,
        textAlign: "center",
        color: Color.gray_11,
    },
    contentCellPress: {
        fontSize: 13 * unit,
        textAlign: "center",
        color: Color.blueDark,
    },
    contentCellTag: {
        fontSize: 13 * unit,
        textAlign: "center",
        color: "white",
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    loading: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 2 * rem,
    },
    tableHeaderContainer: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: Color.gray_2,
    },

    tableTextHeader: {
        color: Color.gray_11,
    },
});
