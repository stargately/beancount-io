import { getAccountTotals } from "../select-account-totals";
import { AccountHierarchyQuery } from "@/generated-graphql/graphql";

// Helper to create minimal test data matching GraphQL types
type TestAccountBalance = {
  account: string;
  balance: number;
  balance_children: Record<string, number>;
  children: TestAccountBalance[];
};

type TestHierarchyItem = {
  type: string;
  label: string;
  data: TestAccountBalance;
};

type TestAccountHierarchyQuery = {
  accountHierarchy: {
    success: boolean;
    data: TestHierarchyItem[];
  };
};

// Helper function to create test data
function createTestData(
  items: Array<{
    label: string;
    balance_children: Record<string, number>;
    balance?: number;
  }>,
): TestAccountHierarchyQuery {
  return {
    accountHierarchy: {
      success: true,
      data: items.map((item) => ({
        type: "account",
        label: item.label,
        data: {
          account: item.label,
          balance: item.balance || 0,
          balance_children: item.balance_children,
          children: [],
        },
      })),
    },
  };
}

describe("getAccountTotals - Zero Currency Bug", () => {
  it("should return 0 when requested currency is 0, even if USD has value", () => {
    const data = createTestData([
      {
        label: "Assets",
        balance_children: { EUR: 0, USD: 100.5 },
        balance: 0,
      },
    ]);

    const result = getAccountTotals(
      "EUR",
      data as unknown as AccountHierarchyQuery,
    );

    // This should be "0.00" but due to the bug it will be "100.50"
    // After fixing the bug, this test should pass
    expect(result.assets).toBe("0.00");
  });

  it("should return 0 for negative zero balance when currency is 0", () => {
    const data = createTestData([
      {
        label: "Income",
        balance_children: { EUR: 0, USD: -500.0 },
        balance: 0,
      },
    ]);

    const result = getAccountTotals(
      "EUR",
      data as unknown as AccountHierarchyQuery,
    );

    expect(result.income).toBe("0.00");
  });

  it("should correctly handle when requested currency has value and USD is 0", () => {
    const data = createTestData([
      {
        label: "Assets",
        balance_children: { EUR: 200.0, USD: 0 },
        balance: 200.0,
      },
    ]);

    const result = getAccountTotals(
      "EUR",
      data as unknown as AccountHierarchyQuery,
    );

    expect(result.assets).toBe("200.00");
  });
});
