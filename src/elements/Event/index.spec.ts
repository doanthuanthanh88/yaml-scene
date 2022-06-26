import { TimeUtils } from "@app/utils/TimeUtils"
import Event from "."
import { ElementFactory } from "../ElementFactory"

describe('Event', () => {
  it('Publish data to an event (text eval)', async () => {
    const event = ElementFactory.CreateTheElement(Event)

    event.events.on('test', ({ $event }) => {
      event.extra.eventData = $event.data
    })

    event.init({
      title: 'test emit data',
      name: 'test',
      emit: `({ }) {
        this.emit({say: 'hello world'})
      }`
    })
    await event.prepare()
    await event.exec()

    await TimeUtils.Delay(500)

    expect(event.extra.eventData.say).toBe('hello world')
  })

  it('Publish data to an event (function)', async () => {
    const event = ElementFactory.CreateTheElement(Event)

    event.events.on('test', ({ $event }) => {
      event.extra.eventData = $event.data
    })

    event.init({
      title: 'test emit data',
      name: 'test',
      emit() {
        this.emit({ say: 'hello world' })
      }
    })
    await event.prepare()
    await event.exec()

    await TimeUtils.Delay(500)

    expect(event.extra.eventData.say).toBe('hello world')
  })

  it('Subscribe an event (text-eval)', async () => {
    const event = ElementFactory.CreateTheElement<Event>(Event)

    event.init({
      title: 'test subscribe event',
      name: 'test',
      on: `({ $event }) {
        this.proxy.extra.eventData = $event.data
      }`
    })
    await event.prepare()
    await event.exec()

    event.element.emit({ say: 'hello world' })

    await TimeUtils.Delay(500)

    expect(event.extra.eventData?.say).toBe('hello world')
  })

  it('Subscribe an event (function)', async () => {
    const event = ElementFactory.CreateTheElement<Event>(Event)

    event.init({
      title: 'test subscribe event',
      name: 'test',
      on({ $event }) {
        this.proxy.extra.eventData = $event.data
      }
    })
    await event.prepare()
    await event.exec()

    event.element.emit({ say: 'hello world' })

    await TimeUtils.Delay(500)

    expect(event.extra.eventData?.say).toBe('hello world')
  })

  it('Test subscribe event with "waitOnEvent"', async () => {
    const event = ElementFactory.CreateTheElement<Event>(Event)

    const tm = setInterval(() => {
      event.element.emit({ say: 'hello world' })
      if (event.extra.count === 2) clearInterval(tm)
    }, 500)

    const begin = Date.now()

    event.init({
      title: 'Subscribe then block steps',
      waitOnEvent: true,
      name: 'test',
      on() {
        if (!this.proxy.extra.count) this.proxy.extra.count = 0
        this.proxy.extra.count++
        return this.proxy.extra.count === 2
      }
    })
    await event.prepare()
    await event.exec()
    expect(event.extra.count).toBe(2)
    expect(Date.now() - begin).toBeGreaterThanOrEqual(1000)
  })

})