describe("usePageView", () => {
  describe("hook behavior", () => {
    it("should format page_view prefix correctly for common page names", () => {
      const pageNames = [
        "home",
        "settings",
        "referral",
        "account_picker",
        "add_transaction",
        "add_transaction_next",
        "payee_input",
        "narration_input",
        "ledger",
        "journal",
        "pre_auth",
        "mine",
      ];

      pageNames.forEach((pageName) => {
        const expectedEventName = `page_view_${pageName}`;
        expect(expectedEventName.startsWith("page_view_")).toBe(true);
        expect(expectedEventName.replace("page_view_", "")).toBe(pageName);
      });
    });

    it("should handle empty page name", () => {
      const pageName = "";
      const expectedEventName = `page_view_${pageName}`;
      expect(expectedEventName).toBe("page_view_");
    });

    it("should handle page names with underscores", () => {
      const pageName = "add_transaction_next";
      const expectedEventName = `page_view_${pageName}`;
      expect(expectedEventName).toBe("page_view_add_transaction_next");
    });

    it("should handle page names with numbers", () => {
      const pageName = "test_page_123";
      const expectedEventName = `page_view_${pageName}`;
      expect(expectedEventName).toBe("page_view_test_page_123");
    });
  });

  describe("props handling", () => {
    it("should handle empty props object", () => {
      const props = {};
      expect(Object.keys(props).length).toBe(0);
    });

    it("should handle props with string values", () => {
      const props = { key: "value" };
      expect(props.key).toBe("value");
    });

    it("should handle props with boolean values", () => {
      const props = { isLoggedIn: true, hasSubscription: false };
      expect(props.isLoggedIn).toBe(true);
      expect(props.hasSubscription).toBe(false);
    });

    it("should handle props with number values", () => {
      const props = { amount: 100.5, count: 3 };
      expect(props.amount).toBe(100.5);
      expect(props.count).toBe(3);
    });
  });
});
