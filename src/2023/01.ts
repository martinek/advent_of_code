import Task, { TaskPartSolution } from "../utils/task.js";

const part1: TaskPartSolution = (input) => {
  const sum = input
    .split("\n")
    .map((row) => {
      const clean = row.replaceAll(/[^0-9]/g, "");
      const n = Number(`${clean[0]}${clean[clean.length - 1]}`);
      return n;
    })
    .reduce((acc, v) => acc + v, 0);
  return sum;
};

const NUMBERS = ["____zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

const part2: TaskPartSolution = (input) => {
  const replaceNums = (str: string) => {
    let res = str;

    const first = NUMBERS.map((word, n) => ({ idx: str.indexOf(word), n, word }))
      .filter(({ idx }) => idx != -1)
      .sort((a, b) => a.idx - b.idx)[0];
    if (first) {
      const a = res.split("");
      a.splice(first.idx, 0, first.n.toString());
      res = a.join("");
    }

    const last = NUMBERS.map((word, n) => ({ idx: res.lastIndexOf(word), n, word }))
      .filter(({ idx }) => idx != -1)
      .sort((a, b) => b.idx - a.idx)[0];
    if (last) {
      const a = res.split("");
      a.splice(last.idx, 0, last.n.toString());
      res = a.join("");
    }

    return res;
  };

  const sum = input
    .split("\n")
    .map((row) => {
      const clean = replaceNums(row).replaceAll(/[^0-9]/g, "");
      const n = Number(`${clean[0]}${clean[clean.length - 1]}`);
      return n;
    })
    .reduce((acc, v) => acc + v, 0);
  return sum;
};

const task = new Task(2023, 1, part1, part2);

export default task;
