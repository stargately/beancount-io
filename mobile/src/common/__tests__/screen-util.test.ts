interface ScreenUtilModule {
  ScreenWidth: number;
  ScreenHeight: number;
  statusBarHeight: number;
  navigationBarHeight: number;
  onePx: number;
  contentPadding: number;
}

interface MockDimensions {
  get: (dimension: string) => { width: number; height: number };
}

interface MockPixelRatio {
  get: () => number;
}

interface MockPlatform {
  OS: "ios" | "android";
}

interface MockStatusBar {
  currentHeight: number | null;
}

describe("screen-util", () => {
  let screenUtil: ScreenUtilModule;
  let mockDimensions: MockDimensions;
  let mockPixelRatio: MockPixelRatio;
  let mockPlatform: MockPlatform;
  let mockStatusBar: MockStatusBar;

  beforeEach(() => {
    // Mock React Native modules
    mockDimensions = {
      get: (dimension: string) => {
        if (dimension === "window") {
          return { width: 375, height: 812 }; // iPhone X dimensions
        }
        return { width: 0, height: 0 };
      },
    };

    mockPixelRatio = {
      get: () => 2,
    };

    mockPlatform = {
      OS: "ios",
    };

    mockStatusBar = {
      currentHeight: 24,
    };

    // Mock require for react-native
    const Module = require("module");
    const originalRequire = Module.prototype.require;

    Module.prototype.require = function (
      this: NodeModule,
      id: string,
    ): unknown {
      if (id === "react-native") {
        return {
          Dimensions: mockDimensions,
          PixelRatio: mockPixelRatio,
          Platform: mockPlatform,
          StatusBar: mockStatusBar,
        };
      }
      return originalRequire.apply(this, [id]);
    };

    // Clear cache and reload module
    const screenUtilPath = require.resolve("../screen-util");
    delete require.cache[screenUtilPath];
    screenUtil = require("../screen-util") as ScreenUtilModule;
  });

  it("exports correct screen width from Dimensions", () => {
    expect(screenUtil.ScreenWidth).toBe(375);
  });

  it("exports correct screen height from Dimensions", () => {
    expect(screenUtil.ScreenHeight).toBe(812);
  });

  it("calculates status bar height for iPhone X", () => {
    // iPhone X has ratio of 2.16 (812/375)
    expect(screenUtil.statusBarHeight).toBe(44);
  });

  it("calculates navigation bar height for iPhone X", () => {
    expect(screenUtil.navigationBarHeight).toBe(88);
  });

  it("calculates one pixel value from PixelRatio", () => {
    expect(screenUtil.onePx).toBe(0.5); // 1 / 2
  });

  it("exports content padding constant", () => {
    expect(screenUtil.contentPadding).toBe(16);
  });

  it("handles Android status bar height correctly", () => {
    mockPlatform.OS = "android";
    mockStatusBar.currentHeight = 24;

    const screenUtilPath = require.resolve("../screen-util");
    delete require.cache[screenUtilPath];
    const androidScreenUtil = require("../screen-util") as ScreenUtilModule;

    expect(androidScreenUtil.statusBarHeight).toBe(24);
  });

  it("handles Android navigation bar height correctly", () => {
    mockPlatform.OS = "android";
    mockStatusBar.currentHeight = 24;

    const screenUtilPath = require.resolve("../screen-util");
    delete require.cache[screenUtilPath];
    const androidScreenUtil = require("../screen-util") as ScreenUtilModule;

    expect(androidScreenUtil.navigationBarHeight).toBe(83); // 24 + 59
  });

  it("handles non-iPhone X iOS devices", () => {
    mockDimensions.get = (dimension: string) => {
      if (dimension === "window") {
        return { width: 375, height: 667 }; // iPhone 8 dimensions
      }
      return { width: 0, height: 0 };
    };

    const screenUtilPath = require.resolve("../screen-util");
    delete require.cache[screenUtilPath];
    const regularIOSUtil = require("../screen-util") as ScreenUtilModule;

    expect(regularIOSUtil.statusBarHeight).toBe(20);
    expect(regularIOSUtil.navigationBarHeight).toBe(64);
  });

  it("handles missing Android status bar height", () => {
    mockPlatform.OS = "android";
    mockStatusBar.currentHeight = null;

    const screenUtilPath = require.resolve("../screen-util");
    delete require.cache[screenUtilPath];
    const androidScreenUtil = require("../screen-util") as ScreenUtilModule;

    expect(androidScreenUtil.statusBarHeight).toBe(0);
    expect(androidScreenUtil.navigationBarHeight).toBe(59); // 0 + 59
  });

  it("handles different pixel ratios", () => {
    mockPixelRatio.get = () => 3;

    const screenUtilPath = require.resolve("../screen-util");
    delete require.cache[screenUtilPath];
    const highDpiUtil = require("../screen-util") as ScreenUtilModule;

    expect(highDpiUtil.onePx).toBeCloseTo(0.333, 3);
  });

  it("handles very low pixel ratio", () => {
    mockPixelRatio.get = () => 1;

    const screenUtilPath = require.resolve("../screen-util");
    delete require.cache[screenUtilPath];
    const lowDpiUtil = require("../screen-util") as ScreenUtilModule;

    expect(lowDpiUtil.onePx).toBe(1);
  });
});
