import { COLOR } from "../utils/helpers.js";
import Task, { TaskPartSolution } from "../utils/task.js";
type Direction = "up" | "down" | "left" | "right";
interface Position {
  x: number;
  y: number;
}

interface State {
  obstacles: Set<string>;
  position: Position | null;
  direction: Direction;
  size: { width: number; height: number };
  visited: Set<string>;
  visitedDir: Set<string>;
  _extraObst: string | null;
}

const parseInput = (input: string): State => {
  const res: State = {
    obstacles: new Set(),
    position: { x: 0, y: 0 },
    direction: "up",
    size: { height: 0, width: 0 },
    visited: new Set(),
    visitedDir: new Set(),
    _extraObst: null,
  };
  input.split("\n").forEach((line, y) => {
    res.size.height = y + 1;
    line.split("").forEach((cell, x) => {
      res.size.width = x + 1;
      if (cell === "#") {
        res.obstacles.add(`${x},${y}`);
      } else if (cell !== ".") {
        res.position = { x, y };
        switch (cell) {
          case "^":
            res.direction = "up";
            break;
          case "v":
            res.direction = "down";
            break;
          case "<":
            res.direction = "left";
            break;
          case ">":
            res.direction = "right";
            break;
        }
        res.visited.add(`${x},${y}`);
        res.visitedDir.add(`${x},${y},${res.direction}`);
      }
    });
  });
  return res;
};

const offset = (position: Position, direction: "up" | "down" | "left" | "right"): Position => {
  switch (direction) {
    case "up":
      return { x: position.x, y: position.y - 1 };
    case "down":
      return { x: position.x, y: position.y + 1 };
    case "left":
      return { x: position.x - 1, y: position.y };
    case "right":
      return { x: position.x + 1, y: position.y };
  }
};

const isOut = (position: Position, size: { width: number; height: number }): boolean => {
  return position.x < 0 || position.y < 0 || position.x >= size.width || position.y >= size.height;
};

const walk = (state: State, fast = false): State | null => {
  // console.log("WALK=======");
  const { position, direction } = state;
  if (position == null) {
    return state;
  }
  let nextPosition = offset(position, direction);
  const visited = new Set(state.visited);
  const visitedDir = new Set(state.visitedDir);
  if (fast) {
    while (true) {
      if (state.obstacles.has(`${nextPosition.x},${nextPosition.y}`) || isOut(nextPosition, state.size)) {
        break;
      }
      if (state.visitedDir.has(`${nextPosition.x},${nextPosition.y},${direction}`)) {
        console.log(printState(state));
        return null;
      }
      visited.add(`${nextPosition.x},${nextPosition.y}`);
      visitedDir.add(`${nextPosition.x},${nextPosition.y},${direction}`);
      nextPosition = offset(nextPosition, direction);
    }
  }
  // console.log({ position, nextPosition, direction });
  if (state.obstacles.has(`${nextPosition.x},${nextPosition.y}`)) {
    // console.log("turn");
    return turn({ ...state, visited, visitedDir }, "right");
  }
  if (isOut(nextPosition, state.size)) {
    // console.log("end");
    return { ...state, visited, visitedDir, position: null };
  }
  if (state.visitedDir.has(`${nextPosition.x},${nextPosition.y},${direction}`)) {
    // console.log(
    //   state.visitedDir,
    //   `${nextPosition.x},${nextPosition.y},${direction}`,
    //   state.visitedDir.has(`${nextPosition.x},${nextPosition.y},${direction}`)
    // );
    // console.log(printState(state));
    return null;
  }
  visited.add(`${nextPosition.x},${nextPosition.y}`);
  visitedDir.add(`${nextPosition.x},${nextPosition.y},${direction}`);
  // console.log("nextPosition", nextPosition);
  return { ...state, position: nextPosition, visited, visitedDir };
};

const turnDirection = (direction: Direction, turn: "left" | "right"): Direction => {
  const directions: Direction[] = ["up", "right", "down", "left"];
  return directions[(directions.indexOf(direction) + (turn === "left" ? 3 : 1)) % 4];
};

