import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import { contentPadding } from "@/common/screen-util";
import { i18n } from "@/translations";
import { ColorTheme } from "@/types/theme-props";
import { useThemeStyle } from "@/common/hooks/use-theme-style";
import { useTheme } from "@/common/theme";

const getStyles = (theme: ColorTheme) =>
  StyleSheet.create({
    text: {
      fontSize: 16,
      color: theme.text01,
    },
    rowContainer: {
      flexDirection: "row",
      height: 42,
      alignItems: "center",
      paddingHorizontal: contentPadding,
    },
    circle: {
      height: 12,
      width: 12,
      borderRadius: 6,
      marginRight: contentPadding,
    },
  });

export function AccountsRow({
  title,
  value,
  circleColor,
}: {
  title: string;
  value: string;
  circleColor: string;
}): JSX.Element {
  const styles = useThemeStyle(getStyles);
  return (
    <View style={styles.rowContainer}>
      <View style={[styles.circle, { backgroundColor: circleColor }]} />
      <Text style={styles.text}>{title}</Text>
      <View style={{ flex: 1 }} />
      <Text style={styles.text}>{value}</Text>
    </View>
  );
}

export function AccountsStyled({
  assets,
  liabilities,
  income,
  expenses,
  equity,
}: {
  assets: string;
  liabilities: string;
  income: string;
  expenses: string;
  equity: string;
}): JSX.Element {
  const styles = useThemeStyle((theme) =>
    StyleSheet.create({
      line: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: theme.black20,
      },
    }),
  );
  const { colorTheme } = useTheme();
  const rows = [
    {
      title: i18n.t("assets"),
      value: assets,
      circleColor: colorTheme.success,
    },
    {
      title: i18n.t("liabilities"),
      value: liabilities,
      circleColor: colorTheme.information,
    },
    {
      title: i18n.t("income"),
      value: income,
      circleColor: colorTheme.warning,
    },
    {
      title: i18n.t("expenses"),
      value: expenses,
      circleColor: colorTheme.error,
    },
    {
      title: i18n.t("equity"),
      value: equity,
      circleColor: colorTheme.primary,
    },
  ];
  return (
    <View>
      {rows.map((row, index) => (
        <React.Fragment key={row.title}>
          {index === 0 && <View style={styles.line} />}
          <AccountsRow
            title={row.title}
            value={row.value}
            circleColor={row.circleColor}
          />
          <View style={styles.line} />
        </React.Fragment>
      ))}
    </View>
  );
}
