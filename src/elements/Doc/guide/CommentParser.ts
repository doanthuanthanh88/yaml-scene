import { ContentParser } from '../ContentParser';
import { CommentInfo } from './CommentInfo';

export class CommentParser extends ContentParser<CommentInfo> {
  private info: CommentInfo;

  onEachLine(txt: string) {
    if (!this.info) {
      if (/^\s*\/\*\*\s*$/.test(txt)) {
        this.info = new CommentInfo();
      }
    } else {
      if (/^\s*\*\/\s*$/.test(txt)) {
        this.infos.push(this.info);
        this.info = null;
      } else {
        txt = txt.replace(/^\s*\*\s*/g, '');
        this.info.add(txt);
      }
    }
  }
}
