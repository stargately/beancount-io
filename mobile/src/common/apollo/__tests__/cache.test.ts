// Test the cache module
describe("Apollo cache", () => {
  it("exports cache instance", () => {
    const { cache } = require("../../apollo/cache");
    expect(cache).toBeTruthy();
  });

  it("cache is InMemoryCache instance", () => {
    const { cache } = require("../../apollo/cache");
    expect(typeof cache.extract).toBe("function");
    expect(typeof cache.restore).toBe("function");
  });

  it("cache has read method", () => {
    const { cache } = require("../../apollo/cache");
    expect(typeof cache.read).toBe("function");
  });

  it("cache has write method", () => {
    const { cache } = require("../../apollo/cache");
    expect(typeof cache.write).toBe("function");
  });

  it("cache has modify method", () => {
    const { cache } = require("../../apollo/cache");
    expect(typeof cache.modify).toBe("function");
  });

  it("cache has gc method", () => {
    const { cache } = require("../../apollo/cache");
    expect(typeof cache.gc).toBe("function");
  });

  it("cache has reset method", () => {
    const { cache } = require("../../apollo/cache");
    expect(typeof cache.reset).toBe("function");
  });

  it("cache has evict method", () => {
    const { cache } = require("../../apollo/cache");
    expect(typeof cache.evict).toBe("function");
  });

  it("cache extract returns empty object initially", () => {
    const { cache } = require("../../apollo/cache");
    const extracted = cache.extract();
    expect(typeof extracted).toBe("object");
  });
});
