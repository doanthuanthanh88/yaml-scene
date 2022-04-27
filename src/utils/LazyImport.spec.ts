import { LazyImport } from "./LazyImport"

it('LazyImport', async () => {
  try {
    // @ts-ignore
    await LazyImport(import('yas-http'))
  } catch (err) {
    expect(err.code).toEqual('MODULE_NOT_FOUND')
  }
})