import { AppText } from "@common-ui/AppText";
import { rem, unit } from "@theme/styleContants";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Image, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { Color } from "@theme/colors";
import { format, time } from "@utils/helps/time";
import { arrayClean, round2 } from "@utils/helps/functions";
import { JumpLogoPage, JumpLogoPageOverlay } from "@common-ui/Loading/JumpLogo";
import Filter from "./Filter";
import { useCommonErrorControl, useFetchPerformance } from "@services/error";
import TableStickBasicTemplate from "@common-ui/Table/TableStickBasicTemplate";
import { useNavigation } from "@react-navigation/native";
import { NAVIGATION } from "constant/navigation";
import ModalImageViewer from "@common-ui/Image/ModalImageViewer";
import { useMarkControl } from "../Common/useMarkControl";
import { useActionHeader } from "../Common/useActionHeader";
import CheckBox from "@common-ui/Form/CheckBox";
import DeleteButton from "@common-components/TableUtil/DeleteButton";
import EditButton from "@common-components/TableUtil/EditButton";
import ModalHintRS from "../Common/ModalHintRS";
import { useUser } from "@services/user";

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

const Performance = () => {
    const imageRef = useRef();
    const navigation = useNavigation();
    const { isEmployee } = useUser();
    const [filter, setFilter] = useState({
        endDate: initEndDate,
        startDate: initStartDate,
        stationCode: "",
        status: -1,
        page: 1,
    });
    const { rData, rIsValidating, key, mutate } = useFetchPerformance({ ...filter });
    const datas = rData?.datas || [];

    const { deleteErrors } = useCommonErrorControl({ key, regExpKey: "/error/performance" });
    const { marks, setMarks, arrayMarks, isAllMark } = useMarkControl({ datas });
    const modalHintRSRef = useRef();
    useActionHeader({ key, arrayMarks, deleteErrors });

    const options = useMemo(
        () =>
            arrayClean([
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
                isEmployee
                    ? {
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
                      }
                    : undefined,
                isEmployee
                    ? {
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
                      }
                    : undefined,
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
                    key: "string",
                    title: "String",
                    width: 6 * rem,
                    render: ({ item, index, cellStyle }) => (
                        <Pressable
                            onPress={() => {
                                item.images &&
                                    imageRef.current.open(
                                        item.images.map((image) => ({
                                            url: image,
                                        }))
                                    );
                            }}
                            style={cellStyle}
                        >
                            <AppText style={styles.contentCellString}>{item.string}</AppText>
                        </Pressable>
                    ),
                },
                {
                    key: "reason",
                    title: "Nguyên nhân",
                    width: 16 * rem,
                },
                {
                    key: "solution",
                    title: "Giải pháp",
                    width: 16 * rem,
                },
                {
                    key: "image",
                    title: "Ảnh",
                    width: 8 * rem,
                    render: ({ item, index, cellStyle }) => {
                        if (!item.image_repairs || item.image_repairs.length == 0) return <View style={cellStyle} />;
                        return (
                            <Pressable
                                onPress={() =>
                                    imageRef.current.open(
                                        item.image_repairs.map((url) => ({
                                            url: url,
                                        }))
                                    )
                                }
                                style={cellStyle}
                            >
                                <Image
                                    source={{
                                        uri: item.image_repairs[0],
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
                {
                    key: "created_at",
                    title: "Thời gian xuất hiện",
                    width: 7 * rem,
                    render: ({ item, index, cellStyle }) => (
                        <View style={cellStyle}>
                            <AppText style={styles.contentCell}>{format(item.created_at, "YYYY-MM-DD H:M:S")}</AppText>
                        </View>
                    ),
                },
                { key: "time_end", title: "Thời gian kết thúc", width: 7 * rem },
            ]),
        [rData, marks]
    );

    const handleFilter = (filter) => {
        setFilter({
            endDate: filter.endDate,
            startDate: filter.startDate,
            stationCode: filter.plant.stationCode,
            status: filter.status.key,
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
            <ModalImageViewer ref={imageRef} />
            <ModalHintRS modalRef={modalHintRSRef} type="performance_low" />
        </View>
    );
};

export default Performance;

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

    contentCellString: {
        fontSize: 13 * unit,
        textAlign: "center",
        color: "white",
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
        backgroundColor: Color.redPastelDark,
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
