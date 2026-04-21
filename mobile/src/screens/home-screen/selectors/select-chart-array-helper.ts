import { HomeChartsQuery } from "@/generated-graphql/graphql";
import { i18n } from "@/translations";

export function isSameMonth(date1?: string, date2?: string): boolean {
  if (!date1 || !date2) {
    return date1 === date2;
  }
  // Compare both year and month (YYYY-MM)
  return date1.slice(0, 7) === date2.slice(0, 7);
}

/**
 * Helper function to extract and format chart data for a given label
 * @param label - The chart label to search for (e.g., "Net Worth", "Net Profit")
 * @param currency - The currency to extract from balance data
 * @param data - The home charts query data
 * @returns Object with labels (month strings) and numbers (balance values)
 */
export function selectChartArray(
  label: string,
  currency: string,
  data?: HomeChartsQuery,
) {
  const chartData = data?.homeCharts?.data.find((n) => n.label === label);
  const last = chartData?.data.slice(
    chartData?.data.length - 7,
    chartData?.data.length,
  );

  // Remove duplicate month entries (keep the most recent one for each month)
  const deduplicated = last?.reduceRight<typeof last>((acc, current) => {
    const currentMonth = current.date.slice(0, 7);
    const hasMonth = acc.some((item) => item.date.slice(0, 7) === currentMonth);
    if (!hasMonth) {
      acc.unshift(current);
    }
    return acc;
  }, []);

  let labels = deduplicated?.map((l) => l.date.slice(5, 7)) || [];
  let numbers =
    deduplicated?.map((l) => Number(l.balance[currency] || 0)) || [];

  if (labels.length === 0) {
    labels = [i18n.t("noDataCharts")];
  }
  if (numbers.length === 0) {
    numbers = [0];
  }

  return { labels, numbers };
}
