import { Color } from "@theme/colors";
import * as React from "react";
import { Image } from "react-native";

function User({ active = false, color = Color.gray_8, colorActive, size }) {
    if (active) return <Image source={require("@assets/icons/user-color.png")} style={{ width: size, height: size }} />;
    else return <Image source={require("@assets/icons/user-outline.png")} style={{ width: size, height: size }} />;
}

export default User;
