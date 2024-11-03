import about from './about.json'
import common from './common.json'
import configuration from './configuration.json'
import searchUser from './search-user.json'

export default {
  about,
  configuration,
  common,
  'search-user': searchUser,
} as const
