import fs from "fs";
import path from "path";
import fetch from "node-fetch";

type TaskResult = string | number | undefined | void;
export type TaskPartSolution = (input: string) => TaskResult;

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

  constructor(
    year: number,
    day: number,
    partOne?: TaskPartSolution | undefined,
    partTwo?: TaskPartSolution | undefined,
    tests?: TaskTestSuite
  ) {
    this.year = year;
    this.day = day;
    this.partOne = partOne;
    this.partTwo = partTwo;
    this.tests = tests;
  }

  async exec(part: string | undefined): Promise<[TaskResult, TaskResult]> {
    const input = await this.loadInput();

    const partOneResult = part === undefined || part === "1" ? this.partOne?.(input) : "-";
    const partTwoResult = part === undefined || part === "2" ? this.partTwo?.(input) : "-";

    return [partOneResult, partTwoResult];
  }

  async test(part: string | undefined): Promise<[TaskResult, TaskResult]> {
    if (this.tests == null) {
      throw new Error("Task does not have tests");
    }

    return [this.testPart(part, 1), this.testPart(part, 2)];
  }

  private testPart(part: string | undefined, pt: number): TaskResult {
    if (part === undefined || part === pt.toString()) {
      const solution = pt === 1 ? this.partOne : this.partTwo;
      const test = pt === 1 ? this.tests?.part1 : this.tests?.part2;

      if (solution == null) return `No solution for part${pt}`;
      if (test == null) return `No test for part${pt}`;

      const solutionResult = solution(test.input)?.toString();
      const pass = solutionResult === test.result;

      if (!pass) {
        console.warn(`Solution failed.\nExpected result: ${test.result}\nSolution result: ${solutionResult}`);
      }

      return pass ? "Pass" : "Fail";
    } else {
      return "Skipped";
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
}

export default Task;
