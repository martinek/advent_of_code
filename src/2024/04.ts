import Task, { TaskPartSolution } from "../utils/task.js";

const countXmasLines = (lines: string[]): number => {
  return lines.reduce((acc, line) => {
    const xmas = line.match(/XMAS/g);
    return acc + (xmas ? xmas.length : 0);
  }, 0);
};

const countXmas = (input: string): number => {
  const lines: string[] = [];

  const addLine = (line: string) => {
    lines.push(line);
    lines.push(line.split("").reverse().join(""));
  };

  // horizontal
  // console.log("horizontal");
  const rows = input.split("\n");
  rows.forEach((row) => {
    addLine(row);
  });

  // vertical
  // console.log("vertical");
  const width = rows[0].length;
  for (let i = 0; i < width; i++) {
    let col = "";
    for (let j = 0; j < rows.length; j++) {
      col += rows[j][i];
    }
    addLine(col);
  }

  // diagonal right
  // console.log("diag right");
  for (let i = 0; i < width; i++) {
    let col = "";
    for (let j = 0; j < rows.length; j++) {
      const l = rows[j][j + i];
      if (l != undefined) {
        col += l;
      }
      // col += rows[j][(j + i) % width];
    }
    addLine(col);
  }
  for (let y = 1; y < rows.length; y++) {
    let col = "";
    for (let x = 0; x < width; x++) {
      const l = rows[y + x]?.[x];
      if (l != undefined) {
        col += l;
      }
    }
    addLine(col);
  }

  // diagonal left
  // console.log("diag left");
  for (let y = 0; y < rows.length; y++) {
    let col = "";
    for (let x = 0; x < width; x++) {
      const l = rows[y + x - rows.length]?.[width - 1 - x];
      if (l != undefined) {
        col += l;
      }
    }
    addLine(col);
  }
  for (let y = 0; y < rows.length; y++) {
    let col = "";
    for (let x = 0; x < width; x++) {
      const l = rows[y + x]?.[width - 1 - x];
      if (l != undefined) {
        col += l;
      }
    }
    addLine(col);
  }

  return countXmasLines(lines);
};

const part1: TaskPartSolution = (input) => {
  return countXmas(input);
};
const part2: TaskPartSolution = (input) => {
  const lines = input.split("\n").map((line) => line.split(""));
  let count = 0;
  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      if (lines[y][x] === "A") {
        if (
          ((lines[y - 1]?.[x - 1] === "M" && lines[y + 1]?.[x + 1] === "S") ||
            (lines[y - 1]?.[x - 1] === "S" && lines[y + 1]?.[x + 1] === "M")) &&
          ((lines[y + 1]?.[x - 1] === "M" && lines[y - 1]?.[x + 1] === "S") ||
            (lines[y + 1]?.[x - 1] === "S" && lines[y - 1]?.[x + 1] === "M"))
        ) {
          count++;
        }
      }
    }
  }
  return count;
};

const task = new Task(2024, 4, part1, part2, {
  part1: {
    input: `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`,
    result: "18",
  },
  part2: {
    input: `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`,
    result: "9",
  },
});

export default task;
