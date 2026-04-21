import { HomeChartsQuery } from "@/generated-graphql/graphql";
import { selectChartArray, isSameMonth } from "./select-chart-array-helper";

export { isSameMonth };

export function selectNetWorthArray(currency: string, data?: HomeChartsQuery) {
  return selectChartArray("Net Worth", currency, data);
}
