import { Color } from "@theme/colors";
import * as React from "react";
import { Image } from "react-native";

function Management({ active = false, color = Color.gray_8, colorActive, size }) {
    if (active) return <Image source={require("@assets/icons/management-color.png")} style={{ width: size, height: size }} />;
    else return <Image source={require("@assets/icons/management-outline.png")} style={{ width: size, height: size }} />;
}

export default Management;
