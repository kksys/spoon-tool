import { useCallback, useEffect, useState } from 'react'

export type DeviceValue = 'pc' | 'mobile'

export function useDeviceLayout(): DeviceValue {
  const estimateOrientation = useCallback((): DeviceValue => {
    return window.innerWidth > 425 ? 'pc' : 'mobile'
  }, [])

  const [deviceLayout, setDeviceLayout] = useState<DeviceValue>(estimateOrientation)

  useEffect(() => {
    const handleResize = (_event: UIEvent) => {
      setDeviceLayout(estimateOrientation())
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })

  return deviceLayout
}

export function useDeviceLayoutWithCustomValue<TargetValue extends string>(filterFunc: (value: DeviceValue) => TargetValue): TargetValue {
  return filterFunc(useDeviceLayout())
}
