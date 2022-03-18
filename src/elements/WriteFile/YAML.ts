import { FileType } from '@app/utils/data-source/file/FileType';
import WriteFile from '.';

export default class YAML extends WriteFile {

  init(props: any) {
    props.type = FileType.YAML
    super.init(props)
  }

}