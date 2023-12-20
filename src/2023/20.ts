import { lcm } from "../utils/helpers.js";
import Task, { TaskPartSolution } from "../utils/task.js";

type PulseLevel = "high" | "low";
type Pulse = { source: string; target: string; level: PulseLevel };

interface Part {
  name: string;
  targets: string[];
  sources: string[];
  execute(pulse: Pulse): Pulse[];
  addTargets(...names: string[]): void;
  addSources(...names: string[]): void;
}

class Broadcaster implements Part {
  name: string;
  targets: string[] = [];
  sources: string[] = [];

  constructor(name: string, targets: string[]) {
    this.name = name;
    this.targets = targets;
  }

  addSources(...names: string[]): void {
    this.sources.push(...names);
  }

  addTargets(...names: string[]): void {
    this.targets.push(...names);
  }

  execute(pulse: Pulse): Pulse[] {
    return this.targets.map((target) => ({ level: pulse.level, source: this.name, target }));
  }
}

class FlipFlop implements Part {
  name: string;
  targets: string[] = [];
  sources: string[] = [];
  _state: "on" | "off" = "off";

  constructor(name: string) {
    this.name = name;
  }

  execute(pulse: Pulse) {
    const pulses: Pulse[] = [];
    if (pulse.level === "low") {
      this._state = this._state === "on" ? "off" : "on";
      const level: PulseLevel = this._state === "on" ? "high" : "low";
      this.targets.forEach((target) => pulses.push({ level, source: this.name, target }));
    }
    return pulses;
  }

  addTargets(...targets: string[]) {
    this.targets.push(...targets);
  }

  addSources(...names: string[]) {
    this.sources.push(...names);
  }
}

class Conjuctor implements Part {
  name: string;
  targets: string[] = [];
  sources: string[] = [];
  _states: Record<string, PulseLevel> = {};

  constructor(name: string) {
    this.name = name;
  }

  execute(pulse: Pulse): Pulse[] {
    const pulses: Pulse[] = [];

    this._states[pulse.source] = pulse.level;
    const level: PulseLevel = Object.values(this._states).every((l) => l === "high") ? "low" : "high";
    this.targets.forEach((target) => pulses.push({ level, source: this.name, target }));

    return pulses;
  }

  addTargets(...targets: string[]) {
    this.targets.push(...targets);
  }

  addSources(...sources: string[]) {
    this.sources.push(...sources);
    sources.forEach((s) => {
      this._states[s] = "low";
    });
  }
}

class Machine {
  counter: { high: number; low: number; activations: number };
  _broadcaster: Part | undefined;
  _parts: Record<string, Part> = {};

  constructor() {
    this.counter = { high: 0, low: 0, activations: 0 };
  }

  addBroadcaster(name: string, targets: string[]) {
    const p = new Broadcaster(name, targets);
    this._broadcaster = p;
    this._parts[name] = p;
  }

  addFlipFlop(name: string, targets: string[]) {
    const p = new FlipFlop(name);
    p.addTargets(...targets);
    this._parts[name] = p;
  }

  addConjuctor(name: string, targets: string[]) {
    const p = new Conjuctor(name);
    p.addTargets(...targets);
    this._parts[name] = p;
  }

  connect() {
    for (const part in this._parts) {
      this._parts[part].targets.forEach((t) => {
        if (this._parts[t]) {
          this._parts[t].addSources(part);
        }
      });
    }
  }

  activate() {
    this.counter.activations += 1;
    this.counter.low += 1;
    const pulses = this._broadcaster!.execute({ level: "low", source: "", target: "" });
    while (pulses.length > 0) {
      const pulse = pulses.shift()!;
      this.counter[pulse.level] += 1;
      if (this._parts[pulse.target]) {
        const newPulses = this._parts[pulse.target].execute(pulse);
        pulses.push(...newPulses);
      }
    }
  }

  detectPending(target: string) {
    const end = Object.values(this._parts).find((p) => p.targets[0] === target)!;
    return end.sources;
  }

  activate2(pending: string[]) {
    const cycles: number[] = [];
    let newPending = [...pending];

    this.counter.activations += 1;
    this.counter.low += 1;
    const pulses = this._broadcaster!.execute({ level: "low", source: "", target: "" });
    while (pulses.length > 0) {
      const pulse = pulses.shift()!;
      if (pulse.level === "low" && newPending.includes(pulse.target)) {
        newPending = newPending.filter((p) => p !== pulse.target);
        cycles.push(this.counter.activations);
      }
      this.counter[pulse.level] += 1;
      if (this._parts[pulse.target]) {
        const newPulses = this._parts[pulse.target].execute(pulse);
        pulses.push(...newPulses);
      }
    }

    return { cycles, pending: newPending };
  }
}

const parseInput = (input: string): Machine => {
  const m = new Machine();
  input.split("\n").forEach((row) => {
    const [n, t] = row.split(" -> ");
    const name = n.slice(1);
    const targets = t.split(", ");
    if (row[0] === "%") {
      m.addFlipFlop(name, targets);
    }
    if (row[0] === "&") {
      m.addConjuctor(name, targets);
    }
    if (row.startsWith("broadcaster")) {
      m.addBroadcaster("broadcaster", targets);
    }
  });
  m.connect();
  return m;
};

const part1: TaskPartSolution = (input) => {
  const machine = parseInput(input);
  for (let i = 0; i < 1000; i++) {
    machine.activate();
  }
  return machine.counter.high * machine.counter.low;
};

const part2: TaskPartSolution = (input) => {
  const machine = parseInput(input);

  // This will only work for specific structures (but should work for all inputs from the day)
  let pending = machine.detectPending("rx");
  const cycles: number[] = [];

  while (pending.length > 0) {
    const r = machine.activate2(pending);
    cycles.push(...r.cycles);
    pending = r.pending;
  }

  return lcm(cycles);
};

const task = new Task(2023, 20, part1, part2, {
  //   part1: {
  //     input: `broadcaster -> a, b, c
  // %a -> b
  // %b -> c
  // %c -> inv
  // &inv -> a`,
  //     result: "32000000",
  //   },
  part1: {
    input: `broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output`,
    result: "11687500",
  },
  part2: {
    input: ``,
    result: "",
  },
});

export default task;
