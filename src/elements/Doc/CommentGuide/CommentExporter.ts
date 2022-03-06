import { DataSource } from '@app/utils/data-source/DataSource';
import { Exporter } from '@app/utils/doc/Exporter';
import { CommentInfo } from './CommentInfo';

export class CommentExporter implements Exporter {
  constructor(private datasource: DataSource) {
  }

  export(models: CommentInfo[]) {
    const mdMenu = ['# Document', `*Describe all of elements in tool. (meaning, how to use...)*`, `| Element | Description |  `, `|---|---|  `];
    const mdExample = ['# Details'];
    const mdH1 = []
    const groups = models.reduce((sum, model) => {
      if (!sum.get(model.group))
        sum.set(model.group, []);
      sum.get(model.group).push(model);
      return sum;
    }, new Map<string, CommentInfo[]>())
    Array.from(groups.keys()).sort().forEach(group => {
      const h1 = groups.get(group).filter(h => h.h1)
      h1.sort((a, b) => {
        if (!a.order || !b.order || a.order !== b.order)
          return a.order - b.order
        return a.name > b.name ? 1 : 0
      });
      mdH1.push(...h1.map(h1 => `# ${h1.name}
*${h1.description}*  
\`\`\`yaml  
${h1.example || ''}
\`\`\``))

      const infos = groups.get(group).filter(h => !h.h1)
      infos.sort((a, b) => {
        if (!a.order || !b.order || a.order !== b.order)
          return a.order - b.order
        return a.name > b.name ? 1 : 0
      });
      if (group) {
        mdMenu.push(`| ${group.toUpperCase()} | --- |`);
      } else {
        mdMenu.push(`| --- | --- |`);
      }
      mdMenu.push(...infos.map(info => `|[${info.name}](#${info.name})| ${info.description || ''}|  `));
      mdExample.push(...infos.map(info => `## ${info.name} <a name="${info.name}"></a>
${info.description || ''}  
\`\`\`yaml
${info.example || ''}
\`\`\``
      ));
    })

    this.datasource.write([...mdMenu, '  ', ...mdH1, '  ', ...mdExample].join('\n'));
  }
}
