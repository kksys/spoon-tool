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
export type UserEntry = {
  id: number
  nickname: string
  profile_url: string
  tier_name: 'Original' | 'Red_Choice' | 'Orange_Choice' | ''
  description: string
  tag: string
  is_verified: boolean
  is_vip: boolean
  current_live_id: number | null
  follower_count: number
  following_count: number
  is_live: boolean
  is_active: boolean
  badge_style_ids: ('curation' | 'rainy_ring')[]
}
export type ProfileEntry = {
  date_joined: string
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
      },
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
      },
      response: {
        status_code: number
        detail: string
        next: string
        previous: string
        results: ProfileEntry[]
      }
    }
  }
}
