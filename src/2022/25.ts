import Task, { TaskPartSolution } from "../utils/task.js";

const sampleInput = `1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122`;

const tests = `1              1
2              2
3             1=
4             1-
5             10
6             11
7             12
8             2=
9             2-
10             20
15            1=0
20            1-0
2022         1=11-2
12345        1-0---0
314159265  1121-1110-1=0`
  .split("\n")
  .map((r) => r.split(/[ ]+/));

const DIGITS = "=-012";

const sToDec = (input: string): number => {
  return input
    .split("")
    .reverse()
    .map((char, i) => {
      const num = DIGITS.indexOf(char) - 2;
      const value = Math.pow(5, i);
      return num * value;
    })
    .reduce((acc, v) => acc + v);
};

const decToS = (input: number): string => {
  const a = input
    .toString(5)
    .split("")
    .map(Number)
    .reduceRight<[number[], number]>(
      (acc, n) => {
        const [res, carry] = acc;
        n += carry;
        // if the next value is larger then what we can write in this
        // value, add one to next value and in this one remove the one added
        if (n > 2) {
          return [[n - 5, ...res], 1];
        } else {
          return [[n, ...res], 0];
        }
      },
      [[], 0]
    );
  const v = a[0];
  if (a[1] !== 0) {
    v.unshift(a[1]);
  }
  return v.map((n) => DIGITS[n + 2]).join("");
};

// tests.forEach((t) => {
//   const [a, b] = t;
//   console.log(a, b, sToDec(b), decToS(Number(a)));
// });

const part1: TaskPartSolution = (input) => {
  const sum = input
    .split("\n")
    .map(sToDec)
    .reduce((acc, n) => acc + n);
  return decToS(sum);
};
const part2: TaskPartSolution = (input) => "";

const task = new Task(2022, 25, part1, part2);

export default task;
