type GetCurrencySymbol = typeof import("../currency-util").getCurrencySymbol;

describe("getCurrencySymbol", () => {
  let getCurrencySymbol: GetCurrencySymbol;

  beforeAll(() => {
    const currencyIconsPath = require.resolve("currency-icons");
    require.cache[currencyIconsPath] = {
      exports: {
        USD: { symbol: "$" },
        EUR: {},
      },
    } as NodeModule;

    const modulePath = require.resolve("../currency-util");
    delete require.cache[modulePath];
    ({ getCurrencySymbol } = require("../currency-util"));
  });

  afterAll(() => {
    const currencyIconsPath = require.resolve("currency-icons");
    delete require.cache[currencyIconsPath];

    const modulePath = require.resolve("../currency-util");
    delete require.cache[modulePath];
  });

  it("returns the Yuan symbol for CNY regardless of configured icons", () => {
    expect(getCurrencySymbol("CNY")).toBe("¥");
  });

  it("returns the symbol provided by currency-icons when available", () => {
    expect(getCurrencySymbol("USD")).toBe("$");
  });

  it("falls back to an empty string when a symbol is unavailable", () => {
    expect(getCurrencySymbol("EUR")).toBe("");
    expect(getCurrencySymbol("ABC")).toBe("");
  });
});
