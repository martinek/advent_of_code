import { SUM } from "../utils/helpers.js";
import Task, { TaskPartSolution } from "../utils/task.js";

// option can be incomplete, this needs to tell even for partial options correctly
const fit = (option: string, counts: number[], exact: boolean): boolean => {
  const nOption = option.slice(option.indexOf("#"), option.lastIndexOf("#") + 1);
  const optCounts = nOption.split(/\.+/).map((s) => s.length);

  if (optCounts.length > counts.length) return false;

  if (exact) {
    // All, including last number must match
    for (let i = 0; i < counts.length; i++) {
      if (optCounts[i] !== counts[i]) {
        return false;
      }
    }
    return true;
  } else {
    for (let i = 0; i < optCounts.length; i++) {
      const last = i === optCounts.length - 1;
      if (optCounts[i] === counts[i]) {
        continue;
      }

      if (last && optCounts[i] < counts[i]) {
        continue;
      }

      return false;
    }

    return true;
  }
};

const buildOptions = (mask: string, counts: number[]) => {
  let options: string[] = [];

  // console.log(`BUILD OPTIONS: ${mask}`, counts);

  for (let i = 0; i < mask.length; i++) {
    const char = mask[i];
    if (char === "?") {
      if (i === 0) {
        options = [".", "#"];
      } else {
        options = options.flatMap((o) => [o + ".", o + "#"]);
      }
    } else {
      if (i === 0) {
        options = [char];
      } else {
        options = options.map((o) => o + char);
      }
    }

    options = options.filter((o) => fit(o, counts, i === mask.length - 1));
  }

  // console.log("OPTIONS:", options);
  return options;
};

const solveRow = (row: string): number => {
  const [mask, countsStr] = row.split(" ");
  const counts = countsStr.split(",").map(Number);

  const options = buildOptions(mask, counts);

  return options.length;
};

const part1: TaskPartSolution = (input) => {
  const reses = input.split("\n").map(solveRow);
  return SUM(reses);
};

const unfoldRow = (row: string): string => {
  const [mask, counts] = row.split(" ");
  const five = [1, 2, 3, 4, 5];
  const newMask = five.map(() => mask).join("?");
  const newCounts = five.map(() => counts).join(",");
  return newMask + " " + newCounts;
};

const part2: TaskPartSolution = (input) => {
  const reses = input.split("\n").map((row) => {
    const unfoldedRow = unfoldRow(row);
    return solveRow(unfoldedRow);
  });
  return SUM(reses);
};

const task = new Task(2023, 12, part1, part2, {
  part1: {
    input: `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`,
    result: "21",
  },
  part2: {
    input: `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`,
    result: "525152",
  },
});

export default task;
