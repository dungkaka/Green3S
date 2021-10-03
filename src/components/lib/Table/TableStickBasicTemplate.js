import { AppText, AppTextMedium } from "@common-ui/AppText";
import TableStickColumn from "@common-ui/Table/TableStickColumn";
import { Color } from "@theme/colors";
import { rem } from "@theme/styleContants";
import React, { useEffect, useState, useMemo } from "react";
import { render } from "react-dom";
import { StyleSheet, Text, View } from "react-native";

const _data = new Array(20).fill({
    column1: 1,
    column2: "A Column",
    column3: "Something",
    column4: "Test",
    column5: "Last",
});

const _options = [
    { key: "column1", title: "Col 1", width: 5 * rem },
    { key: "column2", title: "Col 2", width: 8 * rem },
    { key: "column3", title: "Col 3", width: 10 * rem },
    { key: "column4", title: "Col 4", width: 8 * rem },
    { key: "column5", title: "Col 5", width: 10 * rem },
];

const _left = [0, 1];

const TableStickBasicTemplate = ({
    data = _data,
    options = _options,
    left = _left,
    heightHeader = 64,
    heightRow = 56,
    stickPosition = 5 * rem,
    cellStyle,
    cellHeaderStyle = { borderRightWidth: 0 },
    rowStyle = styles.row,
    containerStyle,
    leftContainerStyle = styles.sideContainer,
    rightContainerStyle = styles.sideContainer,
    headerContainer = styles.headerContainer,
    textHeaderStyle,
}) => {
    const right = options.map((_, i) => i).filter((_, i) => !left.includes(i));

    const tableStyles = StyleSheet.create(
        options.map((option, index) => ({
            ...styles.cell,
            ...cellStyle,
            width: option.width,
        }))
    );

    const leftHeader = (
        <View style={headerContainer}>
            {left.map((i) => {
                if (options[i].renderHeader) {
                    return <View style={{ width: options[i].width }}>{options[i].renderHeader()}</View>;
                }
                return (
                    <View key={i} style={[tableStyles[i], cellHeaderStyle]}>
                        <AppTextMedium style={[styles.textHeader, textHeaderStyle]}>{options[i].title}</AppTextMedium>
                    </View>
                );
            })}
        </View>
    );

    const rightHeader = (
        <View style={headerContainer}>
            {right.map((i) => {
                if (options[i].renderHeader) {
                    return <View style={{ width: options[i].width }}>{options[i].renderHeader()}</View>;
                }
                return (
                    <View key={i} style={[tableStyles[i], cellHeaderStyle]}>
                        <AppTextMedium style={[styles.textHeader, textHeaderStyle]}>{options[i].title}</AppTextMedium>
                    </View>
                );
            })}
        </View>
    );

    const LeftRow = ({ item, index }) => {
        return (
            <View style={rowStyle}>
                {left.map((i) => {
                    if (options[i].render) return options[i].render({ item, index });
                    return (
                        <View key={i} style={tableStyles[i]}>
                            <AppText style={styles.textCenter}>{item[options[i].key]}</AppText>
                        </View>
                    );
                })}
            </View>
        );
    };

    const RightRow = ({ item, index }) => (
        <View style={rowStyle}>
            {right.map((i) => {
                if (options[i].render) return options[i].render({ item, index });
                return (
                    <View key={i} style={tableStyles[i]}>
                        <AppText style={styles.textCenter}>{item[options[i].key]}</AppText>
                    </View>
                );
            })}
        </View>
    );

    return (
        <TableStickColumn
            data={data}
            leftHeader={leftHeader}
            rightHeader={rightHeader}
            RightRow={RightRow}
            LeftRow={LeftRow}
            heightHeader={heightHeader}
            heightRow={heightRow}
            stickPosition={stickPosition}
            leftWidth={left.reduce((sum, i) => sum + options[i].width, 0)}
            leftContainerStyle={leftContainerStyle}
            rightContainerStyle={rightContainerStyle}
            containerStyle={containerStyle}
        />
    );
};

export default React.memo(TableStickBasicTemplate, () => true);

const styles = StyleSheet.create({
    padding: {
        padding: 12,
    },
    headerContainer: { flex: 1, flexDirection: "row", backgroundColor: Color.blueModern_2 },
    textHeader: {
        textAlign: "center",
        color: "white",
    },
    textCenter: {
        textAlign: "center",
        color: Color.gray_11,
    },
    cellHeader: {
        padding: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    cell: {
        padding: 8,
        justifyContent: "center",
        alignItems: "center",
        borderRightWidth: 1,
        borderRightColor: Color.gray_2,
        overflow: "hidden",
    },
    row: {
        flex: 1,
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: Color.gray_2,
        overflow: "hidden",
    },
    sideContainer: {
        backgroundColor: "white",
    },
});
