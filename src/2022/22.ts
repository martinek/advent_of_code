import Task, { TaskPartSolution } from "../utils/task.js";

const sampleInput = `        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5`;

type Tile = "." | "#" | " ";
type Cell = { tile: Tile; x: number; y: number };
type Position = [number, number];

const walk = (hall: Cell[], from: number, distance: number): Cell => {
  if (distance === 0) return hall[from];

  const dd = distance < 0 ? -1 : 1;
  const canLoop = dd > 0 ? hall.find((c) => c.tile !== " ")?.tile === "." : hall[hall.length - 1].tile === ".";

  console.log({ canLoop });

  let n = from;
  for (let i = 0; i < Math.abs(distance); i++) {
    let nextIndex = n + dd;

    // if we are at the end of hall, nextIndex will be first in hall
    if (dd > 0 && nextIndex > hall.length - 1) {
      if (canLoop) nextIndex = hall.findIndex((c) => c.tile === ".");
      else break;
    }

    // if we are at the end of hall, nextIndex will be first in hall
    if (dd < 0 && (nextIndex < 0 || hall[n - 1].tile === " ")) {
      if (canLoop) nextIndex = hall.length - 1;
      else break;
    }

    // if next tile is wall
    if (hall[nextIndex].tile === "#") break;

    n = nextIndex;
  }

  return hall[n];
};

// small test suite
// (() => {
//   const test = (name: string, value: any, expect: any) => {
//     if (value !== expect) console.log(`FAIL: ${name}. Expected ${expect} got ${value}`);
//   };
//   const buildHall = (i: string): Cell[] => i.split("").map((tile, x) => ({ tile: tile as Tile, x, y: 0 }));
//   const offsets = [-100, -10, -3, -2, -1, 0, 1, 2, 3, 10, 100];
//   let expects: number[];
//   console.group("TESTS");

//   console.group("'   ....#'");
//   let hall = buildHall("   ....#");
//   expects = [3, 3, 3, 3, 3, 4, 5, 6, 6, 6, 6];
//   offsets.forEach((off, i) => test(`4,${off}`, walk(hall, 4, off).x, expects[i]));
//   console.groupEnd();

//   console.group("'   #....'");
//   hall = buildHall("   #....");
//   expects = [4, 4, 4, 4, 4, 4, 5, 6, 7, 7, 7];
//   offsets.forEach((off, i) => test(`4,${off}`, walk(hall, 4, off).x, expects[i]));
//   console.groupEnd();

//   hall = buildHall("   .#...");
//   console.group("'   .#...'");
//   expects = [5, 5, 5, 5, 5, 5, 6, 7, 3, 3, 3];
//   offsets.forEach((off, i) => test(`5,${off}`, walk(hall, 5, off).x, expects[i]));
//   console.groupEnd();

//   hall = buildHall("   .#.#.");
//   console.group("'   .#.#.'");
//   expects = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
//   offsets.forEach((off, i) => test(`5,${off}`, walk(hall, 5, off).x, expects[i]));
//   console.groupEnd();

//   hall = buildHall("#......");
//   console.group("'#......'");
//   expects = [1, 1, 2, 3, 4, 5, 6, 6, 6, 6, 6];
//   offsets.forEach((off, i) => test(`5,${off}`, walk(hall, 5, off).x, expects[i]));
//   console.groupEnd();

//   hall = buildHall("..#....");
//   console.group("'..#....'");
//   expects = [3, 3, 3, 3, 4, 5, 6, 0, 1, 1, 1];
//   offsets.forEach((off, i) => test(`5,${off}`, walk(hall, 5, off).x, expects[i]));
//   console.groupEnd();

//   console.groupEnd();
//   console.log("TEST END\n\n");
// })();

class Maze {
  maze: Cell[][];

  constructor(input: string) {
    this.maze = input.split("\n").map((r, y) => r.split("").map((t, x) => ({ tile: t as Tile, x, y })));
  }

  // first row, first empty space
  getStartPosition(): Position {
    const firstRow = this.maze[0];
    return [firstRow.findIndex((c) => c.tile === "."), 0];
  }

