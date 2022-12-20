import Task, { TaskPartSolution } from "../utils/task.js";

const sampleInput = `1
2
-3
3
-2
0
4`;

interface Entry {
  number: number;
}

const getMove = (num: number, count: number) => {
  let n = num % count;
  // console.log(`getMove(${n}, ${count})`);
  if (n < 0) n = count + n;
  return n;
};

const mix = (numbers: number[], times: number): number[] => {
  const entries: Entry[] = numbers.map((n) => ({
    number: n,
  }));

  const mixed = [...entries];
  console.log(mixed.slice(0, 4));

  for (let j = 0; j < times; j++) {
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i];
      const p = mixed.indexOf(e);
      if (e.number === 0) continue;
      mixed.splice(p, 1);
      mixed.splice((p + getMove(e.number, mixed.length)) % mixed.length, 0, e);
    }
    console.log(
      `${j}: ${mixed
        .map((n) => n.number)
        .slice(0, 4)
        .join(",")}`
    );
  }

  return mixed.map((e) => e.number);
};

const coords = (numbers: number[]): number => {
  const zeroIndex = numbers.indexOf(0);
  const a = numbers[(zeroIndex + 1000) % numbers.length];
  console.log({ a });
  const b = numbers[(zeroIndex + 2000) % numbers.length];
  console.log({ b });
  const c = numbers[(zeroIndex + 3000) % numbers.length];
  console.log({ c });
  return a + b + c;
};

const part1: TaskPartSolution = (input) => {
  const numbers = input.split("\n").map(Number);
  const mixed = mix(numbers, 1);
  console.log(mixed);
  return coords(mixed);
};
const part2: TaskPartSolution = (input) => {
  const KEY = 811589153;
  const numbers = input.split("\n").map((s) => Number(s) * KEY);
  const mixed = mix(numbers, 10);
  console.log(mixed);
  return coords(mixed);
};

const task = new Task(2022, 20, part1, part2);

export default task;
