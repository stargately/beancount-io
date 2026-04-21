import type { ReactiveVar } from "@apollo/client";

describe("createPersistentVar", () => {
  let createPersistentVar: typeof import("../persistent-var").createPersistentVar;
  const apolloPath = require.resolve("@apollo/client");
  const asyncStoragePath =
    require.resolve("@react-native-async-storage/async-storage");
  let originalApolloModule: NodeModule | undefined;
  let originalAsyncStorageModule: NodeModule | undefined;

  type Listener<T> = (value: T) => void;

  const makeVarFactory = () => {
    return function makeVar<T>(initialValue: T) {
      let currentValue = initialValue;
      const listeners: Listener<T>[] = [];
      const reactiveVar = ((...args: [T?]) => {
        if (args.length === 0) {
          return currentValue;
        }
        currentValue = args[0] as T;
        listeners.slice().forEach((listener) => listener(currentValue));
        return currentValue;
      }) as ReactiveVar<T>;
      reactiveVar.onNextChange = (listener: Listener<T>): (() => void) => {
        listeners.push(listener);
        return () => {
          const index = listeners.indexOf(listener);
          if (index > -1) {
            listeners.splice(index, 1);
          }
        };
      };
      return reactiveVar;
    };
  };

  const asyncStorageMock = {
    getItem: async (_key: string) => null as string | null,
    setItem: async (_key: string, _value: string) => {},
  };

  beforeEach(() => {
    originalApolloModule = require.cache[apolloPath];
    originalAsyncStorageModule = require.cache[asyncStoragePath];

    asyncStorageMock.getItem = async (_key: string) => null;
    asyncStorageMock.setItem = async (_key: string, _value: string) => {};

    require.cache[apolloPath] = {
      exports: { makeVar: makeVarFactory() },
    } as NodeModule;
    require.cache[asyncStoragePath] = {
      exports: asyncStorageMock,
    } as NodeModule;

    const modulePath = require.resolve("../persistent-var");
    delete require.cache[modulePath];
    ({ createPersistentVar } = require("../persistent-var"));
  });

  afterEach(() => {
    const modulePath = require.resolve("../persistent-var");
    delete require.cache[modulePath];

    if (originalApolloModule) {
      require.cache[apolloPath] = originalApolloModule;
    } else {
      delete require.cache[apolloPath];
    }

    if (originalAsyncStorageModule) {
      require.cache[asyncStoragePath] = originalAsyncStorageModule;
    } else {
      delete require.cache[asyncStoragePath];
    }
  });

  it("loads a stored value and updates the reactive var", async () => {
    const storedValue = JSON.stringify({ user: "alice" });
    asyncStorageMock.getItem = async (key: string) =>
      key === "session" ? storedValue : null;

    const [sessionVar, loadSession] = createPersistentVar("session", {
      user: "unknown",
    });

    expect(sessionVar()).toEqual({ user: "unknown" });
    const loaded = await loadSession();
    expect(loaded).toEqual({ user: "alice" });
    expect(sessionVar()).toEqual({ user: "alice" });
  });

  it("persists changes whenever the reactive var updates", async () => {
    const writes: Array<{ key: string; value: string }> = [];
    asyncStorageMock.setItem = async (key: string, value: string) => {
      writes.push({ key, value });
    };

    const [themeVar] = createPersistentVar("theme", "light");
    themeVar("dark");
    await Promise.resolve();

    expect(writes).toEqual([{ key: "theme", value: JSON.stringify("dark") }]);
  });

  it("logs errors when storage access fails and returns null", async () => {
    const errors: Array<{ message: unknown; args: unknown[] }> = [];
    const originalError = console.error;
    console.error = ((message?: unknown, ...rest: unknown[]) => {
      errors.push({ message, args: rest });
    }) as typeof console.error;

    try {
      asyncStorageMock.getItem = async () => {
        throw new Error("boom");
      };

      const [, loadValue] = createPersistentVar("locale", "en");
      const result = await loadValue();

      expect(result).toBe(null);
      expect(
        errors.some((entry) =>
          `${entry.message}`.includes("Failed to load locale"),
        ),
      ).toBe(true);
    } finally {
      console.error = originalError;
    }
  });
});
