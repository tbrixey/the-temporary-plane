export default function nextLevel(level: number) {
  const exponent = 1.5;
  const baseXP = 100;
  return Math.floor(baseXP * level ** exponent);
}
