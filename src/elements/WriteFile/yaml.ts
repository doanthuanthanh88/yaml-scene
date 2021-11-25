import { FileType } from '@app/utils/data-source/file/FileType';
import { WriteFile } from '.';

export class yaml extends WriteFile {

  init(props: any) {
    props.type = FileType.YAML
    super.init(props)
  }

}