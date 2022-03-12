import { Api } from '@app/elements/Api';
import { Scenario } from '@app/singleton/Scenario';
import { DataSource } from '@app/utils/data-source/DataSource';
import { Exporter as IExporter } from '@app/utils/doc/Exporter';
import { omit } from 'lodash';
import { escape } from 'querystring';
import { ApiMD } from '.';

export class Exporter implements IExporter<Api> {
  readonly ignoreRequestHeaders = ['content-type']
  readonly ignoreResponseHeaders = [
    'x-powered-by',
    'vary',
    'access-control-allow-credentials',
    'cache-control',
    'pragma',
    'expires',
    'access-control-expose-headers',
    'location',
    'x-content-type-options',
    'content-type',
    'content-length',
    'etag',
    'date',
    'connection',
  ]

  constructor(private datasource: DataSource, public md: ApiMD) {
  }

  objectToMDType(obj) {
    const md = []
    md.push(`| Name | Type |`)
    md.push(`| --- | --- |`)
    this.objectToTypes({ '@ROOT': obj }).forEach(info => {
      md.push(...this.toMDString(info))
    })
    return md.length > 2 ? md.join('\n') : ''
  }

  private toMDString(info: any) {
    const md = []
    md.push(`| ${info.space} \`${info.name}\` | ${Array.from(info.types).join(', ')} |`)
    if (info.childs.length) {
      info.childs.forEach(child => {
        md.push(...this.toMDString(child))
      })
    }
    return md
  }

  private objectToTypes(obj: any, space = '') {
    if (Array.isArray(obj)) {
      const arr = []
      obj.forEach(o => {
        arr.push(...this.objectToTypes(o, space))
      })
      return arr.reduce((sum, child) => {
        const existed = sum.find(c => c.name === child.name)
        if (existed) {
          existed.types.add(...child.types)
        } else {
          sum.push(child)
        }
        return sum
      }, [])
    } else if (typeof obj === 'object') {
      return Object.keys(obj).map(key => {
        const info = {
          space,
          name: key,
          types: new Set(),
          childs: []
        }
        if (Array.isArray(obj[key])) {
          info.types.add(`array&lt;${Array.from(new Set(obj[key].map(e => typeof e))).join(',')}&gt;`)
        } else {
          info.types.add(typeof obj[key])
        }
        info.childs = this.objectToTypes(obj[key], space + '&nbsp;&nbsp;&nbsp;&nbsp;')
        return info
      })
    }
    return []
  }

  export(apis: Api[]) {
    const mdMenu = [`# ${this.md.title || Scenario.Current.title}`, `${this.md.description || Scenario.Current.description || ''}`];
    const mdDetails = [];

    if (this.md.signature) {
      mdMenu.push(`> Developed by ${this.md.signature}  `)
    }
    mdMenu.push(`> Updated at ${new Date().toLocaleString()}  `)

    mdMenu.push('', `| | API title | URL |  `, `|---|---|---|  `)
    apis.sort((a, b) => a.title > b.title ? 1 : -1)

    apis.forEach((api, i) => {
      mdMenu.push(`|**${i + 1}**|[${api.title}](#${escape(api.title)})| \`${api.method}\` ${api.url}|  `)
      const details = []
      details.push('', '---', '', `## [${api.title}](#) <a name="${escape(api.title)}"></a>
${api.description || ''}`, '')

      details.push(`
- \`${api.method} ${api.url}\`
- ✅  &nbsp; **${api.response.status}**  *${api.response.statusText || ''}*
`, '')
      details.push(`
<details open>
<summary><b>cURL</b></summary>

\`\`\`sh
${api.curl}
\`\`\`

</details>
`, '')
      details.push('## REQUEST')

      if (api.params && Object.keys(api.params).length) {
        details.push(`### Params
<details>
  <summary>Example</summary>

\`\`\`json
${JSON.stringify(api.params, null, '  ')}
\`\`\`

</details>

<details open>
  <summary>Schema</summary>

${this.objectToMDType(api.params)}

</details>
`)
      }

      if (api.query && Object.keys(api.query).length) {
        details.push(`### Querystring
<details>
  <summary>Example</summary>

\`\`\`json
${JSON.stringify(api.query, null, '  ')}
\`\`\`

</details>

<details open>
  <summary>Schema</summary>

${this.objectToMDType(api.query)}

</details>
`)
      }

      if (api.headers) {
        const headers = omit(api.headers, this.ignoreRequestHeaders)
        if (Object.keys(headers).length) {
          details.push(`### Request headers
<details>
  <summary>Example</summary>

\`\`\`json
${JSON.stringify(headers, null, '  ')}
\`\`\`

</details>

<details open>
  <summary>Schema</summary>

${this.objectToMDType(headers)}

</details>
`)
        }
      }

      if (api.body) {
        details.push(`### Request body
\`Content-Type: *${api.contentType}*\`  

<details>
  <summary>Example</summary>

\`\`\`json
${JSON.stringify(api.body, null, '  ')}
\`\`\`

</details>

<details open>
  <summary>Schema</summary>

${this.objectToMDType(api.body)}

</details>
`)
      }

      details.push(`## RESPONSE`)

      if (api.response.headers) {
        const headers = omit(api.headers, this.ignoreRequestHeaders)
        if (Object.keys(headers).length) {
          details.push(`### Response headers
<details>
  <summary>Example</summary>

\`\`\`json
${JSON.stringify(headers, null, '  ')}
\`\`\`

</details>

<details open>
  <summary>Schema</summary>

${this.objectToMDType(headers)}

</details>
`)
        }
      }

      if (api.response.data !== undefined) {
        details.push(`### Response data
\`Content-Type: *${api.responseContentType}*\`  

<details>
  <summary>Example</summary>

\`\`\`json
${JSON.stringify(api.response.data, null, '  ')}
\`\`\`

</details>

<details open>
  <summary>Schema</summary>

${this.objectToMDType(api.response.data)}

</details>
`)
      }

      mdDetails.push(details.join('\n'))

    })

    this.datasource.write([...mdMenu, '  ', ...mdDetails, '  '].join('\n'));
  }
}
