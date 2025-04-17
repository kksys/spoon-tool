import { RelationUserEntry, UserEntry } from '#/search-user/api/EndpointTypes'
import { User } from '#/search-user/interfaces/models/User'

export function mapUserEntityToUser(user: UserEntry): User {
  const convertHttpToHttps = (url: string) =>
    (url.startsWith('http:') && window.location.protocol === 'https:')
      ? url.replace(/^http:/gi, 'https:')
      : url

  const property: User = {
    id: user.id,
    profile: {
      tag: user.tag,
      profileIcon: convertHttpToHttps(user.profile_url),
      nickname: user.nickname,
      joinedDate: undefined,
    },
    statistics: {
      numberOfFollowers: user.follower_count,
      numberOfFollowing: user.following_count,
    },
    relations: {
      followers: [],
      followings: [],
    },
    status: {
      badges: [],
    }
  }

  if (user.tier_name) {
    property.status.badges.push(user.tier_name)
  }

  const badge_style_ids = user.badge_style_ids.filter(id => id === 'voice' || id === 'firework_ring')
  if (badge_style_ids.length > 0) {
    property.status.badges.push(...badge_style_ids)
  }

  return property
}

export function mapUserEntityToRelationUser(user: RelationUserEntry): User {
  const convertHttpToHttps = (url: string) =>
    (url.startsWith('http:') && window.location.protocol === 'https:')
      ? url.replace(/^http:/gi, 'https:')
      : url

  const property: User = {
    id: user.id,
    profile: {
      tag: user.tag,
      profileIcon: user.profile_url ? convertHttpToHttps(user.profile_url) : '',
      nickname: user.nickname,
      joinedDate: undefined,
    },
    statistics: {
      numberOfFollowers: user.follower_count,
      numberOfFollowing: user.following_count,
    },
    relations: {
      followers: [],
      followings: [],
    },
    status: {
      badges: [],
    }
  }

  return property
}
