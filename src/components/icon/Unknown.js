import * as React from "react";
import { Image } from "react-native";

function Unknown({ size }) {
    return <Image source={require("@assets/icons/unknown.png")} style={{ width: size, height: size }} />;
}

export default Unknown;
