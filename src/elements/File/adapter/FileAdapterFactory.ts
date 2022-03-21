import { Extensions } from "@app/utils/extensions";

export class FileAdapterFactory {
  static GetAdapter(adapterName: string, extensions: Extensions) {
    return extensions.load(adapterName, __dirname)
  }
}