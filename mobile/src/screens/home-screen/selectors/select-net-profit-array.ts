import { HomeChartsQuery } from "@/generated-graphql/graphql";
import { selectChartArray } from "./select-chart-array-helper";

export function selectNetProfitArray(currency: string, data?: HomeChartsQuery) {
  return selectChartArray("Net Profit", currency, data);
}
