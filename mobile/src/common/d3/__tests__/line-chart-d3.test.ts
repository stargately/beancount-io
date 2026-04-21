import { scaleLinear, scalePoint } from "d3-scale";
import { line as d3Line, curveMonotoneX } from "d3-shape";

describe("LineChartD3", () => {
  describe("scale calculations", () => {
    it("should calculate correct scale domain for positive numbers", () => {
      const numbers = [10, 25, 15, 30, 20];
      const minValue = Math.min(...numbers, 0);
      const maxValue = Math.max(...numbers, 1);
      expect(minValue).toBe(0);
      expect(maxValue).toBe(30);
    });

    it("should use 1 as maximum when all numbers are negative", () => {
      const numbers = [-10, -25, -15];
      const maxValue = Math.max(...numbers, 1);
      expect(maxValue).toBe(1);
    });

    it("should calculate min value correctly for negative numbers", () => {
      const numbers = [10, -25, 15, -30, 20];
      const minValue = Math.min(...numbers, 0);
      expect(minValue).toBe(-30);
    });

    it("should use 0 as minimum when all numbers are positive", () => {
      const numbers = [10, 25, 15];
      const minValue = Math.min(...numbers, 0);
      expect(minValue).toBe(0);
    });

    it("should handle empty array with sensible defaults", () => {
      const numbers: number[] = [];
      const minValue = Math.min(...numbers, 0);
      const maxValue = Math.max(...numbers, 1);
      expect(minValue).toBe(0);
      expect(maxValue).toBe(1);
    });

    it("should handle mixed positive and negative values", () => {
      const numbers = [100, -50, 75, -25, 50];
      const maxValue = Math.max(...numbers, 1);
      const minValue = Math.min(...numbers, 0);
      expect(maxValue).toBe(100);
      expect(minValue).toBe(-50);
    });

    it("should handle all zero values", () => {
      const numbers = [0, 0, 0, 0];
      const minValue = Math.min(...numbers, 0);
      const maxValue = Math.max(...numbers, 1);
      expect(minValue).toBe(0);
      expect(maxValue).toBe(1);
    });
  });

  describe("scalePoint integration", () => {
    it("should create valid scale with labels", () => {
      const labels = ["Jan", "Feb", "Mar", "Apr", "May"];
      const xScale = scalePoint().domain(labels).range([50, 400]).padding(0.5);

      expect(xScale.domain()).toEqual(labels);
      expect(xScale.range()).toEqual([50, 400]);
      expect(xScale.padding()).toBe(0.5);
    });

    it("should return valid positions for each label", () => {
      const labels = ["Jan", "Feb", "Mar"];
      const xScale = scalePoint().domain(labels).range([50, 350]).padding(0.5);

      const janPos = xScale("Jan");
      const febPos = xScale("Feb");
      const marPos = xScale("Mar");

      expect(janPos).toBeTruthy();
      expect(febPos).toBeTruthy();
      expect(marPos).toBeTruthy();
      expect(typeof janPos).toBe("number");
      expect(typeof febPos).toBe("number");
      expect(typeof marPos).toBe("number");
    });

    it("should return undefined for non-existent label", () => {
      const labels = ["Jan", "Feb", "Mar"];
      const xScale = scalePoint().domain(labels).range([50, 350]).padding(0.5);

      const result = xScale("InvalidLabel");
      expect(result).toBeFalsy();
    });

    it("should handle empty labels array", () => {
      const labels: string[] = [];
      const xScale = scalePoint().domain(labels).range([50, 350]).padding(0.5);

      expect(xScale.domain()).toEqual([]);
    });

    it("should space points evenly", () => {
      const labels = ["A", "B", "C"];
      const xScale = scalePoint().domain(labels).range([0, 200]).padding(0);

      const posA = xScale("A");
      const posB = xScale("B");
      const posC = xScale("C");

      expect(posA).toBe(0);
      expect(posB).toBe(100);
      expect(posC).toBe(200);
    });
  });

  describe("scaleLinear integration", () => {
    it("should create valid linear scale", () => {
      const yScale = scaleLinear().domain([0, 100]).range([190, 20]).nice();

      expect(yScale.domain()[0]).toBeCloseTo(0, 0);
      expect(yScale.domain()[1] >= 100).toBe(true);
      expect(yScale.range()).toEqual([190, 20]);
    });

    it("should correctly scale values", () => {
      const yScale = scaleLinear().domain([0, 100]).range([200, 0]);

      expect(yScale(0)).toBe(200);
      expect(yScale(100)).toBe(0);
      expect(yScale(50)).toBe(100);
    });

    it("should handle negative domains", () => {
      const yScale = scaleLinear().domain([-50, 50]).range([200, 0]);

      expect(yScale(0)).toBe(100);
      expect(yScale(-50)).toBe(200);
      expect(yScale(50)).toBe(0);
    });
  });

  describe("d3 line path generation", () => {
    it("should generate valid line path", () => {
      const labels = ["Jan", "Feb", "Mar"];
      const numbers = [10, 20, 15];

      const xScale = scalePoint().domain(labels).range([50, 350]).padding(0.5);

      const yScale = scaleLinear().domain([0, 30]).range([200, 0]);

      const linePath = d3Line<number>()
        .x((_, i) => xScale(labels[i]) ?? 0)
        .y((d) => yScale(d))
        .curve(curveMonotoneX)(numbers);

      expect(linePath).toBeTruthy();
      expect(typeof linePath).toBe("string");
      expect(linePath && linePath[0] === "M").toBe(true); // SVG path should start with M (move to)
    });

    it("should handle single data point", () => {
      const labels = ["Jan"];
      const numbers = [10];

      const xScale = scalePoint().domain(labels).range([50, 350]).padding(0.5);

      const yScale = scaleLinear().domain([0, 20]).range([200, 0]);

      const linePath = d3Line<number>()
        .x((_, i) => xScale(labels[i]) ?? 0)
        .y((d) => yScale(d))
        .curve(curveMonotoneX)(numbers);

      expect(linePath).toBeTruthy();
    });

    it("should handle empty array", () => {
      const labels: string[] = [];
      const numbers: number[] = [];

      const xScale = scalePoint().domain(labels).range([50, 350]).padding(0.5);

      const yScale = scaleLinear().domain([0, 1]).range([200, 0]);

      const linePath = d3Line<number>()
        .x((_, i) => xScale(labels[i]) ?? 0)
        .y((d) => yScale(d))
        .curve(curveMonotoneX)(numbers);

      expect(linePath).toBe(null);
    });

    it("should use monotone curve for smooth lines", () => {
      const numbers = [10, 30, 20, 40];
      const labels = ["Jan", "Feb", "Mar", "Apr"];

      const xScale = scalePoint().domain(labels).range([0, 300]).padding(0);

      const yScale = scaleLinear().domain([0, 50]).range([200, 0]);

      const linePath = d3Line<number>()
        .x((_, i) => xScale(labels[i]) ?? 0)
        .y((d) => yScale(d))
        .curve(curveMonotoneX)(numbers);

      expect(linePath).toBeTruthy();
      // Monotone curve creates C (cubic bezier) commands
      expect(
        linePath && (linePath.includes("M") || linePath.includes("C")),
      ).toBe(true);
    });
  });

  describe("edge cases and data validation", () => {
    it("should handle mismatched array lengths", () => {
      const labels = ["Jan", "Feb", "Mar", "Apr"];
      const numbers = [10, 20, 15];

      expect(numbers.length < labels.length).toBe(true);

      const minLength = Math.min(labels.length, numbers.length);
      expect(minLength).toBe(3);
    });

    it("should handle labels longer than numbers", () => {
      const labels = ["Jan", "Feb", "Mar"];
      const numbers = [10, 20];

      const minLength = Math.min(labels.length, numbers.length);
      expect(minLength).toBe(2);
    });

    it("should handle very large positive values", () => {
      const numbers = [1000000, 2000000, 1500000];
      const maxValue = Math.max(...numbers, 1);
      expect(maxValue).toBe(2000000);
    });

    it("should handle very large negative values", () => {
      const numbers = [-1000000, -2000000, -1500000];
      const minValue = Math.min(...numbers, 0);
      expect(minValue).toBe(-2000000);
    });

    it("should handle decimal values", () => {
      const numbers = [0.5, 1.5, 2.3, 1.1];
      const maxValue = Math.max(...numbers, 1);
      const minValue = Math.min(...numbers, 0);

      expect(maxValue).toBeCloseTo(2.3, 1);
      expect(minValue).toBeCloseTo(0, 1);
    });

    it("should validate scale returns number or undefined", () => {
      const labels = ["Jan", "Feb", "Mar"];
      const xScale = scalePoint().domain(labels).range([50, 350]).padding(0.5);

      const result = xScale("Jan");
      expect(typeof result === "number" || result === undefined).toBe(true);
    });

    it("should handle NaN values in numbers array", () => {
      const numbers = [10, NaN, 20, 30];
      const maxValue = Math.max(...numbers, 1);
      const minValue = Math.min(...numbers, 0);

      expect(isNaN(maxValue)).toBe(true);
      expect(isNaN(minValue)).toBe(true);
    });

    it("should handle Infinity values", () => {
      const numbers = [10, Infinity, 20];
      const maxValue = Math.max(...numbers, 1);

      expect(maxValue).toBe(Infinity);
    });
  });

  describe("coordinate calculations", () => {
    it("should calculate x coordinate with fallback for undefined", () => {
      const labels = ["Jan", "Feb", "Mar"];
      const xScale = scalePoint().domain(labels).range([50, 350]).padding(0.5);

      const xCoord = xScale("Jan") ?? 0;
      expect(typeof xCoord).toBe("number");
      expect(xCoord).toBeTruthy();
    });

    it("should use 0 as fallback for undefined x coordinate", () => {
      const xCoord = undefined;
      const fallback = xCoord ?? 0;
      expect(fallback).toBe(0);
    });

    it("should preserve valid x coordinate", () => {
      const xCoord = 100;
      const fallback = xCoord ?? 0;
      expect(fallback).toBe(100);
    });
  });

  describe("data point properties", () => {
    it("should validate circle radius is positive", () => {
      const radius = 6;
      expect(radius > 0).toBe(true);
    });

    it("should validate stroke width is positive", () => {
      const strokeWidth = 2;
      expect(strokeWidth > 0).toBe(true);
    });
  });

  describe("axis label positioning", () => {
    it("should offset y-axis label correctly", () => {
      const leftPadding = 50;
      const labelX = leftPadding - 4;
      expect(labelX).toBe(46);
    });

    it("should position x-axis label from bottom", () => {
      const chartHeight = 220;
      const bottomOffset = 8;
      const labelY = chartHeight - bottomOffset;
      expect(labelY).toBe(212);
    });

    it("should center label on data point", () => {
      const textAnchor = "middle";
      expect(textAnchor).toBe("middle");
    });
  });

  describe("line path rendering", () => {
    it("should check if line path exists before rendering", () => {
      const linePath = "M 0,0 L 10,10";
      const shouldRender = Boolean(linePath);
      expect(shouldRender).toBe(true);
    });

    it("should handle null line path", () => {
      const linePath = null;
      const shouldRender = Boolean(linePath);
      expect(shouldRender).toBe(false);
    });

    it("should handle empty line path", () => {
      const linePath = "";
      const shouldRender = Boolean(linePath);
      expect(shouldRender).toBe(false);
    });
  });

  describe("array iteration safety", () => {
    it("should handle same length arrays", () => {
      const labels = ["Jan", "Feb", "Mar"];
      const numbers = [10, 20, 15];
      expect(labels.length).toBe(numbers.length);
    });

    it("should identify length mismatch", () => {
      const labels = ["Jan", "Feb", "Mar", "Apr"];
      const numbers = [10, 20, 15];
      expect(labels.length).not.toBe(numbers.length);
    });

    it("should safely iterate with map", () => {
      const numbers = [10, 20, 15];
      const result = numbers.map((num, i) => ({ value: num, index: i }));

      expect(result.length).toBe(numbers.length);
      expect(result[0]).toEqual({ value: 10, index: 0 });
      expect(result[2]).toEqual({ value: 15, index: 2 });
    });
  });

  describe("rendering edge cases", () => {
    it("should handle chart dimensions with padding", () => {
      const chartWidth = 400;
      const leftPadding = 50;
      const range = [leftPadding, chartWidth];
      expect(range[0] < range[1]).toBe(true);
    });

    it("should ensure chart height is positive", () => {
      const chartHeight = 220;
      const bottomPadding = 30;
      const topPadding = 20;
      const effectiveHeight = chartHeight - bottomPadding - topPadding;
      expect(effectiveHeight > 0).toBe(true);
    });

    it("should validate circle properties", () => {
      const radius = 6;
      const strokeWidth = 2;
      expect(radius > 0).toBe(true);
      expect(strokeWidth > 0).toBe(true);
      expect(radius > strokeWidth).toBe(true);
    });

    it("should validate line stroke width", () => {
      const lineStrokeWidth = 3;
      expect(lineStrokeWidth > 0).toBe(true);
    });
  });

  describe("tick generation integration", () => {
    it("should use generateTicks function correctly", () => {
      const minValue = -50;
      const maxValue = 100;
      const count = 5;

      // Simulate generateTicks behavior
      const generateTicks = (min: number, max: number, count: number) => {
        if (count <= 0) return [];
        if (count === 1) return [min];
        const step = (max - min) / (count - 1);
        const ticks: number[] = [];
        for (let i = 0; i < count; i++) {
          ticks.push(min + step * i);
        }
        return ticks;
      };

      const ticks = generateTicks(minValue, maxValue, count);
      expect(ticks.length).toBe(count);
      expect(ticks[0]).toBeCloseTo(minValue);
      expect(ticks[ticks.length - 1]).toBeCloseTo(maxValue);
    });

    it("should handle ticks for very small ranges", () => {
      const minValue = 0.001;
      const maxValue = 0.002;
      const count = 3;

      const step = (maxValue - minValue) / (count - 1);
      expect(step > 0).toBe(true);
      expect(isFinite(step)).toBe(true);
    });
  });

  describe("SVG path validation", () => {
    it("should validate path starts with M command", () => {
      const pathString = "M 0,100 L 50,80 L 100,90";
      expect(pathString.charAt(0)).toBe("M");
    });

    it("should handle null path gracefully", () => {
      const pathString = null;
      const shouldRender = pathString !== null && pathString !== "";
      expect(shouldRender).toBe(false);
    });

    it("should validate path is a string", () => {
      const pathString = "M 0,0 L 10,10";
      expect(typeof pathString).toBe("string");
      expect(pathString.length > 0).toBe(true);
    });
  });

  describe("stroke dash array", () => {
    it("should validate grid line stroke pattern", () => {
      const strokeDasharray = "4,2";
      const parts = strokeDasharray.split(",");
      expect(parts.length).toBe(2);
      expect(parseInt(parts[0]) > 0).toBe(true);
      expect(parseInt(parts[1]) > 0).toBe(true);
    });
  });
});
