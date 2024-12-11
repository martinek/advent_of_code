import Task, { TaskPartSolution } from "../utils/task.js";

const parseInput = (input: string): number[] => input.split(" ").map(Number);

const blinkNumber = (n: number): number[] => {
  if (n === 0) {
    return [1];
  } else if (n.toString().length % 2 === 0) {
    const s = n.toString();
    const a = s.slice(0, s.length / 2);
    const b = s.slice(s.length / 2);
    return [Number(a), Number(b)];
  } else {
    return [n * 2024];
  }
};

const blink = (nums: number[]): number[] => {
  const newNums = [];
  for (const n of nums) {
    newNums.push(...blinkNumber(n));
  }
  return newNums;
};

const part1: TaskPartSolution = (input) => {
  let nums = parseInput(input);
  for (let i = 0; i < 25; i++) {
    nums = blink(nums);
  }
  return nums.length;
};

const cache = new Map<string, number>();
const blink2 = (nums: number[], count: number): number => {
  if (count === 0) return nums.length;
  const cacheKey = nums.join(",") + "_" + count.toString();
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  let total = 0;
  for (const n of nums) {
    const res = blinkNumber(n);
    total += blink2(res, count - 1);
  }
  cache.set(cacheKey, total);
  return total;
};

const part2: TaskPartSolution = (input) => {
  const nums = parseInput(input);
  return blink2(nums, 75);
};

const task = new Task(2024, 11, part1, part2, {
  part1: {
    input: `125 17`,
    result: "55312",
  },
  part2: {
    input: `125 17`,
    result: "55312",
  },
});

export default task;

// 203228 - low
// 240881099269061 - low
// 240884656550923
// 365890515339965 - high
