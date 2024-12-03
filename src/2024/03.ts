import Task, { TaskPartSolution } from "../utils/task.js";

const part1: TaskPartSolution = (input) => {
  const matches = input.match(/mul\(\d+\,\d+\)/g);
  const res = matches?.reduce((acc, match) => {
    const [a, b] = match.replace("mul(", "").replace(")", "").split(",").map(Number);
    acc += a * b;
    return acc;
  }, 0);
  return res;
};
const part2: TaskPartSolution = (input) => {
  const matches = input.match(/(mul\(\d+\,\d+\))|(do\(\))|don't\(\)/g);
  let enabled = true;
  const res = matches?.reduce((acc, match) => {
    if (match === "do()") {
      enabled = true;
      return acc;
    }
    if (match === "don't()") {
      enabled = false;
      return acc;
    }
    if (!enabled) {
      return acc;
    }
    const [a, b] = match.replace("mul(", "").replace(")", "").split(",").map(Number);
    acc += a * b;
    return acc;
  }, 0);
  return res;
};

const task = new Task(2024, 3, part1, part2, {
  part1: {
    input: `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`,
    result: "161",
  },
  part2: {
    input: `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`,
    result: "48",
  },
});

export default task;
