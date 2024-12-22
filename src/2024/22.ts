import Task, { TaskPartSolution } from "../utils/task.js";

const PRUNE = 16777216n;
const PV = PRUNE - 1n;

const step = (n: bigint): bigint => {
  let res = n;
  // mul by 64, mix, prune
  res = ((res << 6n) ^ res) & PV;
  // div by 32, mix, prune
  res = ((res >> 5n) ^ res) & PV;
  // mul 2048, mix, prune
  res = ((res << 11n) ^ res) & PV;
  return res;
};

const S_LEN = 4;
const analyze = (nums: bigint[]): Map<string, number> => {
  const prices = nums.map((n) => Number(n % 10n));
  const changes = prices.map((p, i) => (i === 0 ? 0 : p - prices[i - 1])).slice(1);
  const res = new Map<string, number>();
  for (let i = 0; i < changes.length - S_LEN; i++) {
    const key = changes.slice(i, i + S_LEN).join(",");
    if (!res.has(key)) {
      res.set(key, prices[i + S_LEN]);
    }
  }
  return res;
};

const part1: TaskPartSolution = (input) => {
  const nums = input.split("\n").map(BigInt);

  let result = nums;
  for (let i = 0; i < 2000; i++) {
    result = result.map(step);
  }

  return result.reduce((a, b) => a + b, 0n).toString();
};
const part2: TaskPartSolution = (input) => {
  const sequences = input
    .split("\n")
    .map(BigInt)
    .reduce<bigint[][]>((acc, n) => {
      const seq = [n];
      for (let i = 0; i < 2000; i++) {
        seq.push(step(seq[seq.length - 1]));
      }
      return [...acc, seq];
    }, []);

  const analysis = sequences.map((seq) => analyze(seq));
  const seq = new Array(...new Set(...analysis.flatMap((a) => a.keys())));

  let max = 0;
  seq.forEach((key) => {
    const p = analysis.map((a) => a.get(key) ?? 0).reduce((a, b) => a + b, 0);
    if (p > max) {
      max = p;
    }
  });

  return max;
};

const task = new Task(2024, 22, part1, part2, {
  part1: {
    input: `1
10
100
2024`,
    result: "37327623",
  },
  part2: {
    input: `1
10
100
2024`,
    result: "23",
  },
});

export default task;
