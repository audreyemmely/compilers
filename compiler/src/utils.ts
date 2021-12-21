export function to4d(n: number): string {
  const s = '000' + n;
  return s.substring(s.length - 4);
}
