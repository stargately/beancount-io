import React, { useState } from "react";
import { View, StyleSheet, TextInput, Pressable, Text } from "react-native";
import { useTheme } from "@/common/theme";
import { i18n } from "@/translations";
import { ColorTheme } from "@/types/theme-props";
import { router, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePageView } from "@/common/hooks/use-page-view";
import { analytics } from "@/common/analytics";

const getStyles = (theme: ColorTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.white,
      flex: 1,
    },
    inputContainer: {
      marginHorizontal: 16,
      marginTop: 16,
      borderBottomColor: theme.black40,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    input: {
      color: theme.text01,
      fontSize: 18,
      paddingVertical: 8,
    },
    doneButton: {
      fontWeight: "bold",
      color: theme.primary,
      fontSize: 16,
    },
  });

type TextInputScreenProps = {
  /** The initial value for the text input */
  initialValue?: string;
  /** The title to display in the header */
  headerTitle: string;
  /** The placeholder text for the input field */
  placeholder?: string;
  /** Whether to allow multiline input */
  multiline?: boolean;
  /** The analytics page name (will be prefixed with "page_view_") */
  analyticsPageName: string;
  /** The analytics event name for saving (without "tap_" prefix) */
  analyticsSaveEventName: string;
  /** Callback function when the user saves */
  onSave?: (value: string) => void;
};

/**
 * A reusable text input screen component.
 * Used for inputting simple text values like payee, narration, etc.
 */
export const TextInputScreen: React.FC<TextInputScreenProps> = ({
  initialValue = "",
  headerTitle,
  placeholder,
  multiline = false,
  analyticsPageName,
  analyticsSaveEventName,
  onSave,
}) => {
  usePageView(analyticsPageName);

  const theme = useTheme().colorTheme;
  const styles = getStyles(theme);
  const [value, setValue] = useState<string>(initialValue);

  const handleSave = async () => {
    onSave?.(value);
    await analytics.track(`tap_${analyticsSaveEventName}`, {
      value,
    });
    router.back();
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle,
          headerRight: () => (
            <Pressable onPress={handleSave} hitSlop={10}>
              <Text style={styles.doneButton}>{i18n.t("save")}</Text>
            </Pressable>
          ),
        }}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          placeholder={placeholder ?? i18n.t("pleaseInput")}
          underlineColorAndroid="transparent"
          clearButtonMode="while-editing"
          autoFocus
          onChangeText={setValue}
          multiline={multiline}
        />
      </View>
    </SafeAreaView>
  );
};
