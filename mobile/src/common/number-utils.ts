export const shortNumber = (number: number | string): string => {
  // Convert string to number if needed
  const num = typeof number === "string" ? parseFloat(number) : number;

  // Handle invalid numbers
  if (isNaN(num)) {
    return number.toString();
  }

  // Handle negative numbers
  const isNegative = num < 0;
  const absNum = Math.abs(num);

  if (absNum < 1000) {
    return num.toFixed(1);
  }

  const suffixes = [
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "B" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "Q" },
  ];

  for (let i = suffixes.length - 1; i >= 0; i--) {
    const { value, symbol } = suffixes[i];
    if (absNum >= value) {
      const shortNum = absNum / value;
      // If the result is a whole number, don't show decimal
      if (shortNum === Math.floor(shortNum)) {
        return (isNegative ? "-" : "") + shortNum.toString() + symbol;
      }
      // Otherwise show one decimal place
      return (isNegative ? "-" : "") + shortNum.toFixed(1) + symbol;
    }
  }

  return num.toFixed(1);
};
