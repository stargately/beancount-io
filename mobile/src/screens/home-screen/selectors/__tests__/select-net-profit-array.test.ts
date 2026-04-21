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

  // Mock the helper file that contains shared chart logic
  if (
    id === "./select-chart-array-helper" ||
    id.includes("select-chart-array-helper")
  ) {
    const originalHelper = originalRequire.apply(this, [id]);
    return originalHelper;
  }

  return originalRequire.apply(this, arguments);
};

import { HomeChartsQuery } from "@/generated-graphql/graphql";
import { selectNetProfitArray } from "../select-net-profit-array";

describe("selectNetProfitArray", () => {
  it("returns no data labels when data is undefined", () => {
    const result = selectNetProfitArray("USD");
    expect(result.labels).toEqual(["No data"]);
    expect(result.numbers).toEqual([0]);
  });

  it("returns no data labels when homeCharts is missing", () => {
    const data = {} as HomeChartsQuery;
    const result = selectNetProfitArray("USD", data);
    expect(result.labels).toEqual(["No data"]);
    expect(result.numbers).toEqual([0]);
  });

  it("returns no data labels when Net Profit label is not found", () => {
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
    const result = selectNetProfitArray("USD", data);
    expect(result.labels).toEqual(["No data"]);
    expect(result.numbers).toEqual([0]);
  });

  it("extracts last 7 data points", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Net Profit",
            data: Array.from({ length: 12 }, (_, i) => ({
              date: `2025-${String(i + 1).padStart(2, "0")}-01`,
              balance: { USD: String(100 + i * 50) },
            })),
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectNetProfitArray("USD", data);
    expect(result.labels).toEqual(["06", "07", "08", "09", "10", "11", "12"]);
    expect(result.numbers).toEqual([350, 400, 450, 500, 550, 600, 650]);
  });

  it("handles fewer than 7 data points", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Net Profit",
            data: [
              { date: "2025-01-01", balance: { USD: "500" } },
              { date: "2025-02-01", balance: { USD: "600" } },
              { date: "2025-03-01", balance: { USD: "700" } },
            ],
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectNetProfitArray("USD", data);
    expect(result.labels).toEqual(["01", "02", "03"]);
    expect(result.numbers).toEqual([500, 600, 700]);
  });

  it("removes duplicate month entries when last two are same month", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Net Profit",
            data: [
              { date: "2025-01-01", balance: { USD: "100" } },
              { date: "2025-02-01", balance: { USD: "200" } },
              { date: "2025-03-01", balance: { USD: "300" } },
              { date: "2025-03-15", balance: { USD: "350" } },
            ],
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectNetProfitArray("USD", data);
    // Algorithm removes the second-to-last entry when last two are in same month
    expect(result.labels).toEqual(["02", "03"]);
    expect(result.numbers).toEqual([200, 350]);
  });

  it("handles missing currency in balance", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Net Profit",
            data: [
              { date: "2025-01-01", balance: { EUR: "100" } },
              { date: "2025-02-01", balance: { EUR: "200" } },
            ],
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectNetProfitArray("USD", data);
    expect(result.labels).toEqual(["01", "02"]);
    expect(result.numbers).toEqual([0, 0]);
  });

  it("handles negative profit values (losses)", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Net Profit",
            data: [
              { date: "2025-01-01", balance: { USD: "500" } },
              { date: "2025-02-01", balance: { USD: "-200" } },
              { date: "2025-03-01", balance: { USD: "300" } },
            ],
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectNetProfitArray("USD", data);
    expect(result.labels).toEqual(["01", "02", "03"]);
    expect(result.numbers).toEqual([500, -200, 300]);
  });

  it("handles decimal values correctly", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Net Profit",
            data: [
              { date: "2025-01-01", balance: { USD: "100.50" } },
              { date: "2025-02-01", balance: { USD: "200.75" } },
            ],
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectNetProfitArray("USD", data);
    expect(result.labels).toEqual(["01", "02"]);
    expect(result.numbers).toEqual([100.5, 200.75]);
  });

  it("handles zero values", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Net Profit",
            data: [
              { date: "2025-01-01", balance: { USD: "0" } },
              { date: "2025-02-01", balance: { USD: "0" } },
            ],
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectNetProfitArray("USD", data);
    expect(result.labels).toEqual(["01", "02"]);
    expect(result.numbers).toEqual([0, 0]);
  });

  it("extracts only month portion from date labels", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Net Profit",
            data: [{ date: "2025-12-25", balance: { USD: "1000" } }],
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectNetProfitArray("USD", data);
    expect(result.labels).toEqual(["12"]);
  });

  it("handles single data point", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Net Profit",
            data: [{ date: "2025-01-01", balance: { USD: "500" } }],
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectNetProfitArray("USD", data);
    expect(result.labels).toEqual(["01"]);
    expect(result.numbers).toEqual([500]);
  });

  it("does not remove duplicate when only one data point", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Net Profit",
            data: [{ date: "2025-03-15", balance: { USD: "300" } }],
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectNetProfitArray("USD", data);
    expect(result.labels).toEqual(["03"]);
    expect(result.numbers).toEqual([300]);
  });

  it("handles mix of positive and negative values", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Net Profit",
            data: [
              { date: "2025-01-01", balance: { USD: "100" } },
              { date: "2025-02-01", balance: { USD: "-50" } },
              { date: "2025-03-01", balance: { USD: "200" } },
            ],
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectNetProfitArray("USD", data);
    expect(result.labels).toEqual(["01", "02", "03"]);
    expect(result.numbers).toEqual([100, -50, 200]);
  });

  it("handles exactly 7 data points without duplicates", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Net Profit",
            data: Array.from({ length: 7 }, (_, i) => ({
              date: `2025-${String(i + 1).padStart(2, "0")}-01`,
              balance: { USD: String((i + 1) * 100) },
            })),
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectNetProfitArray("USD", data);
    expect(result.labels).toEqual(["01", "02", "03", "04", "05", "06", "07"]);
    expect(result.numbers).toEqual([100, 200, 300, 400, 500, 600, 700]);
  });

  it("handles multi-currency data and extracts correct currency", () => {
    const data = {
      homeCharts: {
        data: [
          {
            label: "Net Profit",
            data: [
              {
                date: "2025-01-01",
                balance: { USD: "100", EUR: "85", GBP: "75" },
              },
              {
                date: "2025-02-01",
                balance: { USD: "200", EUR: "170", GBP: "150" },
              },
            ],
          },
        ],
      },
    } as unknown as HomeChartsQuery;
    const result = selectNetProfitArray("EUR", data);
    expect(result.labels).toEqual(["01", "02"]);
    expect(result.numbers).toEqual([85, 170]);
  });
});
