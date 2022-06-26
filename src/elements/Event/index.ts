import { Functional } from "@app/tags/model/Functional";
import { TraceError } from "@app/utils/error/TraceError";
import merge from 'lodash.merge';
import { ElementProxy } from "../ElementProxy";
import { IElement } from "../IElement";

/*****
@name Event
@description Pub/sub data to internal events
@group Event
@example
- Vars:
    name: 10
    age: 10

- Event: 
    title: Publish a message
    name: test-publish
    emit: !function |
      ({ name, age }) {  
        this.emit({hello: 'world', localName: name, localAge: age})                             # `this` is referenced to `Event` element
      }

- Event: 
    title: Subscribe an event
    name: test-publish
    on: !function |
      ({ $event, name, age }) {                                            # Passed global variables into function                                    
        console.log('received', $event.data.hello)
        console.log($event.data.localName === name)
        console.log($event.data.localAge === age)
      }

- Event: 
    title: Subscribe an event
    name: test-publish
    waitOnEvent: true                                                      # This step will stop until "on" function return true
    on: !function |
      ({ $event, name, age }) {                                            # Passed global variables into function                                    
        console.log('received', $event.data.hello)
        console.log($event.data.localName === name)
        console.log($event.data.localAge === age)
        return true                                                        # Return true will keep playing the next. It's only affected when set "waitOnEvent" = true
      }
*/

export type EventSubscribe = (eventData: EventData, ...globalVariables: any[]) => any

export type EventPublish = () => any

export class EventData {
  $event: {
    name: string
    time: number
    data: any
  }

  constructor(name: string, data: any) {
    this.$event = {
      name,
      data,
      time: Date.now(),
    }
  }
}

export default class Event implements IElement {
  proxy: ElementProxy<this>
  $$: IElement
  $: this

  /**
   * Event name
   */
  name: string
  emitProps?: string | Functional | object | EventPublish
  onProps?: string | Functional | EventSubscribe
  waitOnEvent?: boolean

  title?: string

  init(props: any) {
    const { emit, on, ...others } = props
    merge(this, others)
    if (emit) {
      const _emits = Functional.GetFunction(emit)
      this.emitProps = _emits || emit
    }
    if (on) {
      const _on = Functional.GetFunction(on)
      this.onProps = _on || on
    }
    if (!this.name) throw new TraceError('Event."name" is required!', { props })
    if (!this.emitProps && !this.onProps) throw new TraceError('Event."emit" or "on" is required!', { props })
  }

  emit(data: any) {
    this.proxy.events.emit(this.name, new EventData(this.name, data))
  }

  on(cb: (eventData: EventData) => any) {
    this.proxy.events.on(this.name, (data) => cb(data))
  }

  async prepare() {
    await this.proxy.applyVars(this, 'title', 'name', 'emitProps', 'waitOnEvent')
  }

  exec() {
    return new Promise(async (resolve, reject) => {
      if (this.title) this.proxy.logger.info(this.title)
      this.title && console.group()
      try {
        if (this.emitProps) {
          if (this.emitProps instanceof Functional) {
            const emitFunc = this.emitProps.getFunctionFromBody()
            await this.proxy.call(emitFunc, {}, this)
          } else if (typeof this.emitProps === 'function') {
            const emitFunc = this.emitProps
            await this.proxy.call(emitFunc, {}, this)
          } else if (typeof this.emitProps === 'object') {
            this.emit(this.emitProps)
          } else {
            throw new TraceError('Event.emit is not valid')
          }
        }
        if (this.onProps) {
          if (this.onProps instanceof Functional) {
            const onFunc = this.onProps.getFunctionFromBody()
            this.proxy.events.on(this.name, async (eventData) => {
              const rs = await this.proxy.call(onFunc, eventData, this)
              if (this.waitOnEvent && !!rs) {
                return resolve(rs)
              }
            })
          } else if (typeof this.onProps === 'function') {
            const onFunc = this.onProps
            this.proxy.events.on(this.name, async (eventData) => {
              const rs = await this.proxy.call(onFunc, eventData, this)
              if (this.waitOnEvent && !!rs) {
                return resolve(rs)
              }
            })
          } else {
            throw new TraceError('Event.on is not valid')
          }
        }
        if (!this.waitOnEvent) return resolve(undefined)
      } catch (err) {
        return reject(err)
      } finally {
        this.title && console.groupEnd()
      }
    })
  }

}