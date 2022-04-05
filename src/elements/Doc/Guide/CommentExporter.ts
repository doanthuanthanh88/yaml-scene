import { IFileAdapter } from '@app/elements/File/adapter/IFileAdapter';
import { Exporter } from '@app/utils/doc/Exporter';
import { join } from 'path';
import { escape } from 'querystring';
import { CommentInfo } from './CommentInfo';

export class CommentExporter implements Exporter<CommentInfo> {
  constructor(private writer: IFileAdapter) {
  }

  async export(models: CommentInfo[]) {
    const mdMenu = ['# Document', `*Describe all of elements in tool. (meaning, how to use...)*`, `| Element | Description |  `, `|---|---|  `];
    const mdExample = ['# Details'];

    const groups = models.reduce((sum, model) => {
      const _groups = model.group?.split(',').map(e => e.trim())
      if (_groups) {
        _groups.forEach(g => {
          if (!sum.get(g)) sum.set(g, []);
          sum.get(g).push(model);
        })
      } else {
        let g = null
        if (!sum.get(g)) sum.set(g, []);
        sum.get(g).push(model);
      }
      return sum;
    }, new Map<string | null, CommentInfo[]>())

    const mdH1 = [] as string[]
    const mdH2 = [] as string[]

    const unique = {
      info: new Set<CommentInfo>(),
      h1: new Set<CommentInfo>(),
      h2: new Set<CommentInfo>(),
    }

    Array.from(groups.keys()).sort().forEach(group => {
      const sortedGroups = groups.get(group)?.sort((a, b) => {
        if (a.order === b.order) {
          return a.name > b.name ? 1 : -1
        }
        if (a.order === undefined) a.order = Number.MAX_SAFE_INTEGER
        if (b.order === undefined) b.order = Number.MAX_SAFE_INTEGER
        return +a.order > +b.order ? 1 : -1
      })
      if (sortedGroups) {
        const h1 = sortedGroups.filter(h => h.h1 !== undefined && !unique.h1.has(h))
        mdH1.push(...h1.map(h1 => unique.h1.add(h1) && `${h1.h1 || '#'} ${h1.name}
${h1.description}  
${h1.examples}
`))

        const h2 = sortedGroups.filter(h => h.h2 !== undefined && !unique.h2.has(h))
        mdH2.push(...h2.map(h2 => unique.h2.add(h2) && `${h2.h2 || '#'} ${h2.name}
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
          mdMenu.push(...infos.map(info => `|[${info.name}](#${escape(join(info.group || '', info.name))})| ${info.description1}|  `));
          mdExample.push(...infos
            .filter(h => !unique.info.has(h))
            .map(info => {
              unique.info.add(info)
              const mes = [`## ${info.name} <a name="${escape(join(info.group || '', info.name))}"></a>  `]
              if (info.group) mes.push(`\`(${info.group})\`  `)
              mes.push(`${info.description || ''}  `)
              mes.push(`${info.examples}`)
              mes.push(`<br/>\n`)
              return mes.join('\n')
            }
            ));
        }
      }
    })

    await this.writer.write([...mdMenu, '  ', ...mdH1, '  ', ...mdExample, '  ', ...mdH2].join('\n'));
  }
}
