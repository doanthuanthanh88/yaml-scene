import { Simulator } from "@app/Simulator"

test('Validate with chaijs', async () => {
  let error = null
  try {
    await Simulator.Run(`
- Vars:
    id: 10
- Validate:
    title: Check number
    chai: \${expect(id).to.equal(10)}
`)
  } catch (err: any) {
    error = err
  }

  expect(error).toBeNull()
})

test('Validate with custom function', async () => {
  let error = null
  try {
    await Simulator.Run(`
- Vars:
    id: 10
- Validate:
    title: Check custom function
    chai: !function |
      ({ assert }) {
        assert.fail('Error here')
      }
`)
  } catch (err: any) {
    error = err
  }

  expect(error.message).toEqual('Error here')
})