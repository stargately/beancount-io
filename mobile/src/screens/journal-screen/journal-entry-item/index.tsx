import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useThemeStyle } from "@/common/hooks";
import { ColorTheme } from "@/types/theme-props";
import { JournalItemDate } from "./journal-item-date";
import { JournalItemFlag } from "./journal-item-flag";
import { JournalItemDescription } from "./journal-item-description";
import { JournalDirectiveType } from "../types";

const getStyles = (theme: ColorTheme) =>
  StyleSheet.create({
    entryContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: theme.white,
    },
  });

interface JournalEntryItemProps {
  entry: JournalDirectiveType;
  onPress?: () => void;
}

/**
 * Component for rendering a single journal entry row
 */
export const JournalEntryItem: React.FC<JournalEntryItemProps> = ({
  entry,
  onPress,
}) => {
  const styles = useThemeStyle(getStyles);

  const content = (
    <>
      <JournalItemDate date={entry.date} />
      <JournalItemFlag entry={entry} />
      <JournalItemDescription entry={entry} />
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={styles.entryContainer}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.entryContainer}>{content}</View>;
};
