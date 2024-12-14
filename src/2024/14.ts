import { wait } from "../utils/helpers.js";
import { ill } from "../utils/illustrator.js";
import Task, { TaskPartSolution } from "../utils/task.js";

const TIME = 100;

interface Point {
  x: number;
  y: number;
}
interface Robot {
  position: Point;
  velocity: Point;
}
const parseInput = (input: string): Robot[] =>
  input.split("\n").map((line) => {
    const [p, v] = line.slice(2).split(" v=");
    const [p1, p2] = p.split(",").map(Number);
    const [v1, v2] = v.split(",").map(Number);
    return {
      position: { x: p1, y: p2 },
      velocity: { x: v1, y: v2 },
    };
  });

const step = (robots: Robot[], w: number, h: number, count: number): Robot[] => {
  return robots.map((robot, i) => {
    const dx = (robot.velocity.x + w) % w;
    const dy = (robot.velocity.y + h) % h;
    if (dx < 0 || dy < 0) {
      console.log("NEGATIVE", i, dx, dy);
    }
    const endPos = {
      x: (robot.position.x + count * dx) % w,
      y: (robot.position.y + count * dy) % h,
    };
    return { position: endPos, velocity: robot.velocity };
  });
};

const part1: TaskPartSolution = (input) => {
  const W = 101;
  const H = 103;
  const robots = parseInput(input);
  // console.log(robots);
  const quads = [0, 0, 0, 0];
  const endRobots = step(robots, W, H, TIME);
  endRobots.forEach(({ position }, i) => {
    const w = (W - 1) / 2;
    const h = (H - 1) / 2;
    if (position.x < w && position.y < h) {
      quads[0]++;
    }
    if (position.x > w && position.y < h) {
      quads[1]++;
    }
    if (position.x < w && position.y > h) {
      quads[2]++;
    }
    if (position.x > w && position.y > h) {
      quads[3]++;
    }
  });
  return quads[0] * quads[1] * quads[2] * quads[3];
};

const print = (robots: Robot[], w: number, h: number): string => {
  const grid = Array.from({ length: h }, () => Array.from({ length: w }, () => "."));
  robots.forEach(({ position }) => {
    grid[position.y][position.x] = "#";
  });
  return grid.map((row) => row.join("")).join("\n");
};

const part2: TaskPartSolution = (input) => {
  const W = 101;
  const H = 103;
  let robots = parseInput(input);
  let i = 0;
  ill.GRID = 0;
  ill.PPC = 1;
  while (true) {
    robots = step(robots, W, H, 1);
    i++;
    // offset from previous tries
    if (i > 6500) {
      ill.log(print(robots, W, H));
      console.log(i);
      wait(0.02);
    }
  }
};

const task = new Task(2024, 14, part1, part2, {
  part1: {
    input: `p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`,
    result: "12",
  },
  part2: {
    input: ``,
    result: "",
  },
});

export default task;
