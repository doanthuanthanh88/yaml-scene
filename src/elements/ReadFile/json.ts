import { FileType } from '@app/utils/data-source/file/FileType';
import { ReadFile } from '.';

export class json extends ReadFile {

  init(props: any) {
    props.type = FileType.JSON
    super.init(props)
  }

}