import { Color } from "@theme/colors";
import * as React from "react";
import { Image } from "react-native";

function Maintenance({ active = false, color = Color.gray_8, colorActive, size }) {
    if (active) return <Image source={require("@assets/icons/maintenance-color.png")} style={{ width: size, height: size }} />;
    else return <Image source={require("@assets/icons/maintenance-outline.png")} style={{ width: size, height: size }} />;
}

export default Maintenance;
