import * as React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/common/theme";
import { i18n } from "@/translations";
import { ScreenWidth } from "@/common/screen-util";
import { QuickAddAccountsSelector } from "@/screens/add-transaction-screen/quick-add-accounts-selector";
import { getCurrencySymbol } from "@/common/currency-util";
import { analytics } from "@/common/analytics";
import { ColorTheme } from "@/types/theme-props";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useToast, usePageView } from "@/common/hooks";

const KeyWidth = ScreenWidth / 3;
const KeyHeight = 50;

const getStyles = (theme: ColorTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.white,
    },
    containerCenter: {
      flex: 1,
      backgroundColor: theme.white,
      justifyContent: "center",
      alignItems: "center",
    },
    txtMoney: {
      fontSize: 60,
      color: theme.black,
    },
    keyButton: {
      height: KeyHeight,
      width: KeyWidth,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: 0,
      backgroundColor: theme.black10,
    },
    keyLabel: {
      fontSize: 20,
      color: theme.black,
    },
  });

export function AddTransactionScreen(): JSX.Element {
  usePageView("add_transaction");
  const Keys = [
    { display: "1", value: 1 },
    { display: "2", value: 2 },
    { display: "3", value: 3 },
    { display: "4", value: 4 },
    { display: "5", value: 5 },
    { display: "6", value: 6 },
    { display: "7", value: 7 },
    { display: "8", value: 8 },
    { display: "9", value: 9 },
    { display: "Del", value: 100 },
    { display: "0", value: 0 },
    { display: i18n.t("next"), value: 200 },
  ];

  const theme = useTheme().colorTheme;
  const styles = getStyles(theme);
  const [currentMoney, setCurrentMoney] = React.useState("0.00");
  const [keyValues, setKeyValues] = React.useState<number[]>([]);
  const router = useRouter();
  const toast = useToast();

  let currentAsset = "";
  let currentExpense = "";
  const [currentCurrency, setCurrentCurrency] = React.useState("");

  const onChange = ({
    asset,
    expense,
    currency,
  }: {
    asset: string;
    expense: string;
    currency: string;
  }) => {
    currentAsset = asset;
    currentExpense = expense;
    setCurrentCurrency(currency);
  };

  const getMoneyByKeyValues = (values: number[]) => {
    let money = "0.00";
    if (values.length > 0) {
      let moneyTmp = values.map((v) => String(v)).join("");
      if (moneyTmp.length === 1) {
        moneyTmp = `00${moneyTmp}`;
      }
      if (moneyTmp.length === 2) {
        moneyTmp = `0${moneyTmp}`;
      }
      money = `${moneyTmp.slice(0, moneyTmp.length - 2)}.${moneyTmp.slice(
        moneyTmp.length - 2,
      )}`;
    }
    return money;
  };

  const currencySymbol = getCurrencySymbol(currentCurrency);
  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <View style={styles.containerCenter}>
        <Text
          style={styles.txtMoney}
        >{`${currencySymbol}${currentMoney}`}</Text>
      </View>
      <QuickAddAccountsSelector onChange={onChange} />
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {Keys.map((key) => {
          return (
            <TouchableOpacity
              key={key.value}
              activeOpacity={0.5}
              style={[
                styles.keyButton,
                {
                  backgroundColor:
                    key.display === i18n.t("next")
                      ? theme.primary
                      : theme.black10,
                },
              ]}
              onPress={async () => {
                if (key.display === "Del" && keyValues.length > 0) {
                  keyValues.pop();
                } else if (key.value < 10) {
                  if (key.display === "0" && keyValues.length > 0) {
                    keyValues.push(0);
                  } else if (key.value > 0) {
                    keyValues.push(key.value);
                  }
                }
                setCurrentMoney(getMoneyByKeyValues(keyValues));
                setKeyValues(keyValues);

                if (key.display === i18n.t("next")) {
                  if (currentMoney === "0.00") {
                    toast.showToast({
                      message: i18n.t("amountEmptyError"),
                      type: "text",
                    });
                    return;
                  }
                  await analytics.track("tap_add_transaction_next", {
                    money: currentMoney,
                  });
                  router.replace({
                    pathname: "/add-transaction-next",
                    params: {
                      currentMoney,
                      currentAsset,
                      currentExpense,
                      currentCurrency,
                      // onRefresh,
                    },
                  });
                }
              }}
            >
              {key.display === "Del" ? (
                <Feather name="delete" size={20} color={theme.black} />
              ) : (
                <Text
                  style={[
                    styles.keyLabel,
                    {
                      color:
                        key.display === i18n.t("next")
                          ? theme.white
                          : theme.black,
                    },
                  ]}
                >
                  {key.display}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
