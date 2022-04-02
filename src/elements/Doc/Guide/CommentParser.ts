import { ContentParser } from '../ContentParser';
import { CommentInfo } from './CommentInfo';

export class CommentParser extends ContentParser<CommentInfo> {
  private info?: CommentInfo;

  constructor(file: string, beginPattern = `^\\s*\\*\\s+@guide\\s*$`, endPattern = `\\s*\\*\\s+@end\\s*$`, noTagPattern: string) {
    super(file, beginPattern, endPattern, noTagPattern)
  }

  onEachLine(txt: string) {
    if (!this.info) {
      if (this.beginPattern.test(txt)) {
        this.info = new CommentInfo();
      }
    } else {
      if (this.endPattern.test(txt)) {
        this.infos.push(this.info);
        this.info = undefined;
      } else if (!this.noTagPattern) {
        this.info.add(txt);
      } else {
        const m = txt.match(this.noTagPattern)
        if (m) {
          this.info.add(m[1] || '');
        }
      }
    }
  }
}
