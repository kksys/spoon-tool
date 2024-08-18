import { Field, FieldProps } from "@fluentui/react-components"
import { FC, memo, useCallback, useEffect, useState } from "react"

interface IStFieldProps extends Omit<FieldProps, 'orientation'> {}

export const StField: FC<IStFieldProps> = memo(({ children, ...props }) => {
  const estimateOrientation = useCallback((): 'horizontal' | 'vertical' => {
    return window.innerWidth > 425 ? 'horizontal' : 'vertical'
  }, [])

  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>(estimateOrientation)

  useEffect(() => {
    const handleResize = (_event: UIEvent) => {
      setOrientation(estimateOrientation())
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })

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
