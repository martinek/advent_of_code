import Task, { TaskPartSolution } from "../utils/task.js";

const sampleInput = `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`;

const btod = (str: string): number => parseInt(str, 2);

const part1: TaskPartSolution = (input) => {
  const rows = input.split("\n");
  const counts: number[] = new Array(rows[0].length).fill(0);
  rows.forEach((row) => {
    row.split("").forEach((b, i) => {
      counts[i] += b === "1" ? 1 : -1;
    });
  });
  const gamma = btod(counts.map((n) => (n > 0 ? "1" : "0")).join(""));
  const epsilon = btod(counts.map((n) => (n < 0 ? "1" : "0")).join(""));
  return (gamma * epsilon).toString();
};

type T = { key: string; row: string };
const split = (list: T[]) => {
  const a: T[] = [];
  const b: T[] = [];
  list.forEach((row) => {
    (row.key[0] === "0" ? a : b).push({ ...row, key: row.key.slice(1) });
  });
  return a.length > b.length ? [a, b] : [b, a];
};

const part2: TaskPartSolution = (input) => {
  const rows = input.split("\n").map((row) => ({ key: row, row }));

  let [oxy, co2] = split(rows);
  while (oxy.length > 1) {
    oxy = split(oxy)[0];
  }
  while (co2.length > 1) {
    co2 = split(co2)[1];
  }

  const oxygen = btod(oxy[0].row);
  const co2scrub = btod(co2[0].row);

  return (oxygen * co2scrub).toString();
};

const task = new Task(2021, 3, part1, part2);

export default task;
