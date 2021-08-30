import { moderateScale } from "./scale";

const fontScale = (size) => moderateScale(size, 0.2);
const spaceScale = (size) => moderateScale(size, 0.2);

export const fontUnit = fontScale(1);

export const spaceUnit = spaceScale(1);

export const unit = fontUnit;
export const rem = 14 * fontUnit;
