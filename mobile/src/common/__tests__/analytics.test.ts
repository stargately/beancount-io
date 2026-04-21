const Module = require("module");

const configModulePath = require.resolve("../../config");
const analyticsModulePath = require.resolve("../analytics");
const mixpanelMockPath =
  require.resolve("./fixtures/mock-expo-mixpanel-analytics");

const { config } = require("../../config");

interface GlobalWithDev {
  __DEV__: boolean;
}

const originalToken = config.analytics.mixpanelProjectToken;
const originalDevFlag = (global as unknown as GlobalWithDev).__DEV__;

let restoreResolveFilename: (() => void) | undefined;

function loadAnalytics(options: { token: string; dev: boolean }) {
  const { token, dev } = options;
  const { MockExpoMixpanelAnalytics } = require(mixpanelMockPath);
  MockExpoMixpanelAnalytics.reset();
  config.analytics.mixpanelProjectToken = token;
  delete require.cache[analyticsModulePath];
  (global as unknown as GlobalWithDev).__DEV__ = dev;
  const moduleExports =
    require("../analytics") as typeof import("../analytics");
  return { analytics: moduleExports.analytics, MockExpoMixpanelAnalytics };
}

describe("analytics", () => {
  beforeAll(() => {
    const originalResolveFilename = Module._resolveFilename;
    Module._resolveFilename = function resolve(
      request: string,
      parent: NodeModule | null | undefined,
      isMain: boolean,
      options?: { paths?: string[] },
    ) {
      if (request === "@/config") {
        return configModulePath;
      }
      if (request === "@/common/expo-mixpanel-analytics") {
        return mixpanelMockPath;
      }
      return originalResolveFilename.call(
        this,
        request,
        parent,
        isMain,
        options,
      );
    };

    restoreResolveFilename = () => {
      Module._resolveFilename = originalResolveFilename;
    };
  });

  afterAll(() => {
    restoreResolveFilename?.();
    config.analytics.mixpanelProjectToken = originalToken;
    delete require.cache[analyticsModulePath];
    (global as unknown as GlobalWithDev).__DEV__ = originalDevFlag;
  });

  afterEach(() => {
    const { MockExpoMixpanelAnalytics } = require(mixpanelMockPath);
    MockExpoMixpanelAnalytics.reset();
    config.analytics.mixpanelProjectToken = originalToken;
    delete require.cache[analyticsModulePath];
    (global as unknown as GlobalWithDev).__DEV__ = originalDevFlag;
  });

  it("does not instantiate mixpanel when no project token is configured", () => {
    const { MockExpoMixpanelAnalytics } = loadAnalytics({
      token: "",
      dev: false,
    });

    expect(MockExpoMixpanelAnalytics.instances.length).toBe(0);
  });

  it("forwards identify calls to the mixpanel client when configured", () => {
    const { analytics, MockExpoMixpanelAnalytics } = loadAnalytics({
      token: "mixpanel-token-123",
      dev: false,
    });

    analytics.identify("user-42");

    expect(MockExpoMixpanelAnalytics.instances.length).toBe(1);
    const instance = MockExpoMixpanelAnalytics.instances[0];
    expect(instance.token).toBe("mixpanel-token-123");
    expect(instance.identifyCalls).toEqual(["user-42"]);
  });

  it("sends tracking events to mixpanel outside of development mode", async () => {
    const { analytics, MockExpoMixpanelAnalytics } = loadAnalytics({
      token: "mixpanel-production",
      dev: false,
    });

    await analytics.track("event_name", { answer: 42 });

    expect(MockExpoMixpanelAnalytics.instances.length).toBe(1);
    const instance = MockExpoMixpanelAnalytics.instances[0];
    expect(instance.trackCalls).toEqual([
      { name: "event_name", props: { answer: 42 } },
    ]);
  });

  it("skips tracking events when running in development mode", async () => {
    const { analytics, MockExpoMixpanelAnalytics } = loadAnalytics({
      token: "mixpanel-dev",
      dev: true,
    });

    await analytics.track("event_name", { answer: 7 });

    expect(MockExpoMixpanelAnalytics.instances.length).toBe(1);
    const instance = MockExpoMixpanelAnalytics.instances[0];
    expect(instance.trackCalls).toEqual([]);
  });
});
