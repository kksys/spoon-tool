import { Combobox, ComboboxProps, makeStyles, Option } from "@fluentui/react-components"
import { FC, memo, useCallback } from "react"
import { useTranslation } from "react-i18next"

import { languages } from "~/i18n.resources"

interface ILangSelector {
  id: string
}

const useStyles = makeStyles({
  combobox: {
    '> input': {
      cursor: 'pointer',
      userSelect: 'none'
    }
  }
})

export const LangSelector: FC<ILangSelector> = memo(({ id }) => {
  const styles = useStyles()
  const { t, i18n } = useTranslation('translation')

  const onChangeLanguage = useCallback<NonNullable<ComboboxProps['onOptionSelect']>>((_event, data) => {
    if (data.optionValue === i18n.language) {
      // no need to update when the selected language is already set to current language
      return
    }

    i18n.changeLanguage(data.optionValue)
  }, [i18n])

  return (
    <Combobox
      id={id}
      readOnly={true}
      className={styles.combobox}
      value={ t(`lang-selector.values.${i18n.language}`) }
      selectedOptions={[i18n.language]}
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
