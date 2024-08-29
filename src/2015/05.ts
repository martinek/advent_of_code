import Task, { TaskPartSolution } from "../utils/task.js";

const part1: TaskPartSolution = (input) => {
  return input
    .split("\n")
    .filter((line) => {
      const vowels = line.match(/[aeiou]/g)?.length ?? 0;
      const doubles = line.match(/(.)\1/g)?.length ?? 0;
      const forbidden = line.match(/ab|cd|pq|xy/g) ? 1 : 0;
      const res = vowels >= 3 && doubles >= 1 && forbidden === 0 ? 1 : 0;
      // console.log(line, res);
      return res;
    })
    .length.toString();
};
const part2: TaskPartSolution = (input) => {
  return input
    .split("\n")
    .filter((line) => {
      const pairs = line.match(/(..).*\1/g) ? 1 : 0;
      const repeats = line.match(/(.).\1/g) ? 1 : 0;
      const res = pairs && repeats ? 1 : 0;
      // console.log(line, res);
      return res;
    })
    .length.toString();
};

const task = new Task(2015, 5, part1, part2, {
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
