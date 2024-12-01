import crypto from "crypto-js";
import Task, { TaskPartSolution } from "../utils/task.js";

const part1: TaskPartSolution = (input) => {
  let i = -1;
  while (true) {
    i++;
    const hash = crypto.MD5(input + i.toString());
    console.log(hash);

    break;
  }
};
const part2: TaskPartSolution = (input) => "";

const task = new Task(2015, 4, part1, part2, {
  part1: {
    input: `abcdef`,
    result: "609043",
  },
  part2: {
    input: ``,
    result: "",
  },
});

export default task;
