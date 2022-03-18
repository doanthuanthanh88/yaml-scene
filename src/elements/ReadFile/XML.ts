import { FileType } from '@app/utils/data-source/file/FileType';
import ReadFile from '.';

export default class XML extends ReadFile {

  init(props: any) {
    props.type = FileType.XML
    super.init(props)
  }

}