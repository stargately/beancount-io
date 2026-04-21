import { createSession } from "../session-utils";

const createTokenWithPayload = (payload: Record<string, unknown>) => {
  const header = Buffer.from(
    JSON.stringify({ alg: "HS256", typ: "JWT" }),
  ).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${header}.${body}.signature`;
};

describe("createSession", () => {
  it("extracts the user id from the JWT subject", () => {
    const token = createTokenWithPayload({ sub: "user-123" });
    expect(createSession(token)).toEqual({
      userId: "user-123",
      authToken: token,
    });
  });

  it("works with tokens that include additional claims", () => {
    const token = createTokenWithPayload({ sub: "user-456", role: "admin" });
    expect(createSession(token)).toEqual({
      userId: "user-456",
      authToken: token,
    });
  });

  it("throws error for invalid token format", () => {
    expect(() => createSession("invalid-token")).toThrow();
  });

  it("throws error for token without sub claim", () => {
    const token = createTokenWithPayload({ role: "admin" });
    expect(() => createSession(token)).toThrow();
  });

  it("handles numeric sub claim", () => {
    const token = createTokenWithPayload({ sub: 12345 });
    const session = createSession(token);
    expect(session.userId).toBe("12345");
    expect(session.authToken).toBe(token);
  });
});
