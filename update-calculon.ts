import dotenv from "dotenv";
import Task from "./src/utils/task.js";
dotenv.config();

import { Command } from "commander";
import fs from "fs";
import { COLOR, lPad } from "./src/utils/helpers.js";

const program = new Command()
  .option("-t, --test", "run task tests")
  .argument("[string]", "task identifier in form of YYYY-DD or YYYY-DD-P");

const invalidTarget = (t?: string) => {
  console.log(`Missing / invalid task identifier${t ? ` (${t})` : ""}
  Use format YYYY-DD-P where:
    YYYY - Year, optional. If omitted, current year will be used.
    DD   - Day, required. Uses two digit format (ie. 04)
    P    - Task part, optional. If ommited, both parts will be run.
  `);
  process.exit(1);
};

interface Target {
  year: string;
  day: string;
  part?: string;
}

const parseTarget = (target?: string): Target => {
  if (target == null) {
    const d = new Date();
    target = `${d.getFullYear()}-${lPad(d.getDate().toString(), 2, "0")}`;
  }

  let [year, day, part] = target.split("-");
  if (year.length === 2) {
    part = day;
    day = year;
    year = new Date().getFullYear().toString();
  }

  if (year.length !== 4 || day.length !== 2 || (part != null && part.length !== 1)) {
    return invalidTarget(`${year}-${day}-${part}`);
  }

  return { year, day, part };
};

const getTask = async (target: Target): Promise<Task> => {
  const { year, day } = target;
  if (!fs.existsSync(`./src/${year}/${day}.ts`)) {
    const template = fs.readFileSync(`./src/utils/_template.ts.txt`).toString();
    const taskFileContent = template
      .replaceAll("%YEAR%", Number(year).toString())
      .replaceAll("%DAY%", Number(day).toString());
    fs.writeFileSync(`./src/${year}/${day}.ts`, taskFileContent);
  }

  const task = (await import(`./src/${year}/${day}.js`)).default as Task;
  return task;
};

const resolveTask = async (): Promise<{ target: Target; task: Task }> => {
  const options = program.parse();
  const target = parseTarget(options.args[0]);
  const task = await getTask(target);
  return { target, task };
};

class Calculon {
  baseUrl: string;
  token: string;

  constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  async getSets(): Promise<{ id: string; key: string }[]> {
    return (await this.fetch("/api/v1/input_sets")).json();
  }

  async getInput(setId: string, inputKey: string): Promise<string> {
    return (await this.fetch(`/api/v1/input/${setId}/${inputKey}`)).text();
  }

  async updateInput(setId: string, inputKey: string, answer1: string, answer2: string): Promise<any> {
    const body = JSON.stringify({ answer1, answer2 });
    return this.fetch(`/api/v1/input/${setId}/${inputKey}`, { method: "POST", body });
  }

  private async fetch(path: string, requestInit?: RequestInit): Promise<Response> {
    // const url = `https://calculon.lstme.sk${path}`;
    const url = `${this.baseUrl}${path}`;
    const headers = {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    };

    const result = await fetch(url, { headers, ...requestInit });
    if (result.status !== 200) {
      console.error("Could not load input:", await result.text());
      process.exit(1);
    }

    return result;
  }
}

async function main() {
  const { target, task } = await resolveTask();
  console.log(`Running task of day #${target.day}!`);

  // console.log(task);

  const { day, year } = task;
  const inputKey = `${year}_${day}`;

  const calculon = new Calculon(process.env.CALCULON_URL || "", process.env.CALCULON_TOKEN || "");

  const sets = await calculon.getSets();
  const setIds = sets.map((i) => i.id);

  for (const setId of setIds) {
    process.stdout.write(`Fetching input - ${setId} | ${inputKey}`);
    const input = await calculon.getInput(setId, inputKey);
    task.input = input;
    const [answer1, answer2] = await task.exec(undefined);

    if (answer1?.result == null || answer2?.result == null) {
      console.log("Task did not return answers");
      return;
    }

    const a1 = answer1.result.toString();
    const a2 = answer2.result.toString();
    process.stdout.write(`    Submitting answers - ${a1} | ${a2}`);
    calculon.updateInput(setId, inputKey, answer1.result.toString(), answer2.result.toString());
    console.log("    -> Done!");
  }
}

main();
