import Task, { TaskPartSolution } from "../utils/task.js";

const heights = Object.fromEntries("abcdefghijklmnopqrstuvwxyz".split("").map((l, i) => [l, i]));

const sampleInput = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;

interface Node {
  key: string;
  x: number;
  y: number;
  height: number;
  letter: string;
  neighbors: Node[];
}

const NULL_NODE: Node = { height: -1, key: "", letter: "", neighbors: [], x: -1, y: -1 };

class Map {
  graph: Node[];
  start = NULL_NODE;
  end = NULL_NODE;

  constructor(input: string) {
    this.graph = [];
    input.split("\n").forEach((row, y) => {
      row.split("").forEach((cell, x) => {
        const node: Node = {
          key: `${x}_${y}`,
          letter: cell,
          height: this.letterValue(cell),
          x,
          y,
          neighbors: [],
        };
        this.graph.push(node);
        if (cell === "S") this.start = node;
        if (cell === "E") this.end = node;
      });
    });

    this.graph.forEach((node) => {
      for (const nearNode of this.nearNodes(node)) {
        if (nearNode.height <= node.height + 1) {
          node.neighbors.push(nearNode);
        }
      }
    });
  }

  solve() {
    const path = this.findPath(this.start, this.end);

    if (!path) {
      console.log("UUUUPS");
      return "";
    }

    return (path.length - 1).toString();
  }

  findPath(from: Node, target: Node): Node[] | undefined {
    const pending: Node[] = [...this.graph];
    const distances: { [key: string]: number } = {};
    const prev: { [key: string]: Node } = {};

    pending.forEach((node) => {
      distances[node.key] = Number.MAX_VALUE;
    });

    distances[from.key] = 0;

    while (pending.length > 0) {
      pending.sort((a, b) => distances[a.key] - distances[b.key]);
      // pending.forEach((p) => console.log(`${p.key}: ${distances[p.key]}`));
      const next = pending.shift()!;
      // console.log(next);
      if (next === target) {
        // console.log("END");
        let current = target;
        const path = [];
        while (current) {
          path.unshift(current);
          current = prev[current.key];
        }
        return path;
      }

      for (const nei of next.neighbors.filter((n) => pending.includes(n))) {
        const alt = distances[next.key] + 1;
        if (alt < distances[nei.key]) {
          distances[nei.key] = alt;
          prev[nei.key] = next;
        }
      }
    }

    return;
  }

  private letterValue(l: string) {
    if (l === "S") return heights["a"];
    if (l === "E") return heights["z"];
    return heights[l];
  }

  private nearNodes({ x, y }: Node) {
    return this.graph.filter(({ x: nx, y: ny }) => {
      return (
        (ny === y && (nx === x + 1 || nx === x - 1)) || // same row +- 1
        (nx === x && (ny === y + 1 || ny === y - 1)) // same col +- 1
      );
    });
  }
}

const part1: TaskPartSolution = (input) => {
  const map = new Map(input);
  return map.solve();
};

class Map2 {
  graph: Node[];
  start = NULL_NODE;

  constructor(input: string) {
    this.graph = [];
    input.split("\n").forEach((row, y) => {
      row.split("").forEach((cell, x) => {
        const node: Node = {
          key: `${x}_${y}`,
          letter: cell,
          height: this.letterValue(cell),
          x,
          y,
          neighbors: [],
        };
        this.graph.push(node);
        if (cell === "E") this.start = node;
      });
    });

    this.graph.forEach((node) => {
      for (const nearNode of this.nearNodes(node)) {
        if (node.height <= nearNode.height + 1) {
          node.neighbors.push(nearNode);
        }
      }
    });
  }

  solve() {
    const shortest = this.findShortest(this.start, 0);

    if (!shortest) return "";

    return (shortest.length - 1).toString();
  }

  findShortest(from: Node, elev: number): Node[] | undefined {
    const pending: Node[] = [...this.graph];
    const distances: { [key: string]: number } = {};
    const prev: { [key: string]: Node } = {};

    pending.forEach((node) => {
      distances[node.key] = Number.MAX_VALUE;
    });

    distances[from.key] = 0;

    while (pending.length > 0) {
      pending.sort((a, b) => distances[a.key] - distances[b.key]);
      const next = pending.shift()!;

      for (const nei of next.neighbors.filter((n) => pending.includes(n))) {
        const alt = distances[next.key] + 1;
        if (alt < distances[nei.key]) {
          distances[nei.key] = alt;
          prev[nei.key] = next;
        }
      }
    }

    const closest = this.graph
      .filter((n) => n.height === elev)
      .sort((n1, n2) => distances[n1.key] - distances[n2.key])[0];

    if (!closest) return undefined;

    let current = closest;
    const path = [];
    while (current) {
      path.unshift(current);
      current = prev[current.key];
    }
    return path;
  }

  private letterValue(l: string) {
    if (l === "S") return heights["a"];
    if (l === "E") return heights["z"];
    return heights[l];
  }

  private nearNodes({ x, y }: Node) {
    return this.graph.filter(({ x: nx, y: ny }) => {
      return (
        (ny === y && (nx === x + 1 || nx === x - 1)) || // same row +- 1
        (nx === x && (ny === y + 1 || ny === y - 1)) // same col +- 1
      );
    });
  }
}

const part2: TaskPartSolution = (input) => {
  const map = new Map2(input);
  return map.solve();
};

const task = new Task(2022, 12, part1, part2);

export default task;
