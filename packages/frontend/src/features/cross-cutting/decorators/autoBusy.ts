import { IBusyable } from '#/cross-cutting/interfaces/view-models/IBusyable'

type TypedAsyncFunction<Target> = Target extends (...args: infer Args) => PromiseLike<infer Return>
  ? ((...args: Args) => Promise<Return>)
  : never

export const autoBusyAsync = <
  TargetClass extends IBusyable,
  PropertyKey extends Readonly<keyof TargetClass>,
  PropertyType extends TargetClass[PropertyKey],
  FunctionType extends TypedAsyncFunction<PropertyType>,
>() => (
    _object: TargetClass,
    _propertyKey: PropertyKey,
    descriptior: TypedPropertyDescriptor<(...args: Parameters<FunctionType>
  ) => Promise<Awaited<ReturnType<FunctionType>>>>) => {
    if (typeof descriptior.value !== 'function') {
      throw new Error('autoBusyAsync decorator can only be applied to methods')
    }

    const orignalMethod = descriptior.value

    const injectFunction = async function (this: TargetClass, ...args: Parameters<FunctionType>): Promise<Awaited<ReturnType<FunctionType>>> {
      try {
        this.setIsBusy(true)

        return await orignalMethod.apply(this, args)
      } finally {
        this.setIsBusy(false)
      }
    }

    descriptior.value = injectFunction

    return descriptior
  }

type TypedFunction<Target> = Target extends TypedAsyncFunction<Target>
  ? never
  : Target extends (...args: infer Args) => infer Return
    ? (...args: Args) => Return
    : never

export const autoBusy = <
  TargetClass extends IBusyable,
  PropertyKey extends Readonly<keyof TargetClass>,
  PropertyType extends TargetClass[PropertyKey],
  FunctionType extends TypedFunction<PropertyType>,
>() => (
    _object: TargetClass,
    _propertyKey: PropertyKey,
    descriptior: TypedPropertyDescriptor<(...args: Parameters<FunctionType>) => ReturnType<FunctionType>>
  ) => {
    if (typeof descriptior.value !== 'function') {
      throw new Error('autoBusy decorator can only be applied to methods')
    }

    const orignalMethod = descriptior.value

    const injectFunction = function (this: TargetClass, ...args: Parameters<FunctionType>): ReturnType<FunctionType> {
      try {
        this.setIsBusy(true)

        return orignalMethod.apply(this, args)
      } finally {
        this.setIsBusy(false)
      }
    }

    descriptior.value = injectFunction

    return descriptior
  }
