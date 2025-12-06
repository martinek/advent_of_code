import Task, { TaskPartSolution } from "../utils/task.js";

const part1: TaskPartSolution = (input) => {
  const rows = input.split("\n").map((row) => row.trim().split(/\s+/));
  let total = 0;
  const n = rows.length;
  for (let x = 0; x < rows[0].length; x++) {
    const col = rows.map((row) => row[x]);
    const operator = col[n - 1];
    total += col.slice(1, n - 1).reduce((acc, val) => {
      if (operator === "*") {
        return acc * Number(val);
      } else if (operator === "+") {
        return acc + Number(val);
      }
      return acc;
    }, Number(col[0]));
  }
  return total;
};
const part2: TaskPartSolution = (input) => {
  const rows = input.split("\n").map((r) => [...r.split(""), " "]); // add empty space to end to simplify processing
  let opRow = rows.pop()!;

  let total = 0;

  while (opRow.length > 0) {
    const op = opRow.shift()!;
    const nums: number[] = [];
    while (opRow[0] === " ") {
      nums.push(
        Number(
          rows
            .map((r) => r.shift()!)
            .join("")
            .trim()
        )
      );
      opRow.shift();
    }

    const partRes = nums.slice(1).reduce((acc, val) => {
      if (op === "*") {
        return acc * Number(val);
      } else if (op === "+") {
        return acc + Number(val);
      }
      return acc;
    }, Number(nums[0]));
    // console.log(nums, op, partRes);

    total += partRes;

    // skip empty col
    rows.forEach((r) => r.shift());
  }

  return total;
};

const task = new Task(2025, 6, part1, part2, {
  part1: {
    input: `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `,
    result: "4277556",
  },
  part2: {
    input: `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `,
    result: "3263827",
  },
});

export default task;
