import { AppText } from "@common-ui/AppText";
import { rem, unit } from "@theme/styleContants";
import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { Color } from "@theme/colors";
import { time } from "@utils/helps/time";
import { JumpLogoPageOverlay } from "@common-ui/Loading/JumpLogo";
import Filter from "./Filter";
import { ErrorACService, useCommonErrorControl, useFetchErrorAC } from "@services/error";
import TableStickBasicTemplate from "@common-ui/Table/TableStickBasicTemplate";
import { useNavigation } from "@react-navigation/native";
import { NAVIGATION } from "constant/navigation";
import AddButon from "@common-components/TableUtil/AddButon";
import CheckBox from "@common-ui/Form/CheckBox";
import DeleteButton from "@common-components/TableUtil/DeleteButton";
import EditButton from "@common-components/TableUtil/EditButton";
import ModalHintRS from "../Common/ModalHintRS";
import { useActionHeader } from "../Common/useActionHeader";
import { useMarkControl } from "../Common/useMarkControl";

const renderStatus = (code) => {
    switch (code) {
        case 0:
            return <AppText style={[styles.contentCellTag, { backgroundColor: Color.redPastelDark }]}>Chưa sửa</AppText>;
        case 1:
            return <AppText style={[styles.contentCellTag, { backgroundColor: Color.greenBlueDark }]}>Đã sửa</AppText>;
        case 2:
            return <AppText style={[styles.contentCellTag, { backgroundColor: Color.blueModern_1 }]}>Đang sửa</AppText>;
        case 3:
            return <AppText style={[styles.contentCellTag, { backgroundColor: Color.purpleDark }]}>Đợi vật tư</AppText>;
        case -1:
            return <AppText style={[styles.contentCellTag, { backgroundColor: Color.gray_10 }]}>Toàn bộ trạng thái</AppText>;
        default:
            return null;
    }
};

const initEndDate = time().toDateObject();
const initStartDate = { ...time().toDateObject(), day: 1 };

