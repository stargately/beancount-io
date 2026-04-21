import { Dimensions, PixelRatio, Platform, StatusBar } from "react-native";

export const ScreenWidth = Dimensions.get("window").width;
export const ScreenHeight = Dimensions.get("window").height;
const androidStatusBarHeight = StatusBar.currentHeight
  ? StatusBar.currentHeight
  : 0;
const isIphoneX =
  Platform.OS === "ios" &&
  Number(`${ScreenHeight / ScreenWidth}`.substring(0, 4)) * 100 === 216;
const BAR_HEIGHT = isIphoneX ? 44 : 20;
const NAV_BAR_HEIGHT = isIphoneX ? 88 : 64;
const statusBarHeight =
  Platform.OS === "ios" ? BAR_HEIGHT : androidStatusBarHeight;
const navigationBarHeight =
  Platform.OS === "ios" ? NAV_BAR_HEIGHT : androidStatusBarHeight + 59;
const onePx = 1 / PixelRatio.get();
const contentPadding = 16;
export { statusBarHeight, navigationBarHeight, onePx, contentPadding };
