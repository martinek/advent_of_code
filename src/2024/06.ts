import Task, { TaskPartSolution } from "../utils/task.js";

enum Direction {
  UP = 0,
  RIGHT = 1,
  DOWN = 2,
  LEFT = 3,
}

const RIGHT_TURN = [Direction.RIGHT, Direction.DOWN, Direction.LEFT, Direction.UP];

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
    direction: Direction.UP,
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
        res.direction = ["^", ">", "v", "<"].indexOf(cell);
        res.visited.add(`${x},${y}`);
        res.visitedDir.add(`${x},${y},${res.direction}`);
      }
    });
  });
  return res;
};

const offset = (position: Position, direction: Direction): Position => {
  switch (direction) {
    case Direction.UP:
      return { x: position.x, y: position.y - 1 };
    case Direction.DOWN:
      return { x: position.x, y: position.y + 1 };
    case Direction.LEFT:
      return { x: position.x - 1, y: position.y };
    case Direction.RIGHT:
      return { x: position.x + 1, y: position.y };
  }
};

const isOut = (position: Position, size: { width: number; height: number }): boolean => {
  return position.x < 0 || position.y < 0 || position.x >= size.width || position.y >= size.height;
};

const walk = (state: State): State | null => {
  const { position, direction } = state;
  if (position == null) {
    return state;
  }
  let nextPosition = offset(position, direction);
  if (state.obstacles.has(`${nextPosition.x},${nextPosition.y}`)) {
    state.direction = RIGHT_TURN[state.direction];
    return state;
  }
  if (isOut(nextPosition, state.size)) {
    state.position = null;
    return state;
  }
  if (state.visitedDir.has(`${nextPosition.x},${nextPosition.y},${direction}`)) {
    return null;
  }
  state.visited.add(`${nextPosition.x},${nextPosition.y}`);
  state.visitedDir.add(`${nextPosition.x},${nextPosition.y},${direction}`);
  state.position = nextPosition;
  return state;
};

const walkOut = (state: State): number => {
  let s: State | null = state;
  while (s.position != null) {
    s = walk(s);
    if (s == null) {
      return -1;
    }
  }
  return s.visited.size;
};

const part1: TaskPartSolution = (input) => {
  let state = parseInput(input);
  return walkOut(state);
};

const dupState = (state: State, override: Partial<State>): State => {
  return {
    ...state,
    obstacles: new Set(state.obstacles),
    visited: new Set(state.visited),
    visitedDir: new Set(state.visitedDir),
    ...override,
  };
};

const part2: TaskPartSolution = (input) => {
  let state: State = parseInput(input);
  const loopCandidates: Set<string> = new Set<string>();
  while (state.position != null) {
    const nextPos = offset(state.position, state.direction);
    if (!state.obstacles.has(`${nextPos.x},${nextPos.y}`) && !state.visited.has(`${nextPos.x},${nextPos.y}`)) {
      const newObst = new Set(state.obstacles);
      newObst.add(`${nextPos.x},${nextPos.y}`);
      if (walkOut(dupState(state, { obstacles: newObst, _extraObst: `${nextPos.x},${nextPos.y}` })) === -1) {
        loopCandidates.add(`${nextPos.x},${nextPos.y}`);
        // console.log("found loop", nextPos);
      }
    }
    const nextState = walk(state);
    if (nextState == null) {
      return -1; // should not happen, walk should go over first parts solution
    }
    state = nextState;
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
