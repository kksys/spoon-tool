import { Dropdown, DropdownProps, makeStyles, Option, SelectionEvents } from '@fluentui/react-components'
import { i18n } from 'i18next'
import { FC, memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

interface LangSelectorData {
  selectedLanguage: i18n['language']
}

export interface ILangSelectorProps {
  id: string
  languages: i18n['language'][]
  language: i18n['language']
  onChange?: (event: SelectionEvents, data: LangSelectorData) => void
}

const useStyles = makeStyles({
  combobox: {
    minWidth: 0,
  }
})

export const LangSelector: FC<ILangSelectorProps> = memo(({ id, languages, language, onChange }) => {
  const styles = useStyles()
  const { t } = useTranslation('translation')

  const onChangeLanguage = useCallback<NonNullable<DropdownProps['onOptionSelect']>>((event, data) => {
    const isLanguage = (value: string | undefined): value is i18n['language'] => {
      return languages.map(lang => `${lang}`)
        .includes(value || '')
    }

    if (data.optionValue === language) {
      // no need to update when the selected language is already set to current language
      return
    }

    if (!isLanguage(data.optionValue)) {
      throw new Error('Unknown option')
    }

    onChange?.(event, { selectedLanguage: data.optionValue })
  }, [language, languages, onChange])

  return (
    <Dropdown
      id={id}
      className={styles.combobox}
      value={ t(`lang-selector.values.${language}`) }
      selectedOptions={[language]}
      onOptionSelect={onChangeLanguage}
    >
      { languages
        .map((lang, index) => {
          const message = `lang-selector.values.${lang}` as const
          return (
            <Option
              key={index}
              value={lang}
            >
              {
              /**
               * hint for i18n-extract
               *
               * t('lang-selector.values.en-US')
               * t('lang-selector.values.ja-JP')
               */
                t(message)
              }
            </Option>
          )
        })
      }
    </Dropdown>
  )
})

LangSelector.displayName = 'LangSelector'