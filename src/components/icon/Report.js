import * as React from "react";
import { Image } from "react-native";

function Report({ size }) {
    return <Image source={require("@assets/icons/report-color.png")} style={{ width: size, height: size }} />;
}

export default Report;
