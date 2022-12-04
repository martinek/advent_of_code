import Task, { TaskPartSolution } from "./utils/task.js";

const sampleInput = `
vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw
`;

const LETTER_VALUE = Object.fromEntries(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l, i) => [l, i + 1])
);

const part1: TaskPartSolution = (input) =>
  input
    .split("\n")
    .filter((r) => r.length !== 0)
    .map((row) => {
      const rowLength = row.length;
      const firstPack = row.slice(0, rowLength / 2).split("");
      const secondPack = new Set(row.slice(rowLength / 2, rowLength).split(""));
      const both = firstPack.filter((l) => secondPack.has(l))[0];
      const value = LETTER_VALUE[both];
      return value;
    })
    .reduce((acc, i) => acc + i, 0)
    .toString();

const part2: TaskPartSolution = (input) =>
  input
    .split("\n")
    .filter((r) => r.length != 0)
    .reduce<string[][]>(
      (acc, row) => {
        if (acc[0].length === 3) {
          acc.unshift([]);
        }

        acc[0].push(row);
        return acc;
      },
      [[]]
    )
    .map((group) => {
      const first = group[0].split("");
      const second = new Set(group[1].split(""));
      const third = new Set(group[2].split(""));

      const all = first.filter((l) => second.has(l) && third.has(l))[0];
      const value = LETTER_VALUE[all];
      return value;
    })
    .reduce((acc, i) => acc + i, 0)
    .toString();

const task03 = new Task(3, part1, part2);

export default task03;
