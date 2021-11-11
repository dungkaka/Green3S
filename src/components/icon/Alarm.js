import { Color } from "@theme/colors";
import * as React from "react";
import { Image } from "react-native";

function Alarm({ active = false, color = Color.gray_8, colorActive, size }) {
    if (active) return <Image source={require("@assets/icons/alarm-color.png")} style={{ width: size, height: size }} />;
    else return <Image source={require("@assets/icons/alarm-outline.png")} style={{ width: size, height: size }} />;
}

export default Alarm;
