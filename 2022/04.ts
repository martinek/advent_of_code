import Task, { TaskPartSolution } from "./utils/task.js";

const sampleInput = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;

const part1: TaskPartSolution = (input) =>
  input
    .split("\n")
    .filter((v) => v.length !== 0)
    .map((row) => row.split(",").map((rangeStr) => rangeStr.split("-").map(Number)))
    .filter((ranges) => {
      let res = false;
      if (ranges[0][0] === ranges[1][0]) {
        res = true;
      } else if (ranges[0][0] < ranges[1][0]) {
        res = ranges[0][1] >= ranges[1][1];
      } else {
        res = ranges[0][1] <= ranges[1][1];
      }
      return res;
    })
    .length.toString();

const part2: TaskPartSolution = (input) =>
  input
    .split("\n")
    .filter((v) => v.length !== 0)
    .map((row) => row.split(",").map((rangeStr) => rangeStr.split("-").map(Number)))
    .filter((ranges) => {
      let res = false;
      if (ranges[0][0] === ranges[1][0]) {
        res = true;
      } else if (ranges[0][0] < ranges[1][0]) {
        res = ranges[0][1] >= ranges[1][0];
      } else {
        res = ranges[0][0] <= ranges[1][1];
      }
      return res;
    })
    .length.toString();

const task04 = new Task(4, part1, part2);

export default task04;
