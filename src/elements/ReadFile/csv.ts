import { FileType } from '@app/utils/data-source/file/FileType';
import { ReadFile } from '.';

export class csv extends ReadFile {

  init(props: any) {
    props.type = FileType.CSV
    super.init(props)
  }

}