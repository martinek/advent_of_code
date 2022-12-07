import Task, { TaskPartSolution } from "../utils/task.js";

const sampleInput = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;

class File {
  name: string;
  size: number;
  constructor(name: string, size: number) {
    this.name = name;
    this.size = size;
  }
}

class Directory {
  path: string;
  files: File[];
  directories: Directory[];
  private _size: number | undefined = undefined;

  constructor(path: string) {
    this.path = path;
    this.files = [];
    this.directories = [];
  }

  print(depth: number = 0) {
    const prefix = "|-".repeat(depth);
    console.log(prefix + (prefix.length > 0 ? " " : "") + this.path + ` (${this.size()})`);
    this.directories.map((d) => d.print(depth + 1));
    this.files.map((f) => {
      console.log(prefix + "|- " + f.name + ` (${f.size})`);
    });
  }

  size(): number {
    if (this._size === undefined) {
      this._size =
        this.files.reduce((acc, f) => acc + f.size, 0) + this.directories.reduce((acc, dir) => acc + dir.size(), 0);
    }
    return this._size;
  }
}

const buildTree = (cmds: string[]) => {
  const directories: { [path: string]: Directory } = {};

  let pwd = "";
  let currentDir: Directory = new Directory("");

  let activecmd: string | undefined = undefined;

  for (const line of cmds) {
    const pts = line.split(" ");
    if (pts[0] === "$") {
      switch (pts[1]) {
        case "cd":
          activecmd = undefined;
          switch (pts[2]) {
            case "/":
              pwd = "/";
              break;
            case "..":
              pwd = pwd.split("/").slice(0, -2).join("/") + "/";
              break;
            default:
              pwd = pwd + `${pts[2]}/`;
              break;
          }
          if (directories[pwd] == null) {
            directories[pwd] = new Directory(pwd);
          }
          currentDir = directories[pwd];
          break;
        case "ls":
          activecmd = "ls";
          break;
      }
    } else {
      switch (activecmd) {
        case "ls":
          // this is entry of ls
          if (pts[0] === "dir") {
            // dir entry
            const dirpwd = pwd + pts[1] + "/";
            directories[dirpwd] ||= new Directory(dirpwd);
            currentDir.directories.push(directories[dirpwd]);
          } else {
            // file entry
            const file = new File(pts[1], Number(pts[0]));
            currentDir.files.push(file);
          }
          break;

        default:
          break;
      }
    }
  }

  return directories["/"];
};

const find = (dir: Directory, filter: (item: File | Directory) => boolean): (File | Directory)[] => {
  const found = [...dir.directories.filter(filter), ...dir.files.filter(filter)];

  dir.directories.forEach((d) => {
    found.push(...find(d, filter));
  });

  return found;
};

const part1: TaskPartSolution = (input) => {
  const cmds = input.split("\n");
  const tree = buildTree(cmds);

  const smallerThen100k = find(tree, (f) => {
    return f instanceof Directory && f.size() < 100000;
  }) as Directory[];

  const sum = smallerThen100k.reduce((acc, d) => acc + d.size(), 0);

  return sum.toString();
};

const part2: TaskPartSolution = (input) => {
  const totalSize = 70000000;
  const updateSize = 30000000;

  const cmds = input.split("\n");
  const tree = buildTree(cmds);

  const freeSpace = totalSize - tree.size();
  const minToDelete = updateSize - freeSpace;

  const largerThenRequired = find(tree, (f) => {
    return f instanceof Directory && f.size() >= minToDelete;
  }) as Directory[];

  const smallestLarger = largerThenRequired.sort((a, b) => a.size() - b.size())[0];

  return smallestLarger.size().toString();
};

const task = new Task(2022, 7, part1, part2);

export default task;
