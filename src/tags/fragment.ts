import { TestCase } from '@app/TestCase'
import { readFileSync } from 'fs'
import { safeLoad, Type } from 'js-yaml'
import { SCHEMA } from '.'

export const fragment = new Type('!fragment', {
  kind: 'scalar',
  construct: (filePath) => {
    return safeLoad(readFileSync(TestCase.GetPathFromRoot(filePath)).toString(), { schema: SCHEMA })
  }
})