  getDestination(start: Position, heading: Heading, distance: number): Position {
    if (heading === "left" || heading === "right") {
      const hall = this.maze[start[1]];
      const end = walk(hall, start[0], distance * (heading === "right" ? 1 : -1));
      return [end.x, end.y];
    } else {
      const hall = this.maze.map((r) => r[start[0]]).filter(Boolean);
      const end = walk(hall, start[1], distance * (heading === "down" ? 1 : -1));
      return [end.x, end.y];
    }
  }

  getCubeDestination(start: Position, heading: Heading, distance: number): Position {
    if (heading === "left" || heading === "right") {
      // When going left/right, just take current row, remove any empty cells and add
      // first determine which side we are on
      const hall = this.maze[start[1]];
      const end = walk(hall, start[0], distance * (heading === "right" ? 1 : -1));
      return [end.x, end.y];
    } else {
      const hall = this.maze.map((r) => r[start[0]]).filter(Boolean);
      const end = walk(hall, start[1], distance * (heading === "down" ? 1 : -1));
      return [end.x, end.y];
    }
    return start;
  }

  toString() {
    let str = "";
    for (let y = 0; y < this.maze.length; y++) {
      for (let x = 0; x < this.maze[y].length; x++) {
        const cell = this.maze[y][x];
        str += cell.tile;
      }
      str += "\n";
    }
    return str;
  }
}

type Direction = "left" | "right" | number;
type Heading = "top" | "right" | "down" | "left";

class Directions {
  directions: Direction[] = [];

  constructor(input: string) {
    let n = "";
    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      if (char === "L" || char === "R") {
        // Finish any building number
        if (n.length > 0) {
          this.directions.push(Number(n));
          n = "";
        }
        // Add this direction
        this.directions.push(char === "L" ? "left" : "right");
      } else {
        // Keep building number
        n += char;
      }
    }
    // Add last number if present
    if (n.length > 0) this.directions.push(Number(n));
  }
}

const parseInput = (input: string): { maze: Maze; directions: Directions } => {
  const [mazeInput, directionsInput] = input.split("\n\n");
  return {
    maze: new Maze(mazeInput),
    directions: new Directions(directionsInput),
  };
};

const HEADINGS: Heading[] = ["right", "down", "left", "top"];
const turn = (heading: Heading, dir: "left" | "right") => {
  return HEADINGS[(HEADINGS.indexOf(heading) + (dir === "right" ? 1 : -1) + HEADINGS.length) % HEADINGS.length];
};

const solveMaze = (maze: Maze, d: Directions): [Position, Heading] => {
  let position: Position = maze.getStartPosition();
  let heading: Heading = "right";

  for (let i = 0; i < d.directions.length; i++) {
    const direction = d.directions[i];
    switch (direction) {
      case "left":
      case "right":
        heading = turn(heading, direction);
        console.log("heading", heading);
        break;

      default:
        position = maze.getDestination(position, heading, direction);
        console.log("position", position);
        break;
    }
  }

  return [position, heading];
};

const solveCubeMaze = (maze: Maze, d: Directions): [Position, Heading] => {
  let position: Position = maze.getStartPosition();
  let heading: Heading = "right";

  for (let i = 0; i < d.directions.length; i++) {
    const direction = d.directions[i];
    switch (direction) {
      case "left":
      case "right":
        heading = turn(heading, direction);
        console.log("heading", heading);
        break;

      default:
        position = maze.getCubeDestination(position, heading, direction);
        console.log("position", position);
        break;
    }
  }

  return [position, heading];
};

const calculatePassword = (position: Position, heading: Heading): number => {
  return (position[1] + 1) * 1000 + (position[0] + 1) * 4 + HEADINGS.indexOf(heading);
};

const part1: TaskPartSolution = (input) => {
  const { maze, directions } = parseInput(input);
  const [position, heading] = solveMaze(maze, directions);
  return calculatePassword(position, heading);
};

const part2: TaskPartSolution = (input) => {
  const { maze, directions } = parseInput(input);
  const [position, heading] = solveCubeMaze(maze, directions);
  return calculatePassword(position, heading);
};

const task = new Task(2022, 22, part1, part2);

export default task;