const ErrorAC = () => {
    const navigation = useNavigation();
    const [filter, setFilter] = useState({
        endDate: initEndDate,
        startDate: initStartDate,
        stationCode: "",
        status: -1,
        error: "",
        page: 1,
    });
    const { rData, rIsValidating, key, mutate } = useFetchErrorAC({ ...filter });
    const { deleteErrors } = useCommonErrorControl({ key, regExpKey: "/error/ac" });
    const datas = rData?.datas || [];
    const { marks, setMarks, arrayMarks, isAllMark } = useMarkControl({ datas });
    const modalHintRSRef = useRef();

    useActionHeader({ key, arrayMarks, deleteErrors });

    const options = useMemo(
        () => [
            {
                key: "order",
                title: "STT",
                width: 3 * rem,
                render: ({ item, index, cellStyle }) => (
                    <View style={cellStyle}>
                        <AppText style={styles.contentCell}>{index + 1}</AppText>
                    </View>
                ),
            },
            {
                key: "station",
                title: "Nhà máy",
                width: 6 * rem,
                render: ({ item, index, cellStyle }) => (
                    <TouchableOpacity
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
                key: "__select",
                title: "STT",
                width: 3 * rem,
                renderHeader: ({ cellHeaderStyle }) => {
                    return (
                        <View style={cellHeaderStyle}>
                            <CheckBox
                                value={isAllMark}
                                onChange={(value) => {
                                    if (value) {
                                        const newMarks = {};
                                        datas.forEach((error) => (newMarks[error.id] = true));
                                        setMarks(newMarks);
                                    } else {
                                        setMarks({});
                                    }
                                }}
                            />
                        </View>
                    );
                },
                render: ({ item, index, isMark, cellStyle }) => {
                    return (
                        <View style={cellStyle}>
                            <View style={{ padding: 4 * unit }}>
                                <CheckBox
                                    onChange={(value) => {
                                        setMarks((marks) => ({
                                            ...marks,
                                            [item.id]: value ? true : false,
                                        }));
                                    }}
                                    value={isMark}
                                />
                            </View>
                        </View>
                    );
                },
            },
            {
                key: "__control",
                title: "Thao tác",
                width: 5 * rem,
                render: ({ item, index, cellStyle }) => {
                    return (
                        <View style={cellStyle}>
                            <View style={{ padding: 6 * unit }}>
                                <DeleteButton onPress={() => deleteErrors([item.id])} />
                            </View>
                            <View style={{ padding: 6 * unit }}>
                                <EditButton
                                    onPress={() => {
                                        navigation.push(NAVIGATION.RS_UPDATION, {
                                            error: item,
                                            key: key,
                                        });
                                    }}
                                />
                            </View>
                        </View>
                    );
                },
            },
            {
                key: "device",
                title: "Thiết bị",
                width: 5 * rem,
                render: ({ item, index, cellStyle }) => (
                    <TouchableOpacity
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
                key: "error_name",
                title: "Tên lỗi",
                width: 7 * rem,
                render: ({ item, index, cellStyle }) => (
                    <TouchableOpacity onPress={() => modalHintRSRef.current.open()} activeOpacity={0.8} style={cellStyle}>
                        <AppText style={styles.contentCell}>{item.error_name}</AppText>
                    </TouchableOpacity>
                ),
            },
            {
                key: "reason",
                title: "Nguyên nhân",
                width: 16 * rem,
                render: ({ item, index, cellStyle }) => {
                    if (!item.reason)
                        return (
                            <View style={cellStyle}>
                                <AddButon
                                    onPress={() => {
                                        navigation.push(NAVIGATION.RS_UPDATION, {
                                            error: item,
                                            key: key,
                                        });
                                    }}
                                    size={18}
                                />
                            </View>
                        );
                    return (
                        <View style={cellStyle}>
                            <AppText numberOfLines={5} style={styles.contentCell}>
                                {item.reason}
                            </AppText>
                        </View>
                    );
                },
            },
            {
                key: "solution",
                title: "Giải pháp",
                width: 16 * rem,
                render: ({ item, index, cellStyle }) => {
                    if (!item.solution)
                        return (
                            <View style={cellStyle}>
                                <AddButon
                                    onPress={() => {
                                        navigation.push(NAVIGATION.RS_UPDATION, {
                                            error: item,
                                            key: key,
                                        });
                                    }}
                                    size={18}
                                />
                            </View>
                        );
                    return (
                        <View style={cellStyle}>
                            <AppText numberOfLines={5} style={styles.contentCell}>
                                {item.solution}
                            </AppText>
                        </View>
                    );
                },
            },
            {
                key: "status",
                title: "Trạng thái sửa",
                width: 7 * rem,
                render: ({ item, index, cellStyle }) => <View style={cellStyle}>{renderStatus(item.status)}</View>,
            },
            { key: "note", title: "Ghi chú", width: 8 * rem },
            {
                key: "time_repair",
                title: "Thời gian tác động",
                width: 7 * rem,
                render: ({ item, index, cellStyle }) => (
                    <View style={cellStyle}>
                        <AppText style={styles.contentCell}>{JSON.parse(item.time_repair)?.repaired}</AppText>
                    </View>
                ),
            },
            { key: "created_at", title: "Thời gian xuất hiện", width: 7 * rem },
            { key: "time_end", title: "Thời gian kết thúc", width: 7 * rem },
        ],
        [rData, marks]
    );

    const handleFilter = (filter) => {
        setFilter({
            endDate: filter.endDate,
            startDate: filter.startDate,
            stationCode: filter.plant.stationCode,
            status: filter.status.key,
            error: filter.error.key,
            page: 1,
        });
    };

    const onChangePage = useCallback((page) => {
        setFilter({ ...filter, page: page });
    }, []);

    return (
        <View style={styles.container}>
            <Filter filter={filter} handleFilter={handleFilter} />

            {rIsValidating && <JumpLogoPageOverlay />}

            <TableStickBasicTemplate
                keyItem="id"
                marks={marks}
                heightRow={100}
                left={[0, 1]}
                stickPosition={3 * rem}
                options={options}
                data={datas}
                headerContainerStyle={styles.tableHeaderContainer}
                textHeaderStyle={styles.tableTextHeader}
                numberLinesContentCell={5}
                showPagination={true}
                paginationInfo={{
                    total: rData?.total_page * 20 || 0,
                    page: filter.page,
                    pageSize: 20,
                    currentPageSize: datas.length,
                    onChangePage: onChangePage,
                }}
            />
            <ModalHintRS modalRef={modalHintRSRef} />
        </View>
    );
};

export default ErrorAC;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    contentCell: {
        fontSize: 13 * unit,
        textAlign: "center",
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
