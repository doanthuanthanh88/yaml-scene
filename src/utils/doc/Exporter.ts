import { DataModel } from './DataModel';

export interface Exporter {
  export(models: DataModel[]);
}
