import { Combobox, ComboboxProps, makeStyles, Option, SelectionEvents } from '@fluentui/react-components'
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
    '> input': {
      minWidth: 0,
      cursor: 'pointer',
      userSelect: 'none'
    }
  }
})

export const LangSelector: FC<ILangSelectorProps> = memo(({ id, languages, language, onChange }) => {
  const styles = useStyles()
  const { t } = useTranslation('translation')

  const onChangeLanguage = useCallback<NonNullable<ComboboxProps['onOptionSelect']>>((event, data) => {
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
    <Combobox
      id={id}
      readOnly={true}
      className={styles.combobox}
      value={ t(`lang-selector.values.${language}`) }
      selectedOptions={[language]}
      onOptionSelect={onChangeLanguage}
      input={{ autoComplete: 'off' }}
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
    </Combobox>
  )
})

LangSelector.displayName = 'LangSelector'
