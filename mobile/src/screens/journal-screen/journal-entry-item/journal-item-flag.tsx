import React from "react";
import { StyleSheet, Text } from "react-native";
import { useThemeStyle } from "@/common/hooks";
import { ColorTheme } from "@/types/theme-props";
import { getFieldWidth } from "../journal-config";
import { isJournalTransaction, JournalDirectiveType } from "../types";

const getStyles = (theme: ColorTheme) =>
  StyleSheet.create({
    flagCell: {
      fontSize: 14,
      fontFamily: "monospace",
      color: theme.black90,
      textAlign: "center",
    },
  });

interface JournalItemFlagProps {
  entry: JournalDirectiveType;
}

/**
 * Component for rendering the flag cell of a journal entry
 * Uses journal-config.ts for width configuration
 */
export const JournalItemFlag: React.FC<JournalItemFlagProps> = ({ entry }) => {
  const styles = useThemeStyle(getStyles);
  const displayFlag = isJournalTransaction(entry)
    ? entry.flag
    : entry.directive_type;
  const width = getFieldWidth("flag");

  return (
    <Text style={[styles.flagCell, typeof width === "number" ? { width } : {}]}>
      {displayFlag}
    </Text>
  );
};
