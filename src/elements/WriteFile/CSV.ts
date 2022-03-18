import { FileType } from '@app/utils/data-source/file/FileType';
import { WriteFile } from '.';

export class CSV extends WriteFile {

  init(props: any) {
    props.type = FileType.CSV
    super.init(props)
  }

}