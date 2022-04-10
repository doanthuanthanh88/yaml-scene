import { Simulator } from "@app/Simulator"
import { readFileSync } from "fs"
import { join } from "path"

describe('Test to generate guideline document', () => {

  test('Export to guideline document markdown', async () => {
    const fout = `${join(__dirname, 'GuideMD.md')}`
    await Simulator.Run(`
- Doc/Guide/MD:
    includes: 
      - ${join(__dirname, '../../src')}
    excludes: []
    includePattern: .+\.ts$
    outFile: ${fout}
`)
    expect(readFileSync(fout).toString()).toContain('Doc/Guide/MD')
  })
})