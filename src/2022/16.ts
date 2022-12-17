import Task, { TaskPartSolution } from "../utils/task.js";

const sampleInput = `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`;

interface Neighbor {
  key: string;
  dist: number;
}

interface Node {
  key: string;
  value: number;
  neighbors: Neighbor[];
}

interface Graph {
  [key: string]: Node;
}

const printGraph = (graph: Graph) => {
  Object.keys(graph)
    .sort((a, b) => a.localeCompare(b))
    .forEach((k) => {
      const n = graph[k];
      console.log(
        `Node ${n.key}; value: ${n.value}; neighbors: ${n.neighbors.map((nn) => `${nn.key} (${nn.dist})`).join(", ")}`
      );
    });
};

const explainPath = (graph: Graph, totalTime: number, path: string[]) => {
  let totalPressure = 0;
  let i = 1;
  const open = new Set<Node>();

  const logHead = (i: number, o: Set<Node>) => {
    console.log(`\n== Minute ${i} ==`);

    if (o.size === 0) console.log("No valves are open.");
    else {
      const flow = Array.from(o).reduce((acc, n) => acc + n.value, 0);
      totalPressure += flow;
      console.log(`Valves ${strSet(o)} are open, releasing ${flow} pressure. Total: ${totalPressure}`);
    }
  };

  let prevNode = graph[path[0]];

  for (const node of path.slice(1)) {
    const [key, isOpen] = node.split("_");
    const dist = prevNode.neighbors.find((n) => n.key === key)?.dist;
    if (dist == null) {
      console.log(prevNode.neighbors, key);
      process.exit(1);
    }

    for (let j = 0; j < dist; j++) {
      logHead(i, open);
      console.log(`You go to valve ${key}`);
      i++;
    }

    if (isOpen) {
      logHead(i, open);
      console.log(`You open valve ${key}`);
      open.add(graph[key]);
      i++;
    }

    prevNode = graph[key];
  }

  while (i <= totalTime) {
    logHead(i, open);
    i++;
  }
};

const strSet = (set: Set<Node>): string => {
  return Array.from(set)
    .map((n) => n.key)
    .join(" ");
};

const buildGraph = (input: string) =>
  input.split("\n").reduce<{ [key: string]: Node }>((acc, row) => {
    const [_, key, flowString, n] = row.match(
      /Valve (\w+) has flow rate=(\d+); tunnel[s]? lead[s]? to valve[s]? (.*)/
    )!;
    acc[key] = {
      key,
      value: Number(flowString),
      neighbors: n.split(", ").map((key) => ({ key, dist: 1 })),
    };
    return acc;
  }, {});

const reduceGraph = (graph: Graph) => {
  const newGraph: Graph = Object.fromEntries(
    Object.values(graph)
      .map((n) => ({ ...n, neighbors: n.neighbors.map((nn) => ({ ...nn })) }))
      .map((n) => [n.key, n])
  );
  const nodes = Object.values(newGraph);

  for (const node of nodes) {
    if (node.value === 0) {
      if (node.key === "AA") continue;

      node.neighbors.forEach((n1) => {
        const n = newGraph[n1.key]; // direct neighborNode
        const other = n.neighbors.find(({ key: k }) => k === node.key)!;
        // remove other from neighborNode (since this node will be removed)
        n.neighbors = n.neighbors.filter((a) => a !== other);

        // add all my neighbors to neighborNode neighbors
        for (const n2 of node.neighbors) {
          // skip neighborNode
          if (n2.key === n1.key) continue;
          const dist = n2.dist + n1.dist;

          const existingN2N = n.neighbors.find((a) => a.key === n2.key);

          if (existingN2N == null) {
            // if neighborNode does not have n2 neighbor yet, create it with distance
            n.neighbors.push({ key: n2.key, dist });
          } else {
            // if neighborNode already have my neighbor, update dist only if lower then thorugh me
            existingN2N.dist = Math.min(existingN2N.dist, dist);
          }
        }
      });

      delete newGraph[node.key];
    }
  }

  return newGraph;
};

class State {
  open: Set<Node>;
  flow: number;
  time: number;
  pressure: number;

  constructor(open: Set<Node>, flow: number, time: number, pressure: number) {
    this.open = new Set(open);
    this.flow = flow;
    this.time = time;
    this.pressure = pressure;
  }

  tick(count: number) {
    return new State(this.open, this.flow, this.time - count, this.pressure + this.flow * count);
  }

  openNode(node: Node) {
    // console.log("open node", node.key);
    const newOpen = new Set(this.open);
    newOpen.add(node);
    return new State(newOpen, this.flow + node.value, this.time - 1, this.pressure + this.flow);
  }

  maxPressure(otherPressure: number) {
    // console.log("maxPressure?", this.pressure, otherPressure);
    if (this.pressure > otherPressure) {
      console.log("New max", this.pressure, strSet(this.open));
      return this.pressure;
    }
    return otherPressure;
  }

  canOpenNode(node: Node) {
    return (
      node.value > 0 && // node has value
      !this.open.has(node) && // node is not open yet
      this.time >= 2
    ); // there will be time to at least open and tick (2 seconds)
  }
}

