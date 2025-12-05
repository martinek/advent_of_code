import Task, { TaskPartSolution } from "../utils/task.js";

const parseInput = (input: string) => {
  const [rangesPart, numbersPart] = input.split("\n\n");
  const ranges = rangesPart.split("\n").map((line) => {
    const [start, end] = line.split("-").map(Number);
    return [start, end] as [number, number];
  });
  const numbers = numbersPart.split("\n").map(Number);
  return { ranges, numbers };
};

const isFresh = (number: number, ranges: [number, number][]): boolean => {
  for (const [start, end] of ranges) {
    if (number >= start && number <= end) {
      return true;
    }
  }
  return false;
};

const part1: TaskPartSolution = (input) => {
  const { ranges, numbers } = parseInput(input);
  let count = 0;
  for (const number of numbers) {
    if (isFresh(number, ranges)) {
      count++;
    }
  }
  return count.toString();
};

const part2: TaskPartSolution = (input) => {
  const { ranges } = parseInput(input);
  const pendingRanges = ranges.toSorted((a, b) => a[0] - b[0]);
  let totalCount = 0;
  let current = -1;

  for (const [start, rangeEnd] of pendingRanges) {
    const rangeSize = rangeEnd - start + 1;
    if (start > current) {
      // there is gap, add whole next range
      totalCount += rangeSize;
      current = rangeEnd;
    } else if (rangeEnd > current) {
      // we are already in the range, add only the missing part
      totalCount += rangeEnd - current;
      current = rangeEnd;
    } // otherwise the range was already fully covered, skip rest
  }

  return totalCount;
};

const task = new Task(2025, 5, part1, part2, {
  part1: {
    input: `3-5
10-14
16-20
12-18

1
5
8
11
17
32`,
    result: "3",
  },
  part2: {
    input: `3-5
10-14
16-20
12-18

1
5
8
11
17
32`,
    result: "14",
  },
});

export default task;
