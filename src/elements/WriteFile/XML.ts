import { FileType } from '@app/utils/data-source/file/FileType';
import WriteFile from '.';

export default class XML extends WriteFile {

  init(props: any) {
    props.type = FileType.XML
    super.init(props)
  }

}