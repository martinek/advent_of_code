import child from "node:child_process";

/**
 * Left pad
 */
export const lPad = (str: string, count: number, char = " ") => {
  return new Array(Math.max(count - str.length, 0)).fill(char).join("") + str;
};

/**
 * Greatest common divisor of 2 integers
 */
export function gcd2(a: number, b: number) {
  if (!b) return b === 0 ? a : NaN;
  return gcd2(b, a % b);
}

/**
 * Greatest common divisor of a list of integers
 */
export function gcd(array: number[]) {
  var n = 0;
  for (var i = 0; i < array.length; ++i) n = gcd2(array[i], n);
  return n;
}

/**
 * Least common multiple of 2 integers
 */
export function lcm2(a: number, b: number) {
  //
  return (a * b) / gcd2(a, b);
}

/**
 * Least common multiple of a list of integers
 */
export function lcm(array: number[]) {
  var n = 1;
  for (var i = 0; i < array.length; ++i) n = lcm2(array[i], n);
  return n;
}

export const SUM = (numbers: number[]) => numbers.reduce((acc, n) => acc + n, 0);
export const PROD = (numbers: number[]) => numbers.reduce((acc, n) => acc * n, 1);

export const isPresent = <U extends any>(a: U | null | undefined): a is U => {
  if (a === null || a === undefined) return false;
  return true;
};

export const COLOR = {
  Reset: "\x1b[0m",
  Bright: "\x1b[1m",
  Dim: "\x1b[2m",
  Underscore: "\x1b[4m",
  Blink: "\x1b[5m",
  Reverse: "\x1b[7m",
  Hidden: "\x1b[8m",
  FgBlack: "\x1b[30m",
  FgRed: "\x1b[31m",
  FgGreen: "\x1b[32m",
  FgYellow: "\x1b[33m",
  FgBlue: "\x1b[34m",
  FgMagenta: "\x1b[35m",
  FgCyan: "\x1b[36m",
  FgWhite: "\x1b[37m",
  FgGray: "\x1b[90m",
  BgBlack: "\x1b[40m",
  BgRed: "\x1b[41m",
  BgGreen: "\x1b[42m",
  BgYellow: "\x1b[43m",
  BgBlue: "\x1b[44m",
  BgMagenta: "\x1b[45m",
  BgCyan: "\x1b[46m",
  BgWhite: "\x1b[47m",
  BgGray: "\x1b[100m",
};

export const mod = (n: number, m: number): number => {
  return ((n % m) + m) % m;
};

export const pause = () => {
  child.spawnSync("read _ ", { shell: true, stdio: [0, 1, 2] });
};

export const wait = (t: number) => {
  child.spawnSync(`sleep ${t}`, { shell: true, stdio: [0, 1, 2] });
};
