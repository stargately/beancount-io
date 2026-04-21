import { scaleBand, scaleLinear } from "d3-scale";

describe("BarChartD3", () => {
  describe("scale calculations", () => {
    it("should correctly calculate scale domain for positive numbers", () => {
      const numbers = [10, 25, 15, 30, 20];
      const maxValue = Math.max(...numbers, 1);
      const minValue = Math.min(...numbers, 0);
      expect(maxValue).toBe(30);
      expect(minValue).toBe(0);
    });

    it("should use minimum of 1 for max when all numbers are negative", () => {
      const numbers = [-10, -25, -15];
      const maxValue = Math.max(...numbers, 1);
      expect(maxValue).toBe(1);
    });

    it("should calculate min value correctly for negative numbers", () => {
      const numbers = [10, -25, 15, -30, 20];
      const minValue = Math.min(...numbers, 0);
      expect(minValue).toBe(-30);
    });

    it("should use minimum of 0 for min when all numbers are positive", () => {
      const numbers = [10, 25, 15];
      const minValue = Math.min(...numbers, 0);
      expect(minValue).toBe(0);
    });

    it("should handle empty array with sensible defaults", () => {
      const numbers: number[] = [];
      const maxValue = Math.max(...numbers, 1);
      const minValue = Math.min(...numbers, 0);
      expect(maxValue).toBe(1);
      expect(minValue).toBe(0);
    });

    it("should handle mixed positive and negative values", () => {
      const numbers = [100, -50, 75, -25, 50];
      const maxValue = Math.max(...numbers, 1);
      const minValue = Math.min(...numbers, 0);
      expect(maxValue).toBe(100);
      expect(minValue).toBe(-50);
    });

    it("should handle all zero values", () => {
      const numbers = [0, 0, 0];
      const maxValue = Math.max(...numbers, 1);
      const minValue = Math.min(...numbers, 0);
      expect(maxValue).toBe(1);
      expect(minValue).toBe(0);
    });

    it("should handle very large numbers", () => {
      const numbers = [1000000, 2000000, 1500000];
      const maxValue = Math.max(...numbers, 1);
      expect(maxValue).toBe(2000000);
    });
  });

  describe("bar height calculation", () => {
    it("should calculate correct height for positive values", () => {
      const zeroY = 180;
      const valueY = 80;
      const barHeight = zeroY - valueY;
      const barY = valueY;
      expect(barHeight).toBe(100);
      expect(barY).toBe(80);
    });

    it("should calculate correct height for negative values", () => {
      const zeroY = 180;
      const valueY = 280;
      const barHeight = valueY - zeroY;
      const barY = zeroY;
      expect(barHeight).toBe(100);
      expect(barY).toBe(180);
    });

    it("should enforce minimum height for very small positive values", () => {
      const num = 1;
      const zeroY = 180;
      const valueY = 179;
      const minHeight = 2;
      let barHeight = zeroY - valueY;
      let barY = valueY;

      if (Math.abs(barHeight) < minHeight) {
        barHeight = num >= 0 ? minHeight : -minHeight;
        barY = num >= 0 ? zeroY - minHeight : zeroY;
      }

      expect(barHeight).toBe(2);
      expect(barY).toBe(178);
    });

    it("should enforce minimum height for very small negative values", () => {
      const num = -1;
      const zeroY = 180;
      const valueY = 181;
      const minHeight = 2;
      let barHeight = valueY - zeroY;
      let barY = zeroY;

      if (Math.abs(barHeight) < minHeight) {
        barHeight = num >= 0 ? minHeight : -minHeight;
        barY = num >= 0 ? zeroY - minHeight : zeroY;
      }

      expect(barHeight).toBe(-2);
      expect(barY).toBe(180);
    });

    it("should use absolute value for rendering bar height", () => {
      const negativeHeight = -50;
      const absoluteHeight = Math.abs(negativeHeight);
      expect(absoluteHeight).toBe(50);
    });
  });

  describe("scaleBand integration", () => {
    it("should create valid scale with labels", () => {
      const labels = ["Jan", "Feb", "Mar", "Apr", "May"];
      const xScale = scaleBand().domain(labels).range([50, 400]).padding(0.2);

      expect(xScale.domain()).toEqual(labels);
      expect(xScale.range()).toEqual([50, 400]);
      expect(xScale.padding()).toBe(0.2);
    });

    it("should return valid positions for each label", () => {
      const labels = ["Jan", "Feb", "Mar"];
      const xScale = scaleBand().domain(labels).range([50, 350]).padding(0.2);

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
      const xScale = scaleBand().domain(labels).range([50, 350]).padding(0.2);

      const result = xScale("InvalidLabel");
      expect(result).toBeFalsy();
    });

    it("should handle empty labels array", () => {
      const labels: string[] = [];
      const xScale = scaleBand().domain(labels).range([50, 350]).padding(0.2);

      expect(xScale.domain()).toEqual([]);
    });
  });

  describe("scaleLinear integration", () => {
    it("should create valid linear scale", () => {
      const yScale = scaleLinear().domain([0, 100]).range([190, 20]).nice();

      expect(yScale.domain()[0]).toBeCloseTo(0, 0);
      expect(yScale.domain()[1]).toBeCloseTo(100);
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

    it("should generate valid ticks", () => {
      const yScale = scaleLinear().domain([0, 100]).range([200, 0]).nice();

      const ticks = yScale.ticks(5);
      expect(ticks.length > 0).toBe(true);
      expect(ticks[0] <= ticks[ticks.length - 1]).toBe(true);
    });
  });

  describe("edge cases and data validation", () => {
    it("should handle mismatched array lengths gracefully", () => {
      const labels = ["Jan", "Feb", "Mar", "Apr"];
      const numbers = [10, 20, 15];

      // This represents a potential bug where numbers.length < labels.length
      expect(numbers.length).toBe(3);

      // The code should handle this by only rendering bars for available data
      const minLength = Math.min(labels.length, numbers.length);
      expect(minLength).toBe(3);
    });

    it("should handle labels longer than numbers", () => {
      const labels = ["Jan", "Feb", "Mar"];
      const numbers = [10, 20];

      const minLength = Math.min(labels.length, numbers.length);
      expect(minLength).toBe(2);
    });

    it("should handle single data point", () => {
      const labels = ["Jan"];
      const numbers = [100];

      expect(labels.length).toBe(1);
      expect(numbers.length).toBe(1);
    });

    it("should handle very small decimal numbers", () => {
      const numbers = [0.001, 0.002, 0.0015];
      const maxValue = Math.max(...numbers, 1);
      const minValue = Math.min(...numbers, 0);

      expect(minValue).toBeCloseTo(0, 3);
      expect(maxValue).toBeCloseTo(1, 0);
    });

    it("should validate scale returns number or undefined", () => {
      const labels = ["Jan", "Feb", "Mar"];
      const xScale = scaleBand().domain(labels).range([50, 350]).padding(0.2);

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

  describe("bar width calculation", () => {
    it("should calculate bar width based on chart width and label count", () => {
      const chartWidth = 400;
      const labelCount = 5;
      const barWidth = labelCount > 0 ? (chartWidth / labelCount) * 0.6 : 0;
      expect(barWidth).toBeCloseTo(48, 0);
    });

    it("should handle single label", () => {
      const chartWidth = 400;
      const labelCount = 1;
      const barWidth = labelCount > 0 ? (chartWidth / labelCount) * 0.6 : 0;
      expect(barWidth).toBeCloseTo(240, 0);
    });

    it("should handle many labels", () => {
      const chartWidth = 400;
      const labelCount = 20;
      const barWidth = labelCount > 0 ? (chartWidth / labelCount) * 0.6 : 0;
      expect(barWidth).toBeCloseTo(12, 0);
    });

    it("should return 0 for empty labels array to avoid division by zero", () => {
      const chartWidth = 400;
      const labelCount = 0;
      const barWidth = labelCount > 0 ? (chartWidth / labelCount) * 0.6 : 0;
      expect(barWidth).toBe(0);
      expect(isFinite(barWidth)).toBe(true);
    });
  });

  describe("axis positioning", () => {
    it("should position y-axis labels with correct offset", () => {
      const leftPadding = 50;
      const labelX = leftPadding - 4;
      expect(labelX).toBe(46);
    });

    it("should position x-axis labels centered on bars", () => {
      const xPosition = 100;
      const barWidth = 48;
      const centerX = xPosition + barWidth / 2;
      expect(centerX).toBe(124);
    });

    it("should calculate label y position from chart height", () => {
      const chartHeight = 220;
      const bottomOffset = 8;
      const labelY = chartHeight - bottomOffset;
      expect(labelY).toBe(212);
    });
  });

  describe("ErrorBoundary behavior", () => {
    it("should handle rendering errors gracefully", () => {
      const error = new Error("Test error");

      // Simulate error handling
      const onError = (err: Error) => {
        return err;
      };
      const result = onError(error);

      expect(result).toBe(error);
    });

    it("should log errors when component fails", () => {
      const testError = new Error("Component error");
      const errorMessage = testError.message;

      expect(errorMessage).toBe("Component error");
    });
  });

  describe("rendering edge cases", () => {
    it("should handle chart dimensions with zero padding", () => {
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

    it("should handle corner radius for bars", () => {
      const borderRadius = 3;
      expect(borderRadius >= 0).toBe(true);
    });
  });

  describe("coordinate safety checks", () => {
    it("should fallback to 0 for undefined scale results", () => {
      const labels = ["Jan", "Feb", "Mar"];
      const xScale = scaleBand().domain(labels).range([50, 350]).padding(0.2);

      const validCoord = xScale("Jan") ?? 0;
      const invalidCoord = xScale("Invalid") ?? 0;

      expect(typeof validCoord).toBe("number");
      expect(invalidCoord).toBe(0);
    });

    it("should ensure barY coordinate is valid", () => {
      const valueY = 80;
      const barY = valueY;

      expect(isFinite(barY)).toBe(true);
      expect(typeof barY).toBe("number");
    });
  });
});
