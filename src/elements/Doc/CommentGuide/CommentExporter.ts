import { DataSource } from '@app/utils/data-source/DataSource';
import { Exporter } from '@app/utils/doc/Exporter';
import { CommentInfo } from './CommentInfo';

export class CommentExporter implements Exporter {
  constructor(private datasource: DataSource) {
  }

  export(models: CommentInfo[]) {
    const mdMenu = ['# Document'];
    const mdExample = [];
    models.reduce((sum, model) => {
      if (!sum.get(model.group))
        sum.set(model.group, []);
      sum.get(model.group).push(model);
      return sum;
    }, new Map<string, CommentInfo[]>())
      .forEach((infos: CommentInfo[], group: string) => {
        infos.sort((a, b) => a.order - b.order);
        if (group) {
          mdMenu.push(`## ${group}`);
        } else {
          mdMenu.push(`## &nbsp;`);
        }
        mdMenu.push(...infos.map(info => `* ${info.name}: *${info.description || ''}*`));
        mdExample.push(...infos.map(info => `## ${info.name}
*${info.description || ''}*
\`\`\`yaml
${info.example || ''}
\`\`\``
        ));
      });

    this.datasource.write(mdMenu.concat('', '___', '', mdExample).join('\n'));
  }
}
