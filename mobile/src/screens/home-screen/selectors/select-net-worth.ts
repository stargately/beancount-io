import { HomeChartsQuery } from "@/generated-graphql/graphql";

export function getNetWorth(currency: string, data?: HomeChartsQuery) {
  if (!currency) {
    return { netAssets: "0.00" };
  }
  const netWorthList = data?.homeCharts?.data.find(
    (n) => n.label === "Net Worth",
  );
  return {
    netAssets: Number(
      netWorthList?.data[netWorthList?.data.length - 1]?.balance[currency] || 0,
    ).toFixed(2),
  };
}
