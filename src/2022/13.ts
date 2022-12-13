import Task, { TaskPartSolution } from "../utils/task.js";

const sampleInput = `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`;

// const sampleInput = `[[4,4],4,4]
// [[4,4],4,4,4]`;

type Item = number | Item[];

const compare = (a: Item, b: Item): number => {
  // console.log("compare", a, b);
  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }
  if (typeof a === "number") {
    return compare([a], b);
  } else if (typeof b === "number") {
    return compare(a, [b]);
  } else {
    // both are arrays
    for (let i = 0; i <= a.length; i++) {
      const elementA = a[i];
      const elementB = b[i];

      // console.log(i, elementA, elementB);

      if (elementA == null && elementB == null) return 0;
      if (elementA == null) return -1;
      if (elementB == null) return 1;

      const comp = compare(elementA, elementB);
      if (comp !== 0) return comp;
    }
    return 0;
  }
};

const part1: TaskPartSolution = (input) => {
  const ordered = input
    .split("\n\n")
    .map((p) => p.split("\n"))
    .map((pair) => {
      const left = eval(pair[0]);
      const right = eval(pair[1]);

      const res = compare(left, right);
      // console.log("Result: ", res);
      return res <= 0;
    });

  const sum = ordered.reduce((acc, sorted, i) => {
    return acc + (sorted ? i + 1 : 0);
  }, 0);

  return sum.toString();
};

const part2: TaskPartSolution = (input) => {
  const packets = input
    .split("\n")
    .filter((r) => r !== "")
    .map((r) => eval(r));

  const DIVIDERS = [[[2]], [[6]]];

  packets.push(...DIVIDERS);

  const ordered = packets.sort(compare);

  const pos1 = ordered.indexOf(DIVIDERS[0]) + 1;
  const pos2 = ordered.indexOf(DIVIDERS[1]) + 1;

  // console.log(ordered);
  // console.log(pos1, pos2);

  return (pos1 * pos2).toString();
};

const task = new Task(2022, 13, part1, part2);

export default task;
