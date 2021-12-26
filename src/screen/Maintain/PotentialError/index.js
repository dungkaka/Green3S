import { AppText } from "@common-ui/AppText";
import { rem, unit } from "@theme/styleContants";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Image, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { Color } from "@theme/colors";
import { time } from "@utils/helps/time";
import { JumpLogoPage, JumpLogoPageOverlay } from "@common-ui/Loading/JumpLogo";
import Filter from "./Filter";
import { useCommonErrorControl, useFetchPotentialError } from "@services/error";
import TableStickBasicTemplate from "@common-ui/Table/TableStickBasicTemplate";
import { useNavigation } from "@react-navigation/native";
import { NAVIGATION } from "constant/navigation";
import ModalImageViewer from "@common-ui/Image/ModalImageViewer";
import { Entypo } from "@expo/vector-icons";
import { WIDTH } from "@theme/scale";
import { useMarkControl } from "../Common/useMarkControl";
import { useActionErrorPotentialHeader } from "../Common/useActionHeader";
import ModalHintRS from "../Common/ModalHintRS";
import CheckBox from "@common-ui/Form/CheckBox";
import DeleteButton from "@common-components/TableUtil/DeleteButton";
import EditButton from "@common-components/TableUtil/EditButton";
import { CRUD } from "constant/crud";
import { useUser } from "@services/user";
import { arrayClean } from "@utils/helps/functions";

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
    const { isEmployee } = useUser();
    const [filter, setFilter] = useState({
        month: initEndDate.month,
        year: initEndDate.year,
        stationCode: "-1",
        name: "",
    });
    const imageLogViewerRef = useRef();
    const { rData, rIsValidating, key, mutate } = useFetchPotentialError({ ...filter });
    const datas = rData?.datas || [];

    const { deletePotentialErrors: deleteErrors } = useCommonErrorControl({ key, regExpKey: "/error/potential" });
    const { marks, setMarks, arrayMarks, isAllMark } = useMarkControl({ datas });
    const modalHintRSRef = useRef();

    useActionErrorPotentialHeader({ key, arrayMarks, deleteErrors });

    const handleFilter = (filter) => {
        setFilter({
            month: filter.month,
            year: filter.year,
            stationCode: filter.plant.stationCode,
            name: "",
        });
    };

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
                    key: "created_at",
                    title: "Ngày tạo",
                    width: 4 * rem,
                    render: ({ item, index, cellStyle }) => (
                        <View style={cellStyle}>
                            <AppText style={styles.contentCell}>{item.created_at.slice(0, 10)}</AppText>
                        </View>
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
                                          <DeleteButton onPress={() => deleteErrors([item.id.toString()])} />
                                      </View>
                                      <View style={{ padding: 6 * unit }}>
                                          <EditButton
                                              onPress={() => {
                                                  navigation.push(NAVIGATION.ERROR_POTENTIEL_CREATION, {
                                                      type: CRUD.UPDATE,
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
                    key: "device",
                    title: "Thiết bị",
                    width: 5 * rem,
                    render: ({ item, index, cellStyle }) => (
                        <TouchableOpacity
                            onPress={() =>
                                item.factory &&
                                navigation.navigate(NAVIGATION.DETAIL_DEVICE, {
                                    device: item.device,
                                    initTime: item.created_at,
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
                    key: "content",
                    title: "Nội dung sửa",
                    width: 10 * rem,
                },
                {
                    key: "image",
                    title: "Ảnh",
                    width: 8 * rem,
                    render: ({ item, index, cellStyle }) => {
                        if (!item.image) return <View style={cellStyle} />;
                        const imagesUrl = JSON.parse(item.image);
                        return (
                            <Pressable
                                onPress={() =>
                                    imageLogViewerRef.current.open(
                                        imagesUrl.map((url) => ({
                                            url: `https://green3s.vn/uploads/errors/${item.stationCode}/${url}`,
                                        }))
                                    )
                                }
                                style={cellStyle}
                            >
                                <Image
                                    source={{
                                        uri: `https://green3s.vn/uploads/errors/${item.stationCode}/${imagesUrl[0]}`,
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
                        <View style={cellStyle}>
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
                        <View style={cellStyle}>
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
                    render: ({ item, index, cellStyle }) => <View style={cellStyle}>{renderStatus(item.status_accept)}</View>,
                },
            ]),
        [rData, marks]
    );

    return (
        <View style={styles.container}>
            <Filter filter={filter} handleFilter={handleFilter} />

            {rIsValidating && <JumpLogoPageOverlay />}

            <TableStickBasicTemplate
                keyItem="id"
                marks={marks}
                heightRow={154}
                left={[0, 1]}
                stickPosition={3 * rem}
                options={options}
                data={datas}
                headerContainerStyle={styles.tableHeaderContainer}
                textHeaderStyle={styles.tableTextHeader}
                numberLinesContentCell={8}
            />
            <ModalImageViewer ref={imageLogViewerRef} />
            <ModalHintRS modalRef={modalHintRSRef} />
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
