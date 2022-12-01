import fs from "fs";

export const getInput = (basePath: string) => fs.readFileSync(basePath + "/input.txt").toString();
