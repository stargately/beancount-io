describe("config", () => {
  describe("config object", () => {
    it("exports config object", () => {
      const { config } = require("../config");
      expect(config).toBeTruthy();
      expect(typeof config).toBe("object");
    });

    it("has project property", () => {
      const { config } = require("../config");
      expect(config.project).toBe("mobile-beancount");
    });

    it("has sentryDsn property", () => {
      const { config } = require("../config");
      expect(typeof config.sentryDsn).toBe("string");
    });

    it("has analytics object", () => {
      const { config } = require("../config");
      expect(config.analytics).toBeTruthy();
      expect(typeof config.analytics).toBe("object");
    });

    it("has googleTid in analytics", () => {
      const { config } = require("../config");
      expect(config.analytics.googleTid).toBe("UA-143353833-1");
    });

    it("has mixpanelProjectToken in analytics", () => {
      const { config } = require("../config");
      expect(typeof config.analytics.mixpanelProjectToken).toBe("string");
    });

    it("has serverUrl property", () => {
      const { config } = require("../config");
      expect(typeof config.serverUrl).toBe("string");
    });

    it("serverUrl defaults to beancount.io", () => {
      const { config } = require("../config");
      expect(config.serverUrl).toBe("https://beancount.io/");
    });

    it("serverUrl ends with trailing slash", () => {
      const { config } = require("../config");
      expect(config.serverUrl.endsWith("/")).toBe(true);
    });

    it("serverUrl is a valid URL", () => {
      const { config } = require("../config");
      expect(config.serverUrl.startsWith("https://")).toBe(true);
    });
  });

  describe("config structure", () => {
    it("has all required top-level keys", () => {
      const { config } = require("../config");
      const keys = Object.keys(config);
      expect(keys.includes("project")).toBe(true);
      expect(keys.includes("sentryDsn")).toBe(true);
      expect(keys.includes("analytics")).toBe(true);
      expect(keys.includes("serverUrl")).toBe(true);
    });

    it("has all required analytics keys", () => {
      const { config } = require("../config");
      const analyticsKeys = Object.keys(config.analytics);
      expect(analyticsKeys.includes("googleTid")).toBe(true);
      expect(analyticsKeys.includes("mixpanelProjectToken")).toBe(true);
    });
  });
});
