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

  // const options = buildOptions(mask, counts);
  // return options.length;

  return count(mask, counts);
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

const CACHE: Record<string, number> = {};

const count = (mask: string, nums: number[]): number => {
  if (mask === "") {
    // if mask ran out, but there are no numbers remaining, we got one solution
    return nums.length === 0 ? 1 : 0;
  }
  if (nums.length === 0) {
    // if nums ran out, but mask does not contain any more #, we got one solution
    return mask.includes("#") ? 0 : 1;
  }

  const key = `${mask}__${nums.join(",")}`;

  if (CACHE[key] != null) {
    return CACHE[key];
  }

  let res = 0;

  if (mask[0] === "." || mask[0] === "?") {
    // If next char is or would be ".", just skip over it and continue with smaller mask
    res += count(mask.slice(1), nums);
  }

  if (mask[0] === "#" || mask[0] === "?") {
    // If next char is or would be "#"
    // make sure the whole next num can be taken as group (and is followed by "."" or "?")
    const n = nums[0]; // length of next group
    if (
      n <= mask.length && // there is enough characters left in mask
      !mask.slice(0, n).includes(".") && // the next n chars are "#" or "?"
      (n === mask.length || mask[n] != "#") // end of mask or the group is not followed by "."
    ) {
      // remove group + space after from mask, remove num for the group
      res += count(mask.slice(n + 1), nums.slice(1));
    }
  }

  CACHE[key] = res;
  return res;
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
