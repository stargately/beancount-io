import {
  AddTransactionCallback,
  SelectedAssets,
  getGlobalFn,
} from "../globalFnFactory";

describe("globalFnFactory helpers", () => {
  afterEach(() => {
    SelectedAssets.deleteFn();
    AddTransactionCallback.deleteFn();
  });

  it("stores and retrieves callbacks with SelectedAssets", () => {
    const handler = () => 42;
    SelectedAssets.setFn(handler);

    const stored = SelectedAssets.getFn();
    expect(stored).toBe(handler);
    expect(SelectedAssets.hasFn()).toBe(true);

    SelectedAssets.deleteFn();
    expect(SelectedAssets.getFn()).toBe(undefined);
    expect(SelectedAssets.hasFn()).toBe(false);
  });

  it("allows retrieving callbacks via getGlobalFn", async () => {
    const callback = async (): Promise<void> => {
      await Promise.resolve("done");
    };
    AddTransactionCallback.setFn(callback);

    const lookedUp = getGlobalFn<typeof callback>("AddTransactionCallback");
    expect(lookedUp).toBe(callback);
    await lookedUp?.();
  });

  it("returns undefined for non-existent keys", () => {
    const result = getGlobalFn("NonExistentKey");
    expect(result).toBe(undefined);
  });

  it("can store multiple different callbacks", () => {
    const callback1 = (value: string) => console.log(value);
    const callback2 = async () => Promise.resolve();

    SelectedAssets.setFn(callback1);
    AddTransactionCallback.setFn(callback2);

    expect(SelectedAssets.getFn()).toBe(callback1);
    expect(AddTransactionCallback.getFn()).toBe(callback2);
  });

  it("overwrites previous callback when setting a new one", () => {
    const callback1 = (value: string) => console.log("first", value);
    const callback2 = (value: string) => console.log("second", value);

    SelectedAssets.setFn(callback1);
    expect(SelectedAssets.getFn()).toBe(callback1);

    SelectedAssets.setFn(callback2);
    expect(SelectedAssets.getFn()).toBe(callback2);
    expect(SelectedAssets.getFn()).not.toBe(callback1);
  });
});
