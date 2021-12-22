export function to4d(n: number, white?: boolean): string {
  const s = white ? '   ' + n : '000' + n;
  return s.substring(s.length - 4);
}
