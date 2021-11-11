import * as React from "react";
import { Image } from "react-native";

function Performance({ size }) {
    return <Image source={require("@assets/icons/performance.png")} style={{ width: size, height: size }} />;
}

export default Performance;
