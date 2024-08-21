import { Button, DialogActions, DialogBody, DialogContent, DialogTitle, DialogTrigger } from '@fluentui/react-components'
import { FC, memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { IStDialogProps, StDialog } from '#/cross-cutting/views/components/st-dialog/StDialog'

interface IResetCompleteDialogProps extends Pick<IStDialogProps, 'open' | 'onOpenChange'> {
  onClickClose: () => void | Promise<void>
}

export const ResetCompleteDialog: FC<IResetCompleteDialogProps> = memo(({ open, onOpenChange, onClickClose }) => {
  const { t } = useTranslation()

  const handleClickClose = useCallback(async () => {
    await onClickClose()
  }, [onClickClose])

  return (
    <StDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogBody>
        <DialogTitle>
          { t('reset-configuration.complete-dialog.title') }
        </DialogTitle>
        <DialogContent>
          <p>
            { t('reset-configuration.complete-dialog.body') }
          </p>
        </DialogContent>
        <DialogActions>
          <DialogTrigger action="close">
            <Button
              appearance="secondary"
              aria-label="close"
              onClick={handleClickClose}
            >
              { t('common.close') }
            </Button>
          </DialogTrigger>
        </DialogActions>
      </DialogBody>
    </StDialog>
  )
})

ResetCompleteDialog.displayName = 'ResetCompleteDialog'
