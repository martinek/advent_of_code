export const lPad = (str: string, count: number, char = " ") => {
  return new Array(Math.max(count - str.length, 0)).fill(char).join("") + str;
};
