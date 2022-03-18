import { ContentParser } from '../ContentParser';
import { CommentInfo } from './CommentInfo';

export class CommentParser extends ContentParser<CommentInfo> {
  private info: CommentInfo;

  constructor(file: string, beginPattern = `\\s+@guide\\s*$`, endPattern = `\\s+@end\\s*$`) {
    super(file, beginPattern, endPattern)
  }

  onEachLine(txt: string) {
    if (!this.info) {
      if (this.beginPattern.test(txt)) {
        this.info = new CommentInfo();
      }
    } else {
      if (this.endPattern.test(txt)) {
        this.infos.push(this.info);
        this.info = null;
      } else {
        // txt = txt.replace(/^[^@]+/g, '');
        this.info.add(txt);
      }
    }
  }
}
