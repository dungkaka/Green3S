import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
const WIDTH = width;
const HEIGHT = height;

const [shortDimension, longDimension] = width < height ? [width, height] : [height, width];

//Guideline sizes are based on standard ~5.1" screen mobile device
const guidelineBaseWidth = 360;
const guidelineBaseHeight = 640;

const scale = (size) => (shortDimension / guidelineBaseWidth) * size;
const verticalScale = (size) => (longDimension / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export { scale, verticalScale, moderateScale, WIDTH, HEIGHT };
