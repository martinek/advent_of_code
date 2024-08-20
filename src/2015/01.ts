import Task, { TaskPartSolution } from "../utils/task.js";

const part1: TaskPartSolution = (input) => {
  return input
    .split("")
    .reduce((floor, char) => {
      return floor + (char === "(" ? 1 : -1);
    }, 0)
    .toString();
};
const part2: TaskPartSolution = (input) => {
  let floor = 0;
  for (let i = 0; i < input.length; i++) {
    floor += input[i] === "(" ? 1 : -1;
    if (floor === -1) {
      return (i + 1).toString();
    }
  }
  return "never";
};

const task = new Task(2015, 1, part1, part2, {
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
