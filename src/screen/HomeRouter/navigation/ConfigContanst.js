import UserIcon from "@components/icon/UserIcon";
import { Color } from "@theme/colors";
import { WIDTH } from "@theme/scale";
import { rem, unit } from "@theme/styleContants";
import { NAVIGATION } from "constant/navigation";
import { PixelRatio } from "react-native";
import HomeIcon from "@components/icon/HomeIcon";
import Maintenance from "@components/icon/Maintenance";
import User from "@components/icon/User";
import Management from "@components/icon/Management";

const numberOfIcons = 4;

export const DURATION = 500;

export const SEGMENT = PixelRatio.roundToNearestPixel(WIDTH / numberOfIcons);
export const ICON_SIZE = SEGMENT > 4 * rem ? 22 * unit : 18 * unit;

export const horizontalPadding = SEGMENT - ICON_SIZE;
export const PADDING = 5 * unit;

export const HEIGHT = ICON_SIZE + PADDING * 2;

export const Colors = {
    primary: Color.greenBlueDark,
    border: Color.gray_8,
};

export const bottomTabs = {
    [NAVIGATION.TAB_HOME]: {
        label: "Trang chủ",
        Icon: HomeIcon,
        size: ICON_SIZE,
        colorActive: Colors.primary,
    },
    [NAVIGATION.TAB_USER]: {
        label: "Cá nhân",
        Icon: User,
        size: ICON_SIZE,
        colorActive: Colors.primary,
    },
    [NAVIGATION.TAB_MANAGEMENT]: {
        label: "Quản lý",
        Icon: Management,
        size: ICON_SIZE,
        colorActive: Colors.primary,
    },
    [NAVIGATION.TAB_MAINTAIN]: {
        label: "Bảo trì",
        Icon: Maintenance,
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
