/**
 * {
 *    "id": 313405341,
 *    "nickname": "【公式】Spoon運営",
 *    "profile_url": "http://jp-cdn.spooncast.net/profiles/e/qzoDweWCgKjGB3/72dc3511-c00c-48f0-811f-95c4601516a9.jpg",
 *    "tier_name": "Original",
 *    "description": "Spoon運営の公式アカウント🥄\n\n※FANボードへお返事は出来ませんので、質問や不具合に関してはお問い合わせにお願いいたします。",
 *    "tag": "spoon",
 *    "is_verified": true,
 *    "is_vip": true,
 *    "current_live_id": null,
 *    "follower_count": 117446,
 *    "following_count": 117446,
 *    "is_live": false,
 *    "is_active": true,
 *    "badge_style_ids": []
 *  }
 */
export type TierName = 'Original' | 'Red_Choice' | 'Orange_Choice' | 'Yellow_Choice' | ''
type Country = 'jp' | 'us' | 'kr'
export type BadgeStyleId = 'curation' | 'rainy_ring' | 'vip' | 'vip_ring' | 'voice' | 'firework_ring'
type VipGrade = 'vip'
interface Membership {
  grade: 'PREMIUM' | 'PRO'
  status: 'ACTIVE'
  cast_id: null
  image_url: string | null
  color_code: number
  description: string | null
}

export interface UserEntry {
  id: number
  nickname: string
  profile_url: string
  tier_name: TierName
  description: string
  tag: string
  is_verified: boolean
  is_vip: boolean
  current_live_id: number | null
  follower_count: number
  following_count: number
  is_live: boolean
  is_active: boolean
  badge_style_ids: BadgeStyleId[]
}

export interface ProfileEntry {
  id: number
  tag: string
  nickname: string
  description: string
  top_impressions: [number, number]
  profile_url: string
  profile_cover_url: string
  follower_count: number
  following_count: number
  is_active: boolean
  top_fans: {
    user: Pick<
      ProfileEntry,
      'id' | 'nickname' | 'tag' | 'top_impressions' | 'description' | 'profile_url' |
      'follow_status' | 'follower_count' | 'following_count' | 'is_active' | 'is_vip' |
      'date_joined' | 'current_live' | 'country' | 'is_verified'
    > | {
      gender: (0 | -1 | 1 | 2)
      is_staff: boolean
    }
    total_spoon: number
  }[]
  follow_status: number
  /**
   * Current Live ID
   * @description
   * This field is indicating the current live ID of the user.
   * But this field will be null when current live is for following users only or there is no current live.
   */
  current_live: {
    id: number
  } | null
  country: Country
  is_public_like: boolean
  is_public_cast_storage: boolean
  tier: {
    name: TierName
    title: TierName
  } | null
  is_vip: boolean
  is_verified: boolean
  date_joined: string
  self_introduction: string | null
  is_award_user: boolean
  badge_style_ids: BadgeStyleId[]
  vip_grade: VipGrade | null
  /**
   * Membership
   * @description
   * This field is indicating the membership status of the user.
   */
  membership: Membership | null
}

export interface RelationUserEntry {
  id: number
  nickname: string
  tag: string
  top_impressions: number[]
  description: string
  profile_url: string | null
  gender: (0 | -1 | 1 | 2)
  follow_status: 0
  follower_count: number
  following_count: number
  is_active: boolean
  is_staff: boolean
  is_vip: boolean
  date_joined: string
  current_live: number | null
  country: Country | ''
  is_verified: boolean
}

export interface EndpointTypes {
  spoonApi: {
    fetchUsers: {
      parameters: {
        keyword: string
        page_size: number
        cursor?: undefined
      } | {
        keyword?: string
        page_size?: undefined
        cursor: string
      }
      response: {
        status_code: number
        detail: string
        next: string
        previous: string
        results: UserEntry[]
      }
    }
    getProfile: {
      parameters: {
        id: string
      }
      response: {
        status_code: number
        detail: string
        results: ProfileEntry[]
      }
    }
    fetchFollowers: {
      parameters: {
        id: number
        page_size: number
        cursor?: undefined
      } | {
        id: number
        page_size?: undefined
        cursor: string
      }
      response: {
        status_code: number
        detail: string
        next: string
        previous: string
        results: RelationUserEntry[]
      }
    }
    fetchFollowings: {
      parameters: {
        id: number
        page_size: number
        cursor?: undefined
      } | {
        id: number
        page_size?: undefined
        cursor: string
      }
      response: {
        status_code: number
        detail: string
        next: string
        previous: string
        results: RelationUserEntry[]
      }
    }
  }
}
