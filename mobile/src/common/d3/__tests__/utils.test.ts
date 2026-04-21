import { generateTicks } from "../utils";

describe("generateTicks", () => {
  it("generates evenly spaced ticks between min and max", () => {
    const result = generateTicks(0, 100, 5);
    expect(result).toEqual([0, 25, 50, 75, 100]);
  });

  it("handles negative ranges", () => {
    const result = generateTicks(-100, 0, 5);
    expect(result).toEqual([-100, -75, -50, -25, 0]);
  });

  it("handles ranges crossing zero", () => {
    const result = generateTicks(-50, 50, 5);
    expect(result).toEqual([-50, -25, 0, 25, 50]);
  });

  it("generates single tick when count is 1", () => {
    const result = generateTicks(0, 100, 1);
    expect(result).toEqual([0]);
  });

  it("generates two ticks for count of 2", () => {
    const result = generateTicks(0, 100, 2);
    expect(result).toEqual([0, 100]);
  });

  it("handles decimal values", () => {
    const result = generateTicks(0, 1, 3);
    expect(result).toEqual([0, 0.5, 1]);
  });

  it("handles same min and max values", () => {
    const result = generateTicks(50, 50, 5);
    expect(result).toEqual([50, 50, 50, 50, 50]);
  });

  it("handles reversed range (max less than min)", () => {
    const result = generateTicks(100, 0, 5);
    expect(result).toEqual([100, 75, 50, 25, 0]);
  });

  it("handles large ranges", () => {
    const result = generateTicks(0, 1000000, 3);
    expect(result).toEqual([0, 500000, 1000000]);
  });

  it("handles very small ranges", () => {
    const result = generateTicks(0, 0.001, 3);
    expect(result[0]).toBeCloseTo(0);
    expect(result[1]).toBeCloseTo(0.0005);
    expect(result[2]).toBeCloseTo(0.001);
  });

  it("generates correct number of ticks", () => {
    const count = 10;
    const result = generateTicks(0, 100, count);
    expect(result.length).toBe(count);
  });

  it("handles negative to positive range with many ticks", () => {
    const result = generateTicks(-100, 100, 9);
    expect(result).toEqual([-100, -75, -50, -25, 0, 25, 50, 75, 100]);
  });

  it("handles zero count gracefully", () => {
    const result = generateTicks(0, 100, 0);
    expect(result.length).toBe(0);
  });

  it("handles negative count gracefully", () => {
    const result = generateTicks(0, 100, -5);
    expect(result.length).toBe(0);
  });

  it("handles fractional step values", () => {
    const result = generateTicks(0, 3, 4);
    expect(result[0]).toBeCloseTo(0);
    expect(result[1]).toBeCloseTo(1);
    expect(result[2]).toBeCloseTo(2);
    expect(result[3]).toBeCloseTo(3);
  });
});
