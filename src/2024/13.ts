import Task, { TaskPartSolution } from "../utils/task.js";

/**
Button A: X+31, Y+16
Button B: X+35, Y+66
Prize: X=16140, Y=5352
 */
interface Pos {
  x: number;
  y: number;
}
interface Game {
  a: Pos;
  b: Pos;
  prize: Pos;
}
const parseInput = (input: string, extra = 0): Game[] => {
  return input.split("\n\n").map((gi) => {
    const game = {} as Game;
    gi.split("\n").map((l, i) => {
      const m = l.match(/(\d+)/g);
      switch (i) {
        case 0:
          game.a = { x: Number(m![0]), y: Number(m![1]) };
          break;
        case 1:
          game.b = { x: Number(m![0]), y: Number(m![1]) };
          break;
        case 2:
          game.prize = { x: Number(m![0]) + extra, y: Number(m![1]) + extra };
          break;
      }
    });
    return game;
  });
};

// Naive solution for pt1
const A = 3;
const B = 1;
const MAX = 100;
const resolveGame = (game: Game): number => {
  let minCost = Infinity;

  for (let a = 0; a < MAX; a++) {
    for (let b = 0; b < MAX; b++) {
      const x = game.a.x * a + game.b.x * b;
      const y = game.a.y * a + game.b.y * b;
      if (x === game.prize.x && y === game.prize.y) {
        const cost = a * A + b * B;
        if (cost < minCost) {
          minCost = cost;
        }
      }
    }
  }

  if (minCost === Infinity) {
    return 0;
  }
  return minCost;
};

const isFloatingError = (n: number): boolean => {
  return n % 1 < 0.001 || n % 1 > 0.999;
};

const resolveGame2 = (game: Game): number => {
  /**

  px = ax * a + bx * b
  py = ay * a + by * b

  a = px - (bx * b) / ax


  py = ay * (px - (bx * b) / ax) + by * b
  py = ay * px / ax - (ay * bx * b) / ax + by * b

  py - (ay * px / ax) = - (ay * bx * b) / ax + by * b
  py - (ay * px / ax) = b (- (ay * bx) / ax + by)
  b = (py - (ay * px / ax)) / (- (ay * bx) / ax + by)

*/

  const b = (game.prize.y - (game.a.y * game.prize.x) / game.a.x) / (-(game.a.y * game.b.x) / game.a.x + game.b.y);
  const a = (game.prize.x - game.b.x * b) / game.a.x;

  if (isFloatingError(a) && isFloatingError(b)) {
    return Math.round(a) * A + Math.round(b) * B;
  }

  return 0;
};

const part1: TaskPartSolution = (input) => {
  const games = parseInput(input);
  return games.reduce((acc, game) => acc + resolveGame(game), 0);
};
const part2: TaskPartSolution = (input) => {
  const games = parseInput(input, 10000000000000);
  return games.reduce((acc, game) => acc + resolveGame2(game), 0);
};

const task = new Task(2024, 13, part1, part2, {
  part1: {
    input: `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`,
    result: "480",
  },
  part2: {
    input: `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`,
    result: "480",
  },
});

export default task;

// 34787 - low
// 55526352188483 - low
