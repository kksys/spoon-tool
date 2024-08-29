import { Button, Checkbox, CheckboxOnChangeData, DialogActions, DialogBody, DialogContent, DialogTitle, DialogTrigger, tokens } from '@fluentui/react-components'
import { FC, memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { IStDialogProps, StDialog } from '#/cross-cutting/views/components/st-dialog/StDialog'

interface IResetWarningDialogProps extends Pick<IStDialogProps, 'open' | 'onOpenChange'> {
  onClickYes: () => void | Promise<void>
}

export const ResetWarningDialog: FC<IResetWarningDialogProps> = memo(({ open, onOpenChange, onClickYes }) => {
  const { t } = useTranslation()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const opened = !!open

    return () => {
      opened && setTimeout(() => setChecked(false), 500)
    }
  }, [open])

  const handleChange = useCallback((
    _ev: React.ChangeEvent<HTMLInputElement>,
    data: CheckboxOnChangeData
  ) => {
    setChecked(Boolean(data.checked))
  }, [])

  const handleClickYes = useCallback(async () => {
    await onClickYes()
  }, [onClickYes])

  return (
    <StDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogBody>
        <DialogTitle>
          { t('reset-configuration.warning-dialog.title') }
        </DialogTitle>
        <DialogContent>
          <p>
            { t('reset-configuration.warning-dialog.body') }
          </p>
          <Checkbox
            checked={checked}
            onChange={handleChange}
            label={ t('reset-configuration.warning-dialog.checkbox') }
          />
        </DialogContent>
        <DialogActions>
          <DialogTrigger action="close">
            <Button
              appearance="secondary"
              aria-label="cancel"
            >
              { t('common.cancel') }
            </Button>
          </DialogTrigger>
          <DialogTrigger action="close">
            <Button
              appearance="primary"
              aria-label="continue"
              style={{
                backgroundColor: checked ? tokens.colorStatusDangerBackground3 : undefined
              }}
              disabled={!checked}
              onClick={handleClickYes}
            >
              { t('common.continue') }
            </Button>
          </DialogTrigger>
        </DialogActions>
      </DialogBody>
    </StDialog>
  )
})

ResetWarningDialog.displayName = 'ResetWarningDialog'
