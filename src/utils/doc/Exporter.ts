import { DataModel } from './DataModel';

export interface Exporter<T extends DataModel> {
  export(models: T[]);
}
