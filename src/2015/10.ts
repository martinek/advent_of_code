import Task, { TaskPartSolution } from "../utils/task.js";

const evolve = (input: string): string => {
  let result = "";
  let current = input[0];
  let count = 1;
  for (let i = 1; i < input.length; i++) {
    if (input[i] === current) {
      count++;
    } else {
      result += `${count}${current}`;
      current = input[i];
      count = 1;
    }
  }
  result += `${count}${current}`;
  return result;
};

const part1: TaskPartSolution = (input) => {
  let result = input;
  for (let i = 0; i < 40; i++) {
    result = evolve(result);
  }
  return result.length.toString();
};
const part2: TaskPartSolution = (input) => {
  let result = input;
  for (let i = 0; i < 50; i++) {
    result = evolve(result);
  }
  return result.length.toString();
};

const task = new Task(
  2015,
  10,
  part1,
  part2,
  {
    part1: {
      input: ``,
      result: "",
    },
    part2: {
      input: ``,
      result: "",
    },
  },
  "1321131112"
);

export default task;
