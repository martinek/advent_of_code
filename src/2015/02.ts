import Task, { TaskPartSolution } from "../utils/task.js";

const part1: TaskPartSolution = (input) => {
  const rows = input.split("\n").map((r) => r.split("x").map((a) => Number(a)));
  return rows.reduce((total, [a, b, c]) => {
    const sides = [a * b, b * c, a * c];
    return total + Math.min(...sides) + (sides[0] + sides[1] + sides[2]) * 2;
  }, 0);
};
const part2: TaskPartSolution = (input) => {
  const rows = input.split("\n").map((r) => r.split("x").map((a) => Number(a)));
  return rows.reduce((total, [a, b, c]) => {
    const ribbon = (a + b + c - Math.max(a, b, c)) * 2;
    const bow = a * b * c;
    return total + ribbon + bow;
  }, 0);
};

const task = new Task(2015, 2, part1, part2, {
  part1: {
    input: ``,
    result: "",
  },
  part2: {
    input: ``,
    result: "",
  },
});

export default task;

// 52885296907433
// 52885384955882