const turn = (state: State, d: "left" | "right"): State => {
  return { ...state, direction: turnDirection(state.direction, d) };
};

const printState = (state: State): string => {
  let res = "";
  for (let y = 0; y < state.size.height; y++) {
    for (let x = 0; x < state.size.width; x++) {
      if (state.position?.x === x && state.position?.y === y) {
        res += ["^", ">", "v", "<"][["up", "right", "down", "left"].indexOf(state.direction)];
      } else if (state.obstacles.has(`${x},${y}`)) {
        res += `${x},${y}` === state._extraObst ? COLOR.FgGreen + "█" + COLOR.Reset : "░";
      } else {
        res += state.visited.has(`${x},${y}`) ? "." : " ";
      }
    }
    res += "\n";
  }
  return res;
};

const isInLineWithVisited = (state: State): boolean => {
  const { position, direction } = state;
  if (position == null) {
    return false;
  }
  let n = direction === "down" || direction === "up" ? ("y" as const) : ("x" as const);
  let i = position[n];
  while (i >= 0 && i < state.size[n === "x" ? "width" : "height"]) {
    const p = { ...position, [n]: i };
    if (state.visitedDir.has(`${p.x},${p.y},${direction}`)) {
      return true;
    }
    i += direction === "down" || direction === "right" ? 1 : -1;
  }
  return false;
};

const isOnEdge = (state: State): boolean => {
  const { position } = state;
  if (position == null) {
    return false;
  }
  return (
    position.x === 0 || position.y === 0 || position.x === state.size.width - 1 || position.y === state.size.height - 1
  );
};

const cache = new Map<Set<string>, Map<string, number>>();
const stateToString = (state: State): string => {
  return `${state.position?.x},${state.position?.y},${state.direction}`;
};
const walkOut = (state: State, fast: boolean): number => {
  // let obstCache = cache.get(state.obstacles);
  // if (obstCache == null) {
  //   obstCache = new Map();
  //   cache.set(state.obstacles, obstCache);
  // }
  let s: State | null = state;
  while (s.position != null) {
    // const key = stateToString(s);
    // if (obstCache.has(key)) {
    //   return obstCache.get(key)!;
    // }
    s = walk(s, fast);
    // console.log(s?.position, s?.direction);
    if (s == null) {
      // obstCache.set(key, -1);
      return -1;
    }
  }
  // obstCache.set(stateToString(state), s.visited.size);
  return s.visited.size;
};

const part1: TaskPartSolution = (input) => {
  let state = parseInput(input);
  return walkOut(state, false);
};
const part2: TaskPartSolution = (input) => {
  let state: State = parseInput(input);
  // console.log(state.size);
  const loopCandidates: Set<string> = new Set<string>();
  let i = 0;
  const t0 = Date.now();
  while (state.position != null) {
    const nextPos = offset(state.position, state.direction);
    if (!state.obstacles.has(`${nextPos.x},${nextPos.y}`) && !state.visited.has(`${nextPos.x},${nextPos.y}`)) {
      const newObst = new Set(state.obstacles);
      newObst.add(`${nextPos.x},${nextPos.y}`);
      if (walkOut({ ...state, obstacles: newObst, _extraObst: `${nextPos.x},${nextPos.y}` }, false) === -1) {
        loopCandidates.add(`${nextPos.x},${nextPos.y}`);
        // console.log("found loop", nextPos);
      }
    }
    const nextState = walk(state);
    if (nextState == null) {
      // console.log(state, nextState);
      return -1; // should not happen, walk should go over first parts solution
    }
    state = nextState;
    i++;
    if (i % 10 === 0) {
      // console.log(i, (Date.now() - t0) / i);
    }
  }
  return loopCandidates.size;
};

const task = new Task(2024, 6, part1, part2, {
  part1: {
    input: `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`,
    result: "41",
  },
  part2: {
    input: `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`,
    result: "6",
  },
});

export default task;

/*

550 - low
1692 - high
1998 - high

*/
