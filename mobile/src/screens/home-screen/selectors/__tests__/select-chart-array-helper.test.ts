// Mock dependencies BEFORE any imports
const Module = require("module");
const originalRequire = Module.prototype.require;

Module.prototype.require = function (this: NodeModule, id: string) {
  // Mock expo-localization
  if (id === "expo-localization") {
    return {
      getLocales: () => [{ languageCode: "en" }],
    };
  }

  // Mock @/translations to avoid loading expo dependencies
  if (id === "@/translations" || id.includes("/translations")) {
    return {
      i18n: {
        t: (key: string) => {
          if (key === "noDataCharts") return "No data";
          return key;
        },
        locale: "en",
        enableFallback: true,
      },
      setLocale: () => {},
    };
  }

  return originalRequire.apply(this, arguments);
};

import { HomeChartsQuery } from "@/generated-graphql/graphql";
import { selectChartArray, isSameMonth } from "../select-chart-array-helper";

describe("selectChartArray", () => {
  it("returns no data labels when data is undefined", () => {
    const result = selectChartArray("Test Label", "USD");
    expect(result.labels).toEqual(["No data"]);
    expect(result.numbers).toEqual([0]);
  });

  it("returns no data labels when homeCharts is missing", () => {
    const data = {} as HomeChartsQuery;
    const result = selectChartArray("Test Label", "USD", data);
    expect(result.labels).toEqual(["No data"]);
    expect(result.numbers).toEqual([0]);
  });

  it("returns no data labels when requested label is not found", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Other Label",
            data: [],
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectChartArray("Test Label", "USD", data);
    expect(result.labels).toEqual(["No data"]);
    expect(result.numbers).toEqual([0]);
  });

  it("extracts last 7 data points", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Test Label",
            data: Array.from({ length: 12 }, (_, i) => ({
              date: `2025-${String(i + 1).padStart(2, "0")}-01`,
              balance: { USD: String(1000 + i * 100) },
            })),
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectChartArray("Test Label", "USD", data);
    expect(result.labels).toEqual(["06", "07", "08", "09", "10", "11", "12"]);
    expect(result.numbers).toEqual([1500, 1600, 1700, 1800, 1900, 2000, 2100]);
  });

  it("handles fewer than 7 data points", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Test Label",
            data: [
              { date: "2025-01-01", balance: { USD: "1000" } },
              { date: "2025-02-01", balance: { USD: "1100" } },
              { date: "2025-03-01", balance: { USD: "1200" } },
            ],
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectChartArray("Test Label", "USD", data);
    expect(result.labels).toEqual(["01", "02", "03"]);
    expect(result.numbers).toEqual([1000, 1100, 1200]);
  });

  it("removes duplicate month entries when last two are same month", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Test Label",
            data: [
              { date: "2025-01-01", balance: { USD: "1000" } },
              { date: "2025-01-15", balance: { USD: "1100" } },
              { date: "2025-01-30", balance: { USD: "1200" } },
            ],
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectChartArray("Test Label", "USD", data);
    // Should keep only the last entry for January (most recent)
    expect(result.labels).toEqual(["01"]);
    expect(result.numbers).toEqual([1200]);
  });

  it("handles missing currency in balance", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Test Label",
            data: [{ date: "2025-01-01", balance: { EUR: "1000" } }],
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectChartArray("Test Label", "USD", data);
    expect(result.labels).toEqual(["01"]);
    expect(result.numbers).toEqual([0]);
  });

  it("handles negative values", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Test Label",
            data: [
              { date: "2025-01-01", balance: { USD: "-500" } },
              { date: "2025-02-01", balance: { USD: "200" } },
            ],
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectChartArray("Test Label", "USD", data);
    expect(result.labels).toEqual(["01", "02"]);
    expect(result.numbers).toEqual([-500, 200]);
  });

  it("handles decimal values correctly", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Test Label",
            data: [{ date: "2025-01-01", balance: { USD: "1234.56" } }],
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectChartArray("Test Label", "USD", data);
    expect(result.labels).toEqual(["01"]);
    expect(result.numbers).toEqual([1234.56]);
  });

  it("extracts only month portion from date labels", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Test Label",
            data: [{ date: "2025-12-25", balance: { USD: "5000" } }],
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectChartArray("Test Label", "USD", data);
    expect(result.labels).toEqual(["12"]);
  });

  it("handles multiple duplicate months and keeps only the most recent entry for each", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Test Label",
            data: [
              // These won't be in the last 7
              { date: "2024-10-01", balance: { USD: "900" } },
              { date: "2024-11-01", balance: { USD: "950" } },
              // These are the last 7 entries
              { date: "2025-01-01", balance: { USD: "1000" } },
              { date: "2025-01-10", balance: { USD: "1100" } },
              { date: "2025-01-20", balance: { USD: "1200" } },
              { date: "2025-02-05", balance: { USD: "1300" } },
              { date: "2025-02-15", balance: { USD: "1400" } },
              { date: "2025-03-01", balance: { USD: "1500" } },
              { date: "2025-03-10", balance: { USD: "1600" } },
            ],
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectChartArray("Test Label", "USD", data);
    // Should take last 7, then keep only the last entry for each month
    expect(result.labels).toEqual(["01", "02", "03"]);
    expect(result.numbers).toEqual([1200, 1400, 1600]);
  });

  it("preserves order and keeps most recent entry when deduplicating", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Test Label",
            data: [
              { date: "2024-10-01", balance: { USD: "25" } },
              { date: "2024-11-01", balance: { USD: "50" } },
              { date: "2025-01-01", balance: { USD: "100" } },
              { date: "2025-02-01", balance: { USD: "200" } },
              { date: "2025-02-15", balance: { USD: "250" } },
              { date: "2025-03-01", balance: { USD: "300" } },
              { date: "2025-03-10", balance: { USD: "350" } },
              { date: "2025-03-20", balance: { USD: "400" } },
            ],
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectChartArray("Test Label", "USD", data);
    // Last 7 entries: 11-01, 01-01, 02-01, 02-15, 03-01, 03-10, 03-20
    // After dedup: 11-01, 01-01, 02-15, 03-20
    expect(result.labels).toEqual(["11", "01", "02", "03"]);
    expect(result.numbers).toEqual([50, 100, 250, 400]);
  });

  it("works correctly when all entries are from the same month", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Test Label",
            data: [
              { date: "2025-05-01", balance: { USD: "1000" } },
              { date: "2025-05-10", balance: { USD: "2000" } },
              { date: "2025-05-15", balance: { USD: "3000" } },
              { date: "2025-05-20", balance: { USD: "4000" } },
              { date: "2025-05-25", balance: { USD: "5000" } },
            ],
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectChartArray("Test Label", "USD", data);
    // Should keep only the most recent entry
    expect(result.labels).toEqual(["05"]);
    expect(result.numbers).toEqual([5000]);
  });

  it("handles balance as string with leading zeros", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Test Label",
            data: [{ date: "2025-01-01", balance: { USD: "0001.50" } }],
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectChartArray("Test Label", "USD", data);
    expect(result.labels).toEqual(["01"]);
    expect(result.numbers).toEqual([1.5]);
  });

  it("handles extremely large numbers", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Test Label",
            data: [
              {
                date: "2025-01-01",
                balance: { USD: "999999999999.99" },
              },
            ],
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectChartArray("Test Label", "USD", data);
    expect(result.labels).toEqual(["01"]);
    expect(result.numbers).toEqual([999999999999.99]);
  });

  it("handles empty balance object", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Test Label",
            data: [{ date: "2025-01-01", balance: {} }],
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectChartArray("Test Label", "USD", data);
    expect(result.labels).toEqual(["01"]);
    expect(result.numbers).toEqual([0]);
  });

  it("handles NaN string values gracefully", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Test Label",
            data: [{ date: "2025-01-01", balance: { USD: "invalid" } }],
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectChartArray("Test Label", "USD", data);
    expect(result.labels).toEqual(["01"]);
    expect(result.numbers).toEqual([NaN]);
  });

  it("handles whitespace in balance values", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Test Label",
            data: [{ date: "2025-01-01", balance: { USD: " 100.50 " } }],
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectChartArray("Test Label", "USD", data);
    expect(result.labels).toEqual(["01"]);
    expect(result.numbers).toEqual([100.5]);
  });
});

