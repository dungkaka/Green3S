import { Color } from "@theme/colors";
import * as React from "react";
import Svg, { Circle, G, Path } from "react-native-svg";

export default ({ active, color = Color.gray_8, colorActive, size }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 18 20">
            <G
                transform="translate(1 1)"
                stroke={active ? colorActive : color}
                fill={active ? colorActive : "none"}
                strokeWidth={1.5}
                fillRule="evenodd"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <Path d="M16 18v-2a4 4 0 00-4-4H4a4 4 0 00-4 4v2" />
                <Circle cx={8} cy={4} r={4} />
            </G>
        </Svg>
    );
};
