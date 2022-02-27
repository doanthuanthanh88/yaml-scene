import { DataParser } from "./DataParser";

export interface Scanner {
  scanDir(dir: string): Promise<DataParser[]> | DataParser[];
}
