import { PNG } from "pngjs";

type Color = readonly [number, number, number, number];
type CharacterMap = Record<string, Color>;

const DEFAULT_COLOR: Color = [10, 10, 10, 255];
const COLOR_LIBRARY: Color[] = [
  [40, 40, 40, 255],
  [255, 255, 255, 255],
  [255, 0, 0, 255],
  [0, 255, 0, 255],
  [0, 0, 255, 255],
  [255, 255, 0, 255],
  [255, 0, 255, 255],
  [0, 255, 255, 255],
];

interface DrawOptions {
  characterMap: CharacterMap;
  background?: Color;
}

class Illustrator {
  constructor() {}

  PPC: number = 10;
  _lastCharacterMap: CharacterMap | undefined;

  log(input: string, map?: CharacterMap) {
    const characterMap = map ?? this.buildCharacterMap(input);
    this.draw(input, { characterMap });
  }

  draw(input: string, options: DrawOptions) {
    const buffer = this.buildBuffer(input, options);
    this.drawBuffer(buffer);
  }

  buildCharacterMap(input: string): CharacterMap {
    const chars = new Set(input.split(""));
    if (this._lastCharacterMap && Array.from(chars).every((c) => c in this._lastCharacterMap!)) {
      return this._lastCharacterMap;
    }

    this._lastCharacterMap = Object.fromEntries(
      Array.from(chars).map((c, i) => [c, COLOR_LIBRARY[i % COLOR_LIBRARY.length]])
    );
    return this._lastCharacterMap;
  }

  private buildBuffer(input: string, options: DrawOptions): Buffer {
    const lines = input.trim().split("\n");
    const width = lines[0].length;
    const height = lines.length;

    const ppc = this.PPC;
    const png = new PNG({ width: width * (ppc + 1), height: height * (ppc + 1) });

    const drawPixel = (x: number, y: number, color: Color) => {
      // draw pixels scaled up by ppc
      for (let dy = 0; dy < ppc; dy++) {
        for (let dx = 0; dx < ppc; dx++) {
          const idx = ((y * (ppc + 1) + dy) * png.width + (x * (ppc + 1) + dx)) << 2;
          png.data[idx] = color[0];
          png.data[idx + 1] = color[1];
          png.data[idx + 2] = color[2];
          png.data[idx + 3] = color[3];
        }
      }
    };

    for (let y = 0; y < height; y++) {
      const line = lines[y];
      for (let x = 0; x < width; x++) {
        const color = options.characterMap[line[x]] ?? options.background ?? DEFAULT_COLOR;
        drawPixel(x, y, color);
      }
    }

    return PNG.sync.write(png);
  }

  private drawBuffer(buffer: Buffer<ArrayBufferLike>) {
    const outputStream = process.stdout;

    outputStream.write("\x1b]1337;");

    let s = "File=";
    const metadata = {
      inline: 1,
    };

    Object.entries(metadata).forEach(([key, value]) => {
      s += `${key}=${value};`;
    });

    s = s.slice(0, -1) + ":";

    outputStream.write(s);

    outputStream.write(buffer.toString("base64"));
    outputStream.write("\x07\n");
  }
}

export const ill = new Illustrator();

export default Illustrator;
