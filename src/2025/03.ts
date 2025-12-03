import Task, { TaskPartSolution } from "../utils/task.js";

const rowJoltage = (row: string): number => {
  const digits = row.split("").map(Number);
  const first = Math.max(...digits.slice(0, digits.length - 1));
  const firstIndex = digits.indexOf(first);
  const last = Math.max(...digits.slice(firstIndex + 1));
  const num = Number(`${first}${last}`);
  return num;
};

const D_COUNT = 12;
const rowJoltage2 = (row: string): number => {
  // console.log("================================");
  // console.log("row", row);
  // console.log("================================");
  const digits = row.split("").map(Number);
  const r: number[] = [];
  for (let i = 0; i < D_COUNT; i++) {
    // console.log(`[${i}] digits (${digits.length})`, digits);
    let lastI: number | undefined = -(D_COUNT - i - 1);
    if (lastI === -0) lastI = undefined;
    // console.log("slice", lastI);
    const available = digits.slice(0, lastI);
    // console.log("check", digits.length, D_COUNT - i);
    // if (digits.length === D_COUNT - i) {
    //   r.push(...available);
    //   break;
    // }
    // console.log("available", available);
    const n = Math.max(...available);
    // console.log("n", n);
    r.push(n);
    const nIndex = digits.indexOf(n);
    digits.splice(0, nIndex + 1);
  }
  const num = Number(r.join(""));
  // console.log("num", num);
  return num;
};

const part1: TaskPartSolution = (input) => {
  const sum = input.split("\n").reduce((acc, line) => {
    const joltage = rowJoltage(line);
    return acc + joltage;
  }, 0);
  return sum;
};
const part2: TaskPartSolution = (input) => {
  const sum = input.split("\n").reduce((acc, line) => {
    const joltage = rowJoltage2(line);
    return acc + joltage;
  }, 0);
  return sum;
};

const task = new Task(2025, 3, part1, part2, {
  part1: {
    input: `987654321111111
811111111111119
234234234234278
818181911112111`,
    result: "357",
  },
  part2: {
    input: `987654321111111
811111111111119
234234234234278
818181911112111`,
    result: "3121910778619",
  },
});

export default task;
