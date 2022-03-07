import { VarManager } from "@app/singleton/VarManager"
import { Simulator } from "@app/Simulator"

describe('Test Api', () => {
  test('- Get API', async () => {
    await Simulator.Run(`
- Api:
    title: test api
    baseURL: https://fastlane.rubiconproject.com
    url: /a/:api/:name
    params:
      api: api
      name: fastlane.json
    query:
      account_id: 21150
      site_id: 351284
      zone_id: 1868548
      size_id: 15
      us_privacy: "1---"
      rp_schain: "1.0,1!ezoic.ai,65669379189918b982c5bc3b071a4ba0,1,,,"
      rf: "https%3A%2F%2Fwww.learningcontainer.com%2Fwhat-is-a-json-file%2F%23How_to_open_a_JSON_file"
      tk_flint: "pbjs_lite_v6.0.0"
      x_source: "tid=2f61374f-0404-485c-84c9-71529e14000a"
      p_screen_res: "1920x1080"
      rp_secure: 1
      rp_maxbids: 1
      slots: 1
      rand: 0.036512879719667324
    headers:
      content-type: application/json
    validate:
      - title: "Test status"
        chai: "\${expect(_.response.status).to.equal(200)}"
      - title: "Test response"
        chai: "\${expect(_.response.data).to.have.property('reason')}"
    var:
      status: '\${_.response.status}'
    `)
    expect(VarManager.Instance.vars.status).toBe(200)
  })
})