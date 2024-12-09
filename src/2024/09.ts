import { pause } from "../utils/helpers.js";
import Task, { TaskPartSolution } from "../utils/task.js";

interface File {
  id: number;
  start: number;
  size: number;
}

const parseInput = (input: string) => {
  const nums = input.split("").map(Number);
  const files: File[] = [];

  let space = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i % 2 === 0) {
      // file
      const prevFile = files[files.length - 1];
      files.push({
        id: (prevFile?.id ?? -1) + 1,
        start: prevFile ? prevFile.start + prevFile.size + space : 0,
        size: nums[i],
      });
    } else {
      // free space
      space = nums[i];
    }
  }

  return files;
};

const checksum = (id: number, size: number, i: number): number => {
  let n = 0;
  for (let j = i; j < i + size; j++) {
    // console.log(`Add ${id} * ${j} (${id * j})`);
    n += id * j;
  }
  return n;
};

const compactChecksum = (files: File[]) => {
  let sum = 0;
  let fillFile: File | undefined;
  let remainingSpace = 0;
  let i = 0;
  while (true) {
    // console.log({ sum, remainingSpace, i, files });
    if (remainingSpace > 0) {
      // fill space with file from end
      if (fillFile == undefined) {
        fillFile = files.pop();
        if (fillFile == undefined) {
          throw new Error("No more files to fill space");
        }
      }
      // console.log("Fillling space", { remainingSpace, fillFile });
      if (remainingSpace >= fillFile.size) {
        sum += checksum(fillFile.id, fillFile.size, i);
        remainingSpace -= fillFile.size;
        i += fillFile.size;
        fillFile = undefined;
        // console.log("Space filled A", { sum, remainingSpace });
      } else {
        sum += checksum(fillFile.id, remainingSpace, i);
        fillFile.size -= remainingSpace;
        i += remainingSpace;
        remainingSpace = 0;
        // console.log("Space filled B", { sum, remainingSpace });
      }
    } else {
      // add next file and prepare remaining space for next round
      const f = files.shift();
      if (f == undefined) {
        throw new Error("No more files to add");
      }
      // console.log("Adding file", f);
      sum += checksum(f.id, f.size, i);
      i += f.size;

      const nextFile = files[0];
      if (nextFile == undefined) {
        break;
      }
      remainingSpace = nextFile.start - (f.start + f.size);
      // console.log("File added", { sum, remainingSpace });
    }
    // pause();
  }
  if (fillFile != undefined) {
    sum += checksum(fillFile.id, fillFile.size, i);
  }
  return sum;
};

const part1: TaskPartSolution = (input) => {
  const files = parseInput(input);
  return compactChecksum(files);
};

const findSpace = (files: File[], size: number): File | undefined => {
  for (let i = 1; i < files.length; i++) {
    const a = files[i - 1];
    const b = files[i];
    if (b.start - (a.start + a.size) >= size) {
      return a;
    }
  }
};

const compactChecksum2 = (files: File[]) => {
  const filesCP = [...files];
  while (filesCP.length > 0) {
    const f = filesCP.pop();
    if (f == undefined) {
      throw new Error("Should not happen");
    }
    const prev = findSpace(files, f.size);
    if (prev && files.indexOf(prev) < files.indexOf(f)) {
      // console.log("Moving file", f, "after", prev);
      files.splice(files.indexOf(f), 1); // remove file from prev position
      files.splice(files.indexOf(prev) + 1, 0, f); // insert file after prev
      f.start = prev.start + prev.size;
    }
  }

  return files.reduce((sum, f) => sum + checksum(f.id, f.size, f.start), 0);
};

const part2: TaskPartSolution = (input) => {
  const files = parseInput(input);
  return compactChecksum2(files);
};

const task = new Task(2024, 9, part1, part2, {
  part1: {
    input: `2333133121414131402`,
    result: "1928",
  },
  part2: {
    input: `2333133121414131402`,
    result: "2858",
  },
});

export default task;
