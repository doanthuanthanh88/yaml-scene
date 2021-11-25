import { FileType } from '@app/utils/data-source/file/FileType';
import { ReadFile } from '.';

export class yaml extends ReadFile {

  init(props: any) {
    props.type = FileType.YAML
    super.init(props)
  }

}