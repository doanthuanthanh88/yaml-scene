
export class TraceError extends Error {

  constructor(msg: string, public info?: any) {
    super(msg)
    this.name = 'TraceError'
  }

}
