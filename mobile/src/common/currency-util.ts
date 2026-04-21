import CurrencyIcons from "currency-icons";

export const getCurrencySymbol = (currency: string) => {
  if (currency === "CNY") {
    return "¥";
  }
  return CurrencyIcons[currency]?.symbol || "";
};
