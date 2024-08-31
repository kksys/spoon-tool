import { Field, FieldProps } from '@fluentui/react-components'
import { FC, memo } from 'react'

import { useDeviceLayoutWithCustomValue } from '#/cross-cutting/hooks/useDeviceLayout'

type IStFieldProps = Omit<FieldProps, 'orientation'>

export const StField: FC<IStFieldProps> = memo(({ children, ...props }) => {
  const orientation = useDeviceLayoutWithCustomValue(device => device === 'pc' ? 'horizontal' : 'vertical')

  return (
    <Field
      { ...props }
      orientation={orientation}
    >
      { children }
    </Field>
  )
})

StField.displayName = 'StField'
