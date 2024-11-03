import { UserConfig } from 'i18next-parser'

import { defaultNS } from './src/i18n.resources'

const config: UserConfig = {
  locales: ['en-US', 'ja-JP'],
  defaultNamespace: defaultNS,
  output: 'src/locales/$LOCALE/$NAMESPACE.json',
}

export default config