const solveGraph = (graph: Graph, maxTime: number): number => {
  let maxPressure = 0;
  let maxPath: string[] = [];
  let currentNode = graph["AA"];
  const nodesWithFlow = Object.values(graph).filter((n) => n.value > 0);

  const handlePressure = (p: number, path: string[]) => {
    // console.log("maxPressure?", this.pressure, otherPressure);
    if (p > maxPressure) {
      console.log("New max", p, path.join(" "));
      maxPressure = p;
      maxPath = path;
    }
  };

  const checkNode = (node: Node, inState: State, from: Node | null, currentPath: string[]) => {
    let state = inState;
    // console.log(currentPath.join(">"));
    // This should not be used, make sure to not enter node if there is no time to process it
    if (state.time < 0) {
      console.error("Time left should not be less then 0", state.time);
      process.exit(1);
    }

    // const path = [...currentPath, `${node.key}[${state.flow}-${state.time}]`];
    // const path = [...currentPath, node.key];
    let log = (...args: any[]) => {};
    // let log = (...args: any[]) => console.log(`${path.length} - `, ...args);
    // let log = (...args: any[]) => {};
    // if (
    //   // path.join(" ").startsWith("AA[0] DD[0] CC BB AA II JJ II AA DD EE FF GG HH GG") &&
    //   currentPath
    //     .join(" ")
    //     .startsWith("AA OU VX XD_open CD LU_open BT KS_open QA YC_open FQ AJ LU CZ HJ_open ZE SX_open LV HQ_open")
    //   // "AA[0] DD[0] CC[20] BB[20] AA[33] II[33] JJ[33] II[54] AA[54] DD[54] EE[54] FF[54] GG[54] HH[54] GG[76] FF[76] EE[76] DD[79]"
    //   // currentPath.join(" ") ===
    //   // "AA[0-31] DD[0-30] CC[20-28] BB[20-27] AA[33-25] II[33-24] JJ[33-23] II[54-21] AA[54-20] DD[54-19] EE[54-18] FF[54-17] GG[54-16] HH[54-15] GG[76-13] FF[76-12] EE[76-11] DD[79-9] CC[79-8]"
    //   // (path.join(" ").startsWith("AA[0] DD[0] CC[20] BB[20]") && path.length === 4)
    //   // strSet(state.open).startsWith("DD BB JJ")
    // ) {
    //   log = (...args) => console.log(`${currentPath.length} - `, ...args);
    //   log(currentPath.join(" "));
    //   // console.log(state.time, strSet(state.open));
    // }

    // If by the time of walking to this node, time runs out, return
    if (state.time === 0) {
      console.log("time out", state);
      handlePressure(state.pressure, currentPath);
      return;
    }

    // // Check what would pressure be if we just waited
    // if (state.flow > 0) {
    //   const endState = state.tick(state.time);
    //   maxPressure = endState.maxPressure(maxPressure);
    // }

    // check every neighbor
    node.neighbors.forEach((n) => {
      if (n.key === from?.key) return; // skip node we came from
      // Only enter node, if there is enough time to do something
      // log(n.key);
      // log(n.dist, state.time);
      if (n.dist < state.time) {
        // Accumulate pressure while walking to the node
        const lstate = state.tick(n.dist);
        // if (node.key === "CC" && n.key === "BB") {
        log(`entering without open ${n.key}[${lstate.time}]`);
        // }
        checkNode(graph[n.key], lstate, node, [...currentPath, node.key]);
      }
    });

    // check, if waiting in this place
    const estate = state.tick(state.time);
    handlePressure(estate.pressure, [...currentPath, node.key]);

    // only check the other scenario if node has value and is not opened yet
    if (state.canOpenNode(node)) {
      // log("beforeOpen", state.time);
      const ostate = state.openNode(node);
      // log("afterOpen", ostate.time);

      // check if all nodes are open, if yes, just add flow for remaining time
      log("afterOpen", ostate.open.size, nodesWithFlow.length);
      if (ostate.open.size === nodesWithFlow.length) {
        const estate = ostate.tick(state.time);
        handlePressure(estate.pressure, [...currentPath, `${node.key}_open`]);
        return;
      }

      // check every neighbor
      node.neighbors.forEach((n) => {
        // Only enter node, if there is enough time to do something
        log("distCheck", n.dist, ostate.time);
        if (n.dist < ostate.time) {
          // Accumulate pressure while walking to the node
          const lstate = ostate.tick(n.dist);
          log(`entering with open ${n.key}[${lstate.time}]`);
          checkNode(graph[n.key], lstate, node, [...currentPath, `${node.key}_open`]);
        }
      });

      const estate = state.tick(state.time);
      handlePressure(estate.pressure, [...currentPath, node.key]);
    }
  };

  checkNode(currentNode, new State(new Set(), 0, maxTime - 1, 0), null, []);

  explainPath(graph, maxTime, maxPath);

  return maxPressure;
};

const part1: TaskPartSolution = (input) => {
  const graph = buildGraph(sampleInput);
  const smallG = reduceGraph(graph);

  // console.log("GRAPH");
  // printGraph(graph);

  console.log("SMALL GRAPH");
  printGraph(smallG);

  const maxTime = 30;
  return solveGraph(smallG, maxTime);
  // return solveGraph(smallG, maxTime);
};

const part2: TaskPartSolution = (input) => "";

const task = new Task(2022, 16, part1, part2);

export default task;
