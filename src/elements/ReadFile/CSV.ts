import { FileType } from '@app/utils/data-source/file/FileType';
import ReadFile from '.';

export default class CSV extends ReadFile {

  init(props: any) {
    props.type = FileType.CSV
    super.init(props)
  }

}