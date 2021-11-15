import ImagePicker from "@common-ui/Image/ImagePicker";
import React from "react";
import { View, Text } from "react-native";

const DeviceHistory = () => {
    return (
        <View style={{flex: 1}}>
            <ImagePicker />
        </View>
    );
};

export default React.memo(DeviceHistory, () => true);
