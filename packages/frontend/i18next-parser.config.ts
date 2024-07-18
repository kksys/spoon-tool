import { UserConfig } from 'i18next-parser'

const config: UserConfig = {
  locales: ['en-US', 'ja-JP'],
  output: 'src/locales/$LOCALE/$NAMESPACE.json',
}

export default config
