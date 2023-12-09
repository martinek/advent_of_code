import { SUM } from "../utils/helpers.js";
import Task, { TaskPartSolution } from "../utils/task.js";

const parseReading = (input: string): number[] => input.trim().split(" ").map(Number);

const getNext = (numbers: number[]): number[] => {
  let [prev, ...nums] = numbers;
  return nums.reduce<number[]>((acc, n) => {
    acc.push(n - prev);
    prev = n;
    return acc;
  }, []);
};
const resolveReading = (reading: number[]): number => {
  const stack = [reading];

  while (!stack[0].every((n) => n === 0)) {
    stack.unshift(getNext(stack[0]));
  }

  let n = 0;
  stack.shift();
  while (stack.length > 0) {
    const r = stack.shift()!;
    n = r[r.length - 1] + n;
  }

  return n;
};

const resolveReading2 = (reading: number[]): number => {
  const stack = [reading];

  while (!stack[0].every((n) => n === 0)) {
    stack.unshift(getNext(stack[0]));
  }

  let n = 0;
  stack.shift();
  while (stack.length > 0) {
    const r = stack.shift()!;
    n = r[0] - n;
  }

  return n;
};

const part1: TaskPartSolution = (input) => {
  const readings = input.split("\n").map(parseReading);
  return SUM(readings.map(resolveReading));
};
const part2: TaskPartSolution = (input) => {
  const readings = input.split("\n").map(parseReading);
  return SUM(readings.map(resolveReading2));
};

const task = new Task(2023, 9, part1, part2, {
  part1: {
    input: `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`,
    result: "114",
  },
  part2: {
    input: `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`,
    result: "2",
  },
});

export default task;

// Start ~6:33, end 6:53
