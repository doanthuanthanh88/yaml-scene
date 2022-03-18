import { Simulator } from "@app/Simulator"
import { readFileSync } from "fs"
import { join } from "path"

/**
 * Doc/Guide/MD
 * @group Doc
 * @description Auto scan file to detect the comment format which is generated to markdown document
 * @example
- Doc/Guide/MD: 
    includes: 
      - src
    excludes: []
    includePattern: ".+\\.ts$"
    outFile: /tmp/doc.md
 */
describe('Test to generate guideline document', () => {

  test('Export to guideline document markdown', async () => {
    const fout = `${join(__dirname, 'GuideMD.md')}`
    await Simulator.Run(`
- Doc/Guide/MD:
    includes: 
      - ${join(__dirname)}
    excludes: []
    includePattern: .+\.ts$
    outFile: ${fout}
`)
    expect(readFileSync(fout).toString()).toContain('Doc/Guide/MD')
  })
})