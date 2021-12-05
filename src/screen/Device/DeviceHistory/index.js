import ImagePickerExample from "@common-ui/Image/ImagePickerOne";
import React from "react";
import { View, Text } from "react-native";

const DeviceHistory = () => {
    return (
        <View style={{ flex: 1 }}>
            <ImagePickerExample />
        </View>
    );
};

export default React.memo(DeviceHistory, () => true);
