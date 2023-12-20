import Task, { TaskPartSolution } from "../utils/task.js";

type Part = { x: number; m: number; a: number; s: number };
type PartAttribute = keyof Part;
const ATTRIBUTES: PartAttribute[] = ["a", "m", "s", "x"];

type Condition = { attr: PartAttribute; num: number; sym: "<" | ">"; action: string };
type Workflow = { name: string; conditions: Condition[]; action: string };
type Workflows = Record<string, Workflow>;

const parseInput = (input: string): [Workflows, Part[]] => {
  const [wf, pts] = input.split("\n\n");
  const workflows = wf
    .split("\n")
    .map((r) => {
      const [name, desc] = r.slice(0, -1).split("{");
      const pts = desc.split(",");
      const conditions = pts.slice(0, -1).map((cmd) => {
        const [ac, a] = cmd.split(":");
        const [attr, sym, n] = ac.split(/([><])/);
        const num = Number(n);

        if (!(ATTRIBUTES as string[]).includes(attr)) throw new Error(`Invalid attribute "${attr}"`);
        if (sym !== "<" && sym !== ">") throw new Error(`Invalid symbol "${sym}"`);
        if (isNaN(num)) throw new Error(`Invalid number "${n}"`);

        const condition: Condition = {
          action: a,
          attr: attr as PartAttribute,
          num,
          sym,
        };
        return condition;
      });
      const workflow: Workflow = {
        name,
        action: pts[pts.length - 1],
        conditions,
      };
      return workflow;
    })
    .reduce<Record<string, Workflow>>((acc, wf) => {
      acc[wf.name] = wf;
      return acc;
    }, {});
  // console.log("workflows", ...workflows);

  const parts = pts.split("\n").map((pt) => {
    const part: Part = { a: 0, m: 0, s: 0, x: 0 };
    pt.slice(1, -1)
      .split(",")
      .forEach((s) => {
        const [k, v] = s.split("=");
        part[k as PartAttribute] = Number(v);
      });
    return part;
  });
  // console.log("parts", ...parts);

  return [workflows, parts];
};

const executeWorkflow = (part: Part, wf: Workflow): string => {
  for (const { attr, num, sym, action } of wf.conditions) {
    if (sym === "<") {
      if (part[attr] < num) return action;
    } else {
      if (part[attr] > num) return action;
    }
  }
  return wf.action;
};

const executePart = (part: Part, wfs: Workflows): boolean => {
  let key = "in";
  while (key !== "R" && key !== "A") {
    key = executeWorkflow(part, wfs[key]);
  }
  return key === "A";
};

const countParts = (parts: Part[]) => {
  return parts.reduce((acc, pt) => {
    return acc + pt.a + pt.m + pt.s + pt.x;
  }, 0);
};

const part1: TaskPartSolution = (input) => {
  const [workflows, parts] = parseInput(input);
  const results = parts.filter((pt) => executePart(pt, workflows));
  return countParts(results);
};

type Range = { wf: string; min: Part; max: Part };
const dupRange = (r: Range, wf: string): Range => ({ max: { ...r.max }, min: { ...r.min }, wf });

const part2: TaskPartSolution = (input) => {
  const [workflows] = parseInput(input);

  const ranges: Range[] = [{ wf: "in", max: { a: 4000, m: 4000, s: 4000, x: 4000 }, min: { a: 1, m: 1, s: 1, x: 1 } }];
  let sum = 0;

  while (ranges.length > 0) {
    const range = ranges.shift()!;

    if (range.wf === "R") continue;
    if (range.wf === "A") {
      sum +=
        (1 + range.max.a - range.min.a) *
        (1 + range.max.m - range.min.m) *
        (1 + range.max.s - range.min.s) *
        (1 + range.max.x - range.min.x);
      // console.log("A:", ATTRIBUTES.map((c) => `${c}: [${range.min[c]} => ${range.max[c]}]`).join(" "));
      continue;
    }

    const wf = workflows[range.wf];
    for (const condition of wf.conditions) {
      // On each condition split current range into two, based on condition
      // Add new "positive" one to ranges with the proper wf action
      // and leave the "remaining" range for next condition
      const { action, attr, num, sym } = condition;
      const next = dupRange(range, action);
      if (sym === "<") {
        // If condition is X < number, new range is up to number
        // min and max ensure that the new range is not more than original range
        next.max[attr] = Math.min(next.max[attr], num - 1);
        ranges.push(next);
        range.min[attr] = Math.max(range.min[attr], next.max[attr] + 1);
      } else if (sym === ">") {
        // If condition is X > number, new range is from number and larger
        // min and max ensure that the new range is not more than original range
        next.min[attr] = Math.max(next.min[attr], num + 1);
        ranges.push(next);
        range.max[attr] = Math.min(range.max[attr], next.min[attr] - 1);
      }
    }

    // Add the remaining range to ranges with default wf action
    ranges.push(dupRange(range, wf.action));
  }

  return sum;
};

const task = new Task(2023, 19, part1, part2, {
  part1: {
    input: `px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`,
    result: "19114",
  },
  part2: {
    input: `px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`,
    result: "167409079868000",
  },
});

export default task;
