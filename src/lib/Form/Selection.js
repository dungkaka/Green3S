import { AppText } from "@common-ui/AppText";
import Select from "@common-ui/Form/Select";
import { Color } from "@theme/colors";
import { unit } from "@theme/styleContants";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useOnlyDidUpdateEffect } from "@utils/hooks/useOnlyDidUpdateEffect";

function Selection({
    data,
    required = true,
    disabled = false,
    initialOption = undefined,
    initialOptionOnChangeData = undefined,
    emptyOption = "Chọn",
    title = "Selection",
    containerStyle = styles.displaySelectValueContainer,
    renderValueComponent,
    onChange = (select) => {},
    ...otherProps
}) {
    const selectRef = useRef();
    const [select, setSelect] = useState(initialOption);

    useOnlyDidUpdateEffect(() => {
        onChange(select);
    }, [select]);

    useOnlyDidUpdateEffect(() => {
        setSelect(initialOptionOnChangeData);
    }, [data]);

    return (
        <Fragment>
            <Pressable
                disabled={disabled}
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
                initialOption={initialOption}
                itemHeight={48}
                options={data}
                ref={selectRef}
                onOk={() => {
                    selectRef.current.close();
                    setSelect(selectRef.current.getSelection());
                }}
                title={title}
                {...otherProps}
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
