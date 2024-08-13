import { IViewModel } from '#/cross-cutting/interfaces/IViewModel'

export const autoBusy = () => {
  return (_target: object, _propertyKey: string, descriptior: PropertyDescriptor) => {
    const orignalMethod = descriptior.value
    descriptior.value = async function (...args: unknown[]) {
      const _this = this as IViewModel
      _this.setIsBusy(true)
      try {
        return await orignalMethod.apply(this, args)
      } finally {
        _this.setIsBusy(false)
      }
    }
    return descriptior
  }
}
