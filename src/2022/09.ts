import Task, { TaskPartSolution } from "../utils/task.js";

const sampleInput = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`;

interface Position {
  x: number;
  y: number;
}

type Direction = "U" | "R" | "D" | "L";

const move = (pos: Position, dir: Direction): Position => {
  switch (dir) {
    case "U":
      return { ...pos, y: pos.y + 1 };
    case "D":
      return { ...pos, y: pos.y - 1 };
    case "R":
      return { ...pos, x: pos.x + 1 };
    case "L":
      return { ...pos, x: pos.x - 1 };
  }
};

const { abs } = Math;

const dragTail = (head: Position, tail: Position): Position => {
  const dx = head.x - tail.x;
  const dy = head.y - tail.y;

  // Special case for part2 where there can be diagonally gap of 1
  // if previous segment jumped
  if (abs(dx) === 2 && abs(dy) === 2) {
    return { x: tail.x + dx / 2, y: tail.y + dy / 2 };
  }
  if (abs(dx) > 1) {
    return { y: head.y, x: head.x + (head.x > tail.x ? -1 : +1) };
  }
  if (abs(dy) > 1) {
    return { x: head.x, y: head.y + (head.y > tail.y ? -1 : +1) };
  }
  return { ...tail };
};

const part1: TaskPartSolution = (input) => {
  const steps = input.split("\n").map((r) => {
    const [d, c] = r.split(" ");
    return [d as Direction, Number(c)] as const;
  });
  const tailVisited = new Set();
  let head: Position = { x: 0, y: 0 };
  let tail: Position = { x: 0, y: 0 };

  for (const step of steps) {
    const [direction, count] = step;
    for (let i = 0; i < count; i++) {
      head = move(head, direction);
      tail = dragTail(head, tail);
      tailVisited.add(tail.x + "_" + tail.y);
    }
  }

  return tailVisited.size.toString();
};

const sampleInput2 = `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`;

const ROPE_LENGTH = 10;

const printRope = (rope: Position[], minPos: Position, maxPos: Position) => {
  let res = "";
  for (let y = maxPos.y; y >= minPos.y; y--) {
    for (let x = minPos.x; x <= maxPos.x; x++) {
      res += rope.find((k) => k.x === x && k.y === y) ? "#" : ".";
    }
    res += "\n";
  }
  console.log(res);
};

const min = (p1: Position, p2: Position): Position => ({ x: Math.min(p1.x, p2.x), y: Math.min(p1.y, p2.y) });
const max = (p1: Position, p2: Position): Position => ({ x: Math.max(p1.x, p2.x), y: Math.max(p1.y, p2.y) });

const part2: TaskPartSolution = (input) => {
  const steps = input.split("\n").map((r) => {
    const [d, c] = r.split(" ");
    return [d as Direction, Number(c)] as const;
  });
  const tailVisited = new Set();
  const rope: Position[] = new Array(10).fill(1).map(() => ({ x: 0, y: 0 }));

  let minPos: Position = { x: 0, y: 0 };
  let maxPos: Position = { x: 0, y: 0 };

  for (const step of steps) {
    const [direction, count] = step;
    for (let i = 0; i < count; i++) {
      rope[0] = move(rope[0], direction);

      minPos = min(rope[0], minPos);
      maxPos = max(rope[0], maxPos);

      for (let j = 1; j < rope.length; j++) {
        rope[j] = dragTail(rope[j - 1], rope[j]);
        minPos = min(rope[j], minPos);
        maxPos = max(rope[j], maxPos);
      }

      const tail = rope[ROPE_LENGTH - 1];
      tailVisited.add(tail.x + "_" + tail.y);
    }
    // printRope(rope, minPos, maxPos);
  }

  const rope2: Position[] = new Array(10).fill(1).map(() => ({ x: 0, y: 0 }));
  for (const step of steps) {
    const [direction, count] = step;
    for (let i = 0; i < count; i++) {
      rope2[0] = move(rope2[0], direction);
      // console.log("HEAD", rope2[0]);
      for (let j = 1; j < rope2.length; j++) {
        // console.log(`dragTail(`, rope2[j - 1], `, `, rope2[j], `)`);
        rope2[j] = dragTail(rope2[j - 1], rope2[j]);
      }
      // printRope(rope2, minPos, maxPos);
    }
    // printRope(rope2, minPos, maxPos);
  }

  // console.log(minPos, maxPos);
  // printRope(rope, minPos, maxPos);

  return tailVisited.size.toString();
};

const task = new Task(2022, 9, part1, part2);

export default task;
