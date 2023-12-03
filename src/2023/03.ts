import Task, { TaskPartSolution } from "../utils/task.js";

// Check if any neighbor is symbol other then '.`
// x and y are coords of first letter
const isPart = (
  engine: string[][],
  letters: string[],
  x: number,
  y: number
): { isPart: boolean; gears: number[][] } => {
  const len = letters.length;
  const possibleCoords = [];
  // left
  possibleCoords.push([x - 1, y]);
  // right
  possibleCoords.push([x + len, y]);
  for (let i = -1; i <= len; i++) {
    possibleCoords.push([x + i, y - 1]);
    possibleCoords.push([x + i, y + 1]);
  }

  let isPart = false;
  const gears: number[][] = [];

  for (const coord of possibleCoords) {
    const char = engine[coord[1]]?.[coord[0]];
    if (char != null && !isNumber(char) && char !== ".") {
      isPart = true;
    }
    if (char === "*") {
      gears.push(coord);
    }
  }
  return { isPart, gears };
};

const isNumber = (letter?: string) => {
  if (letter == null) return false;
  return letter.match(/\d/);
};

const parseEngine = (input: string) => {
  return input.split("\n").map((r) => r.split(""));
};

const part1: TaskPartSolution = (input) => {
  const engine = parseEngine(input);

  const numbers: number[] = [];

  let skip = false;
  for (let y = 0; y < engine.length; y++) {
    const row = engine[y];
    for (let x = 0; x < row.length; x++) {
      const letter = row[x];
      if (!isNumber(letter)) {
        skip = false;
        continue;
      }

      if (skip) continue;

      if (letter) {
        const numberLetters = [letter];
        let o = 1;
        let nextLetter = row[x + o];
        while (isNumber(nextLetter)) {
          numberLetters.push(nextLetter);
          o += 1;
          nextLetter = row[x + o];
        }

        if (isPart(engine, numberLetters, x, y).isPart) {
          const number = Number(numberLetters.join(""));
          console.log("found", number, x, y);
          numbers.push(number);
        }

        skip = true;
      }
    }
  }
  return numbers.reduce((acc, n) => acc + n, 0);
};

const part2: TaskPartSolution = (input) => {
  const engine = parseEngine(input);

  const gearCandidates: { [key: string]: number[] } = {};

  let skip = false;
  for (let y = 0; y < engine.length; y++) {
    const row = engine[y];
    for (let x = 0; x < row.length; x++) {
      const letter = row[x];
      if (!isNumber(letter)) {
        skip = false;
        continue;
      }

      if (skip) continue;

      if (letter) {
        const numberLetters = [letter];
        let o = 1;
        let nextLetter = row[x + o];
        while (isNumber(nextLetter)) {
          numberLetters.push(nextLetter);
          o += 1;
          nextLetter = row[x + o];
        }

        isPart(engine, numberLetters, x, y).gears.forEach((pos) => {
          const candidateKey = `${pos[0]}_${pos[1]}`;
          gearCandidates[candidateKey] = gearCandidates[candidateKey] ?? [];
          gearCandidates[candidateKey].push(Number(numberLetters.join("")));
        });

        skip = true;
      }
    }
  }
  return Object.values(gearCandidates)
    .filter((c) => c.length === 2)
    .map(([a, b]) => a * b)
    .reduce((acc, n) => acc + n, 0);
};

const task = new Task(2023, 3, part1, part2, {
  part1: {
    input: `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
    result: "4361",
  },
  part2: {
    input: `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
    result: "467835",
  },
});

export default task;
