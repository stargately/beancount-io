import { useMemo, useRef } from "react";
import { useTheme } from "@/common/theme";
import { StyleSheet } from "react-native";
import { ColorTheme } from "@/types/theme-props";

export const useThemeStyle = <T extends StyleSheet.NamedStyles<T>>(
  createStyleFactory: (colorTheme: ColorTheme) => T,
) => {
  const createFactory = useRef(createStyleFactory);
  const colorTheme = useTheme().colorTheme;
  return useMemo(
    () => createFactory.current(colorTheme),
    [colorTheme, createFactory],
  );
};
