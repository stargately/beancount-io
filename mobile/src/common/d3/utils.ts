export function generateTicks(min: number, max: number, count: number) {
  if (count <= 0) {
    return [];
  }
  if (count === 1) {
    return [min];
  }
  const step = (max - min) / (count - 1);
  const ticks = [];
  for (let i = 0; i < count; i++) {
    ticks.push(min + step * i);
  }
  return ticks;
}
