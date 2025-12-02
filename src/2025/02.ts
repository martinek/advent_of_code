import Task, { TaskPartSolution } from "../utils/task.js";

const isValid = (numStr: string): boolean => {
  if (numStr.length % 2 !== 0) return false;
  const half = numStr.length / 2;
  return numStr.slice(0, half) === numStr.slice(half);
};

const isValid2 = (numStr: string): boolean => {
  for (let size = 1; size <= numStr.length / 2; size++) {
    const pts = numStr.match(new RegExp(`.{1,${size}}`, "g"));
    const set = new Set(pts);
    if (set.size === 1) return true;
  }
  return false;
};

const part1: TaskPartSolution = (input) => {
  const ranges = input.split(",").map((rangeStr) => {
    const [start, end] = rangeStr.split("-").map(Number);
    return { start, end };
  });
  let total = 0;
  for (const { start, end } of ranges) {
    for (let num = start; num <= end; num++) {
      if (isValid(num.toString())) {
        total += num;
      }
    }
  }
  return total.toString();
};
const part2: TaskPartSolution = (input) => {
  const ranges = input.split(",").map((rangeStr) => {
    const [start, end] = rangeStr.split("-").map(Number);
    return { start, end };
  });
  let total = 0;
  for (const { start, end } of ranges) {
    for (let num = start; num <= end; num++) {
      if (isValid2(num.toString())) {
        total += num;
      }
    }
  }
  return total.toString();
};

const task = new Task(2025, 2, part1, part2, {
  part1: {
    input: `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`,
    result: "1227775554",
  },
  part2: {
    input: `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`,
    result: "4174379265",
  },
});

export default task;