describe("isSameMonth helper", () => {
  it("returns true for dates in the same year and month", () => {
    expect(isSameMonth("2025-01-15", "2025-01-20")).toBe(true);
  });

  it("returns false for dates in different months", () => {
    expect(isSameMonth("2025-01-15", "2025-02-15")).toBe(false);
  });

  it("returns false for same month in different years", () => {
    expect(isSameMonth("2024-01-15", "2025-01-20")).toBe(false);
  });

  it("returns true for same date", () => {
    expect(isSameMonth("2025-03-15", "2025-03-15")).toBe(true);
  });

  it("handles undefined dates", () => {
    expect(isSameMonth(undefined, undefined)).toBe(true);
    expect(isSameMonth("2025-01-15", undefined)).toBe(false);
    expect(isSameMonth(undefined, "2025-01-15")).toBe(false);
  });

  it("handles empty string dates", () => {
    expect(isSameMonth("", "")).toBe(true);
    expect(isSameMonth("2025-01-15", "")).toBe(false);
    expect(isSameMonth("", "2025-01-15")).toBe(false);
  });

  it("handles dates with different formats", () => {
    // Should still compare first 7 characters (YYYY-MM)
    expect(isSameMonth("2025-01", "2025-01")).toBe(true);
    expect(isSameMonth("2025-01-01", "2025-01-31")).toBe(true);
  });
});
