import { lPad } from "../utils/helpers.js";
import Task, { TaskPartSolution } from "../utils/task.js";

type Direction = 1 | -1;

const shapeString = (shape: number[], symbol = "@") => {
  const rows: string[] = [];
  for (let i = 0; i < shape.length; i++) {
    const row = shape[i] ?? 0;
    rows.push(lPad(row.toString(2), WIDTH, "0"));
  }
  rows.reverse();
  return rows.join("\n").replaceAll("0", ".").replaceAll("1", symbol);
};

class Area {
  width: number;
  directions: Direction[];
  nextDirection: number;
  filled: number[];
  top: number;

  constructor(width: number, directions: Direction[]) {
    this.width = width;
    this.directions = directions;
    this.nextDirection = 0;
    this.filled = [];
    this.top = 0;
  }

  log(...args: any[]) {
    return;
    if (this.top <= 7) return;
    console.log(...args);
  }

  addRock(rock: Rock) {
    this.log("\n\nADDING ROCK");
    let y = this.top + Y_OFFSET;

    const initialMove = this.width - rock.width - X_OFFSET;
    for (let i = 0; i < initialMove; i++) {
      rock.move(-1);
    }
    // console.log("starting rock:");
    // rock.print();

    while (true) {
      const direction = this.directions[this.nextDirection % this.directions.length]!;
      this.nextDirection++;

      if (this.checkRock(rock, y, direction)) {
        this.log(`moving X ${direction}`);
        rock.move(direction);
        // this.print(rock, y);
      }

      if (this.checkRock(rock, y - 1)) {
        this.log(`moving down`);
        y = y - 1;
        // this.print(rock, y);
      } else {
        this.log(`stopping`);
        this.addFilled(rock, y);
        // console.log(`AREA: (top: ${this.top})`);
        // this.print();
        return;
      }
    }
  }

  // x and y are bottom left of rock shape
  // returns true if rock can move
  checkRock(rock: Rock, y: number, direction?: Direction): boolean {
    // this.log("checkRock", direction);
    // Check bounds
    if (direction) {
      if (direction === 1 && rock.col(this.width - 1, this.width) !== 0) return false;
      if (direction === -1 && rock.col(0, this.width) !== 0) return false;
    }

    // Check bottom
    if (y === -1) return false;

    // Check overlap
    for (let cy = 0; cy < rock.shape.length; cy++) {
      const newRockRow = direction === -1 ? rock.shape[cy] << 1 : rock.shape[cy] >> (direction ?? 0);
      const filledRow = this.filled[y + cy];
      // if (y + cy === 3) {
      this.log({ newRockRow, filledRow });
      // }
      if ((newRockRow & filledRow) !== 0) return false;
    }

    return true;
  }

  addFilled(rock: Rock, y: number) {
    for (let cy = 0; cy < rock.shape.length; cy++) {
      this.filled[y + cy] = this.filled[y + cy] | rock.shape[cy];
    }
    this.top = this.filled.length;
  }

  print(rock?: Rock, y?: number) {
    const shape = [...this.filled];
    while (shape.length !== this.top + 3 + (rock?.shape.length ?? 0)) {
      shape.push(0);
    }

    if (rock && y != null) {
      for (let cy = 0; cy < rock.shape.length; cy++) {
        shape[y + cy] = shape[y + cy] | rock.shape[cy];
      }
    }

    console.log(shapeString(shape, "#") + "\n");
  }
}

class Rock {
  shape: number[];
  width: number;

  constructor(shape: number[], width: number) {
    this.shape = shape; // have bottom be 0
    this.width = width;
  }

  move(dir: Direction) {
    this.shape = this.shape.map((n) => (dir === 1 ? n >> 1 : n << 1));
  }

  print() {
    console.log(shapeString(this.shape, "@"));
  }

  col(n: number, width: number) {
    const mask = 1 << (width - 1 - n);
    const res = this.shape.map((n) => n & mask).reduce((acc, n) => acc || n, 0);
    // this.print();
    // console.log(`col(${n}, ${width}) = `, res);
    return res;
  }

  dup() {
    return new Rock([...this.shape], this.width);
  }
}

const ROCKS = [
  new Rock([0b1111], 4),
  new Rock([0b010, 0b111, 0b010].reverse(), 3),
  new Rock([0b001, 0b001, 0b111].reverse(), 3),
  new Rock([0b1, 0b1, 0b1, 0b1].reverse(), 1),
  new Rock([0b11, 0b11], 2),
];

const WIDTH = 7;
const X_OFFSET = 2;
const Y_OFFSET = 3;

const simulate = (count: number, input: Direction[]) => {
  const area = new Area(WIDTH, input);
  for (let n = 0; n < count; n++) {
    area.addRock(ROCKS[n % ROCKS.length].dup());
  }
  return area.top;
};

const sampleInput = ">>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>";

const part1: TaskPartSolution = (input) => {
  const directions = input.split("").map<Direction>((v) => (v === ">" ? 1 : -1));
  return simulate(2022, directions);
};
const part2: TaskPartSolution = (input) => {
  const directions = sampleInput.split("").map<Direction>((v) => (v === ">" ? 1 : -1));
  // return simulate(1000000000000, directions);
  const target = 1514288;
  const res = simulate(1000000, directions);
  if (res !== target) {
    console.error(`Results do not match! ${res} !== ${target}`);
    process.exit(1);
  }
  return res;
};

const task = new Task(2022, 17, part1, part2);

export default task;
