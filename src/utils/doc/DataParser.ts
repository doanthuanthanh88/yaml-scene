import { DataModel } from './DataModel';

export interface DataParser {
  parse(): Promise<DataModel[]>;
}
