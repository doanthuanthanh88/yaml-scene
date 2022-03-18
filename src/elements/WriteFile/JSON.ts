import { FileType } from '@app/utils/data-source/file/FileType';
import { WriteFile } from '.';

export class JSON extends WriteFile {

  init(props: any) {
    props.type = FileType.JSON
    super.init(props)
  }

}