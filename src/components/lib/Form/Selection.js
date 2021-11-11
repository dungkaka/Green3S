import { AppText } from "@common-ui/AppText";
import Select from "@common-ui/Form/Select";
import { Color } from "@theme/colors";
import { unit } from "@theme/styleContants";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

function Selection({
    data,
    required = true,
    emptyOption = "Chọn",
    title = "Selection",
    containerStyle = styles.displaySelectValueContainer,
    renderValueComponent,
    onChange = (select) => {},
}) {
    const selectRef = useRef();
    const [select, setSelect] = useState();

    useEffect(() => {
        onChange(select);
    }, [select]);

    useEffect(() => {
        setSelect(undefined);
    }, [data]);

    return (
        <Fragment>
            <Pressable
                onPress={() => {
                    selectRef.current.open(select?.key);
                }}
                style={containerStyle}
            >
                {renderValueComponent ? (
                    renderValueComponent(select)
                ) : (
                    <AppText style={styles.textSelectDisplay}>{select ? select.value : emptyOption}</AppText>
                )}
            </Pressable>

            <Select
                required={required}
                itemHeight={48}
                options={data}
                ref={selectRef}
                onOk={() => {
                    selectRef.current.close();
                    setSelect(selectRef.current.getSelection());
                }}
                title={title}
            />
        </Fragment>
    );
}

export default Selection;

const styles = StyleSheet.create({
    displaySelectValueContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 6 * unit,
        paddingHorizontal: 12 * unit,
        backgroundColor: Color.gray_0,
        borderRadius: 6 * unit,
        borderWidth: 1,
        borderColor: Color.gray_3,
    },
    textSelectDisplay: {
        fontSize: 15 * unit,
        color: Color.gray_8,
        paddingHorizontal: 6 * unit,
    },
});
