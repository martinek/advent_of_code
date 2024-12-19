import Task, { TaskPartSolution } from "../utils/task.js";

interface Input {
  parts: string[];
  targets: string[];
}

const parseInput = (input: string): Input => {
  const [a, b] = input.split("\n\n");
  return {
    parts: a.trim().split(", "),
    targets: b.split("\n").map((x) => x.trim()),
  };
};

const CACHE = new Map<string, boolean>();
const isValid = (pattern: string, parts: string[]): boolean => {
  if (CACHE.has(pattern)) return CACHE.get(pattern)!;
  const candidates = parts.filter((x) => pattern.startsWith(x));
  if (candidates.length === 0) return false;

  for (const candidate of candidates) {
    const rest = pattern.slice(candidate.length);
    if (rest === "") {
      CACHE.set(pattern, true);
      return true;
    }
    if (isValid(rest, parts)) {
      CACHE.set(pattern, true);
      return true;
    }
  }
  CACHE.set(pattern, false);
  return false;
};

const part1: TaskPartSolution = (input) => {
  const { parts, targets } = parseInput(input);

  const validTargets = targets.filter((t) => {
    // console.log("target", t);
    const valid = isValid(t, parts);
    // console.log(t, valid);
    return valid;
  });

  return validTargets.length;
};

const CACHE2 = new Map<string, number>();
const combCount = (pattern: string, parts: string[]): number => {
  if (pattern === "") return 1;
  if (CACHE2.has(pattern)) return CACHE2.get(pattern)!;

  const candidates = parts.filter((x) => pattern.startsWith(x));
  if (candidates.length === 0) return 0;

  const c = candidates.reduce((acc, candidate) => {
    const rest = pattern.slice(candidate.length);
    const c = combCount(rest, parts);
    CACHE2.set(pattern, c);
    return (acc += c);
  }, 0);

  CACHE2.set(pattern, c);

  return c;
};

const part2: TaskPartSolution = (input) => {
  const { parts, targets } = parseInput(input);

  const res = targets.reduce((acc, t) => {
    const count = combCount(t, parts);
    // console.log(t, count);
    return (acc += count);
  }, 0);

  // console.log(CACHE2);

  return res;
};

const task = new Task(2024, 19, part1, part2, {
  part1: {
    input: `r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`,
    result: "6",
  },
  part2: {
    input: `r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`,
    result: "16",
  },
});

export default task;
