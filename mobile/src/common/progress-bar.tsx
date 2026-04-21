import * as React from "react";
import { View, StyleSheet, Animated } from "react-native";
import { useThemeStyle } from "@/common/hooks/use-theme-style";
import { ColorTheme } from "@/types/theme-props";

type Props = {
  progress: number;
};

const getStyles = (theme: ColorTheme) => {
  return StyleSheet.create({
    container: {
      width: "100%",
      height: 3,
    },
    progressTrack: {
      width: "100%",
      height: "100%",
      backgroundColor: theme.black10,
    },
    progressBar: {
      height: "100%",
      backgroundColor: theme.primary,
    },
  });
};

export const ProgressBar = ({ progress }: Props) => {
  const animatedWidth = React.useRef(new Animated.Value(0)).current;
  const styles = useThemeStyle(getStyles);

  React.useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [progress, animatedWidth]);

  if (progress >= 1) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.progressTrack}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: animatedWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
};
