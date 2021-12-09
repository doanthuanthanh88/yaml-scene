import { Scenario } from '@app/singleton/Scenario'
import { readFileSync } from 'fs'
import { safeLoad, Type } from 'js-yaml'
import { SCHEMA } from '.'

export const fragment = new Type('!fragment', {
  kind: 'scalar',
  construct: (filePath) => {
    return safeLoad(readFileSync(Scenario.Current.resolvePath(filePath)).toString(), { schema: SCHEMA })
  }
})
