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
import { selectNetWorthArray, isSameMonth } from "../select-net-worth-array";

describe("isSameMonth", () => {
  it("returns true for dates in the same month", () => {
    expect(isSameMonth("2025-01-15", "2025-01-20")).toBe(true);
  });

  it("returns false for dates in different months", () => {
    expect(isSameMonth("2025-01-15", "2025-02-15")).toBe(false);
  });

  it("handles year boundaries correctly", () => {
    expect(isSameMonth("2024-12-31", "2025-01-01")).toBe(false);
    // Same month number but different years should be false
    expect(isSameMonth("2024-01-15", "2025-01-20")).toBe(false);
    expect(isSameMonth("2024-06-30", "2025-06-01")).toBe(false);
  });

  it("returns true for same date", () => {
    expect(isSameMonth("2025-03-15", "2025-03-15")).toBe(true);
  });

  it("handles undefined dates", () => {
    expect(isSameMonth(undefined, undefined)).toBe(true);
    expect(isSameMonth("2025-01-15", undefined)).toBe(false);
    expect(isSameMonth(undefined, "2025-01-15")).toBe(false);
  });
});

describe("selectNetWorthArray", () => {
  it("returns no data labels when data is undefined", () => {
    const result = selectNetWorthArray("USD");
    expect(result.labels).toEqual(["No data"]);
    expect(result.numbers).toEqual([0]);
  });

  it("returns no data labels when homeCharts is missing", () => {
    const data = {} as HomeChartsQuery;
    const result = selectNetWorthArray("USD", data);
    expect(result.labels).toEqual(["No data"]);
    expect(result.numbers).toEqual([0]);
  });

  it("returns no data labels when Net Worth label is not found", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Other",
            data: [],
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectNetWorthArray("USD", data);
    expect(result.labels).toEqual(["No data"]);
    expect(result.numbers).toEqual([0]);
  });

  it("extracts last 7 data points", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Net Worth",
            data: Array.from({ length: 12 }, (_, i) => ({
              date: `2025-${String(i + 1).padStart(2, "0")}-01`,
              balance: { USD: String(1000 + i * 100) },
            })),
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectNetWorthArray("USD", data);
    expect(result.labels).toEqual(["06", "07", "08", "09", "10", "11", "12"]);
    expect(result.numbers).toEqual([1500, 1600, 1700, 1800, 1900, 2000, 2100]);
  });

  it("handles fewer than 7 data points", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Net Worth",
            data: [
              { date: "2025-01-01", balance: { USD: "1000" } },
              { date: "2025-02-01", balance: { USD: "1100" } },
              { date: "2025-03-01", balance: { USD: "1200" } },
            ],
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectNetWorthArray("USD", data);
    expect(result.labels).toEqual(["01", "02", "03"]);
    expect(result.numbers).toEqual([1000, 1100, 1200]);
  });

  it("removes duplicate month entries when last two are same month", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Net Worth",
            data: [
              { date: "2025-01-01", balance: { USD: "1000" } },
              { date: "2025-02-01", balance: { USD: "1100" } },
              { date: "2025-03-01", balance: { USD: "1200" } },
              { date: "2025-03-15", balance: { USD: "1250" } },
            ],
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectNetWorthArray("USD", data);
    // Algorithm removes the second-to-last entry when last two are in same month
    // So we expect only the last 3 unique entries (it splices out index length-2)
    expect(result.labels).toEqual(["02", "03"]);
    expect(result.numbers).toEqual([1100, 1250]);
  });

  it("handles missing currency in balance", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Net Worth",
            data: [
              { date: "2025-01-01", balance: { EUR: "1000" } },
              { date: "2025-02-01", balance: { EUR: "1100" } },
            ],
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectNetWorthArray("USD", data);
    expect(result.labels).toEqual(["01", "02"]);
    expect(result.numbers).toEqual([0, 0]);
  });

  it("handles negative net worth values", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Net Worth",
            data: [
              { date: "2025-01-01", balance: { USD: "1000" } },
              { date: "2025-02-01", balance: { USD: "-500" } },
            ],
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectNetWorthArray("USD", data);
    expect(result.labels).toEqual(["01", "02"]);
    expect(result.numbers).toEqual([1000, -500]);
  });

  it("handles decimal values correctly", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Net Worth",
            data: [
              { date: "2025-01-01", balance: { USD: "1000.50" } },
              { date: "2025-02-01", balance: { USD: "1100.75" } },
            ],
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectNetWorthArray("USD", data);
    expect(result.labels).toEqual(["01", "02"]);
    expect(result.numbers).toEqual([1000.5, 1100.75]);
  });

  it("handles zero values", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Net Worth",
            data: [
              { date: "2025-01-01", balance: { USD: "0" } },
              { date: "2025-02-01", balance: { USD: "0" } },
            ],
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectNetWorthArray("USD", data);
    expect(result.labels).toEqual(["01", "02"]);
    expect(result.numbers).toEqual([0, 0]);
  });

  it("extracts only month portion from date labels", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Net Worth",
            data: [{ date: "2025-12-25", balance: { USD: "5000" } }],
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectNetWorthArray("USD", data);
    expect(result.labels).toEqual(["12"]);
  });

  it("handles single data point", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Net Worth",
            data: [{ date: "2025-01-01", balance: { USD: "1000" } }],
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectNetWorthArray("USD", data);
    expect(result.labels).toEqual(["01"]);
    expect(result.numbers).toEqual([1000]);
  });

  it("does not remove duplicate when only one data point", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Net Worth",
            data: [{ date: "2025-03-15", balance: { USD: "1000" } }],
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectNetWorthArray("USD", data);
    expect(result.labels).toEqual(["03"]);
    expect(result.numbers).toEqual([1000]);
  });
});
