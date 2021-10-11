import { Color } from "@theme/colors";
import * as React from "react";
import { Image } from "react-native";
import Svg, { Path } from "react-native-svg";

function HomeIcon({ active = false, color = Color.gray_8, colorActive, size }) {
    if (active)
        return (
            // <Svg width={size} height={size} fill={colorActive} viewBox="0 0 512 512" style={{ backgroundColor: "white" }}>
            //     <Path d="M256 152.96L79.894 288.469v181.549h141.507V336.973h75.175v133.045h135.531V288.469z" />
            //     <Path d="M439.482 183.132V90.307h-74.166v35.77L256 41.982 0 238.919l35.339 45.936L256 115.062l220.662 169.794L512 238.92z" />
            // </Svg>
            <Image source={require("@assets/icons/home-color.png")} style={{ width: size - 1, height: size - 1 }} />
        );
    else return <Image source={require("@assets/icons/home-outline.png")} style={{ width: size - 1, height: size - 1 }} />;

    return (
        <Svg fill={color} width={size} height={size} viewBox="0 0 512 512">
            <Path d="M439.481 183.132V75.29h-89.184v39.234l-94.298-72.542L0 238.919l53.634 69.718 26.261-20.202v181.583h151.519V336.973h55.151v133.045h145.543V288.435l26.261 20.202L512 238.92l-72.519-55.788zm-37.409 256.851h-85.473V306.938H201.378v133.045h-91.449V265.329L256 152.965l146.071 112.364v174.654zm50.803-173.465L256 115.064 59.125 266.518l-17.006-22.106L256 79.876l124.333 95.648v-70.199h29.114v92.596l60.433 46.491-17.005 22.106z" />
        </Svg>
    );
}

export default HomeIcon;
