import Echo from "."
import { ElementFactory } from "../ElementFactory"
import Vars from "../Vars"

describe('Echo', () => {
  test('Print a message text', async () => {
    const echo = ElementFactory.CreateTheElement(Echo)
    const text = await echo
      .init('Hello world')
      .exec()
    expect(text).toEqual('Hello world')
  })

  test('Print a global variable', async () => {
    const vars = ElementFactory.CreateTheElement(Vars)
    await vars
      .init({
        text: 'world'
      })
      .exec()

    const echo = ElementFactory.CreateTheElement(Echo)
    const text = await echo
      .init('Hello ${text}')
      .exec()
    expect(text).toEqual('Hello world')
  })
})
