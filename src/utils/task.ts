import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { lPad } from "./helpers.js";

type TaskResult = string | number | undefined | void;
export type TaskPartSolution = (input: string) => TaskResult | Promise<TaskResult>;

type TaskRunResult = {
  result: TaskResult;
  time: string;
} | null;

interface TaskPartTestSuite {
  input: string;
  result: string;
}
interface TaskTestSuite {
  part1?: TaskPartTestSuite;
  part2?: TaskPartTestSuite;
}

class Task {
  year: number;
  day: number;
  partOne: TaskPartSolution | undefined;
  partTwo: TaskPartSolution | undefined;
  tests: TaskTestSuite | undefined;
  input: string | undefined;

  constructor(
    year: number,
    day: number,
    partOne?: TaskPartSolution | undefined,
    partTwo?: TaskPartSolution | undefined,
    tests?: TaskTestSuite,
    input?: string
  ) {
    this.year = year;
    this.day = day;
    this.partOne = partOne;
    this.partTwo = partTwo;
    this.tests = tests;
    this.input = input;
  }

  async exec(part: string | undefined): Promise<[TaskRunResult, TaskRunResult]> {
    const input = this.input ?? (await this.loadInput());

    return [await this.execPart(part, 1, input), await this.execPart(part, 2, input)];
  }

  private async execPart(part: string | undefined, pt: number, input: string): Promise<TaskRunResult> {
    let solution: TaskPartSolution | undefined;

    if (part === undefined || part === pt.toString()) {
      solution = pt === 1 ? this.partOne : this.partTwo;
    }

    if (solution == null) {
      return null;
    }

    const tStart = process.hrtime();
    const r = solution(input);
    const result = (r instanceof Promise ? await r : r)?.toString();
    const time = process.hrtime(tStart);

    return {
      result,
      time: this.formatTime(time),
    };
  }

  async test(part: string | undefined): Promise<[TaskRunResult, TaskRunResult]> {
    if (this.tests == null) {
      throw new Error("Task does not have tests");
    }

    return [await this.testPart(part, 1), await this.testPart(part, 2)];
  }

  private async testPart(part: string | undefined, pt: number): Promise<TaskRunResult> {
    if (part === undefined || part === pt.toString()) {
      const solution = pt === 1 ? this.partOne : this.partTwo;
      const test = pt === 1 ? this.tests?.part1 : this.tests?.part2;

      if (solution == null) return { result: `No solution for part${pt}`, time: "-" };
      if (test == null) return { result: `No test for part${pt}`, time: "-" };

      const tStart = process.hrtime();
      const r = solution(test.input);
      const result = (r instanceof Promise ? await r : r)?.toString();
      const time = process.hrtime(tStart);

      const pass = result === test.result;

      return {
        result: pass ? `Pass: ${result}` : `Fail\nExpected result: ${test.result}\nSolution result: ${result}`,
        time: this.formatTime(time),
      };
    } else {
      return null;
    }
  }

  private async fetchInput() {
    const url = `https://adventofcode.com/${this.year}/day/${this.day}/input`;
    const USER_AGENT = process.env["USER_AGENT"];
    const SESSION = process.env["SESSION"];

    if (USER_AGENT == null || SESSION == null) {
      console.error("Missing USER_AGENT or SESSION env variable");
      process.exit(1);
    }

    const headers = {
      "user-agent": USER_AGENT,
      cookie: `session=${SESSION}`,
    };

    const result = await fetch(url, { headers });
    if (result.status !== 200) {
      console.error("Could not load input:", await result.text());
      process.exit(1);
    }

    return await result.text();
  }

  private async loadInput() {
    const cachePath = path.dirname("") + "/.cache";
    if (!fs.existsSync(cachePath)) {
      console.log("Creating input cache");
      fs.mkdirSync(cachePath);
    }

    const inputPath = cachePath + `/${this.year}-${this.day}_input.txt`;
    if (!fs.existsSync(inputPath)) {
      let input = await this.fetchInput();
      if (input.endsWith("\n")) {
        input = input.slice(0, -1);
      }
      fs.writeFileSync(inputPath, input);
    }

    return fs.readFileSync(inputPath).toString();
  }

  private formatTime(t: [number, number]) {
    return `${t[0]}.${lPad(t[1].toString(), 9, "0")}`;
  }
}

export default Task;
