import { DataSource } from '@app/utils/data-source/DataSource';
import { Exporter } from '@app/utils/doc/Exporter';
import { CommentInfo } from './CommentInfo';

export class CommentExporter implements Exporter<CommentInfo> {
  constructor(private datasource: DataSource) {
  }

  export(models: CommentInfo[]) {
    const mdMenu = ['# Document', `*Describe all of elements in tool. (meaning, how to use...)*`, `| Element | Description |  `, `|---|---|  `];
    const mdExample = ['# Details'];

    const groups = models.reduce((sum, model) => {
      if (!sum.get(model.group))
        sum.set(model.group, []);
      sum.get(model.group).push(model);
      return sum;
    }, new Map<string, CommentInfo[]>())

    const mdH1 = []
    const mdH2 = []

    Array.from(groups.keys()).sort().forEach(group => {
      const sortedGroups = groups.get(group).sort((a, b) => {
        if (a.order === b.order === undefined) {
          return a.name > b.name ? 1 : -1
        }
        if (a.order === undefined) a.order = Number.MAX_SAFE_INTEGER
        if (b.order === undefined) b.order = Number.MAX_SAFE_INTEGER
        return +a.order - +b.order
      })
      const h1 = sortedGroups.filter(h => h.h1 !== undefined)
      mdH1.push(...h1.map(h1 => `${h1.h1 || '#'} ${h1.name}
${h1.description}  
${h1.examples}
`))

      const h2 = sortedGroups.filter(h => h.h2 !== undefined)
      mdH2.push(...h2.map(h2 => `${h2.h2 || '#'} ${h2.name}
${h2.description}  
${h2.examples}
`))

      const infos = sortedGroups.filter(h => h.h1 === h.h2 && h.h1 === undefined)
      if (infos.length) {
        if (group) {
          mdMenu.push(`| ${group.toUpperCase()} | --- |`);
        } else {
          mdMenu.push(`| --- | --- |`);
        }
        mdMenu.push(...infos.map(info => `|[${info.name}](#${info.name})| ${info.description || ''}|  `));
        mdExample.push(...infos.map(info => `## ${info.name} <a name="${info.name}"></a>
${info.description || ''}  
${info.examples}
`
        ));
      }
    })

    this.datasource.write([...mdMenu, '  ', ...mdH1, '  ', ...mdExample, '  ', ...mdH2].join('\n'));
  }
}
