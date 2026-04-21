import React from "react";
import { StyleSheet, Text } from "react-native";
import { useThemeStyle } from "@/common/hooks";
import { ColorTheme } from "@/types/theme-props";
import { getFieldWidth } from "../journal-config";

const getStyles = (theme: ColorTheme) =>
  StyleSheet.create({
    dateCell: {
      fontSize: 14,
      fontFamily: "monospace",
      color: theme.black90,
      textAlign: "center",
    },
  });

/**
 * Formats a date string as YYYY-MM-DD (ISO format)
 */
const formatDateISO = (dateString: string | null | undefined): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch {
    return dateString;
  }
};

interface JournalItemDateProps {
  date: string | null | undefined;
}

/**
 * Component for rendering the date cell of a journal entry
 * Uses journal-config.ts for width configuration
 */
export const JournalItemDate: React.FC<JournalItemDateProps> = ({ date }) => {
  const styles = useThemeStyle(getStyles);
  const formattedDate = formatDateISO(date);
  const width = getFieldWidth("date");

  return (
    <Text style={[styles.dateCell, typeof width === "number" ? { width } : {}]}>
      {formattedDate}
    </Text>
  );
};
