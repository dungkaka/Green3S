import UserIcon from "@components/icon/UserIcon";
import { Color } from "@theme/colors";
import { WIDTH } from "@theme/scale";
import { rem, unit } from "@theme/styleContants";
import { NAVIGATION } from "constant/navigation";
import { PixelRatio } from "react-native";
import React from "react";
import HomeIcon from "@components/icon/HomeIcon";

const numberOfIcons = 4;

export const DURATION = 500;

export const SEGMENT = PixelRatio.roundToNearestPixel(WIDTH / numberOfIcons);
export const ICON_SIZE = SEGMENT > 4 * rem ? 23 * unit : 18 * unit;

export const horizontalPadding = SEGMENT - ICON_SIZE;
export const PADDING = 4 * unit;

export const HEIGHT = ICON_SIZE + PADDING * 2;

export const Colors = {
    primary: Color.blueModern_1,
    border: Color.gray_10,
};

export const bottomTabs = {
    [NAVIGATION.TAB_HOME]: {
        label: "Trang chủ",
        Icon: HomeIcon,
        size: ICON_SIZE + 4,
        colorActive: Colors.primary,
    },
    [NAVIGATION.TAB_USER]: {
        label: "Cá nhân",
        Icon: UserIcon,
        size: ICON_SIZE,
        colorActive: Colors.primary,
    },
    [NAVIGATION.TAB_FEEDS]: {
        label: "Khám phá",
        Icon: UserIcon,
        size: ICON_SIZE,
        colorActive: Colors.primary,
    },
    default: {
        label: "Trang chủ",
        Icon: UserIcon,
        size: ICON_SIZE,
        colorActive: Colors.primary,
    },
};
