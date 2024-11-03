import { Dropdown, DropdownProps, makeStyles, Option, SelectionEvents } from '@fluentui/react-components'
import { FC, memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { IConfiguration } from '#/cross-cutting/interfaces/repositories/IConfigurationRepository'

interface ThemeSelectorData {
  selectedTheme: IConfiguration['theme']
}

export interface IThemeSelectorProps {
  id: string
  themes: IConfiguration['theme'][]
  theme: IConfiguration['theme']
  onChange?: (event: SelectionEvents, data: ThemeSelectorData) => void
}

const useStyles = makeStyles({
  combobox: {
    minWidth: 0,
  }
})

export const ThemeSelector: FC<IThemeSelectorProps> = memo(({ id, themes, theme, onChange }) => {
  const styles = useStyles()
  const { t } = useTranslation()

  const onChangeLanguage = useCallback<NonNullable<DropdownProps['onOptionSelect']>>((event, data) => {
    const isLanguage = (value: string | undefined): value is IConfiguration['theme'] => {
      return themes.map(theme => `${theme}`)
        .includes(value || '')
    }

    if (data.optionValue === theme) {
      // no need to update when the selected language is already set to current language
      return
    }

    if (!isLanguage(data.optionValue)) {
      throw new Error('Unknown option')
    }

    onChange?.(event, { selectedTheme: data.optionValue })
  }, [theme, themes, onChange])

  return (
    <Dropdown
      id={ id }
      className={ styles.combobox }
      value={ t(`theme.values.${theme}`, { ns: 'configuration' }) }
      selectedOptions={ [theme] }
      onOptionSelect={ onChangeLanguage }
    >
      { themes
        .map((theme, index) => {
          const message = `theme.values.${theme}` as const
          return (
            <Option
              key={ index }
              value={ theme }
            >
              {
              /**
               * hint for i18n-extract
               *
               * t('theme.values.light', { ns: 'configuration' })
               * t('theme.values.dark', { ns: 'configuration' })
               * t('theme.values.system', { ns: 'configuration' })
               */
                t(message, { ns: 'configuration' })
              }
            </Option>
          )
        })
      }
    </Dropdown>
  )
})

ThemeSelector.displayName = 'ThemeSelector'
