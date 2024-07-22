// test/index.spec.ts
import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
  SELF,
  fetchMock
} from 'cloudflare:test';
import {
  describe,
  it,
  expect,
  beforeAll,
  afterEach,
  afterAll
} from 'vitest';
import worker from '../src/index';

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

const httpHeadersForSuccess = {
  Host: 'api.spoon-tool.kk-systems.net',
  Origin: 'https://spoon-tool.kk-systems.net'
}

describe('middleware', () => {
  it('responds with 403 Forbidden (unit style)', async () => {
    const request = new IncomingRequest('http://example.com');
    // Create an empty context to pass to `worker.fetch()`.
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);

    // Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(403);
    expect(response.statusText).toBe('Forbidden');
    expect(await response.json()).toEqual({ error: 'Forbidden' });
  });

  it('responds with 403 Forbidden (integration style)', async () => {
    const response = await SELF.fetch('https://example.com');

    expect(response.status).toBe(403);
    expect(response.statusText).toBe('Forbidden');
    expect(await response.json()).toEqual({ error: 'Forbidden' });
  });

  it('responds with non 404 NotFound (unit style)', async () => {
    const request = new IncomingRequest('http://example.com', { headers: httpHeadersForSuccess });
    // Create an empty context to pass to `worker.fetch()`.
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);

    // Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
    await waitOnExecutionContext(ctx);

    expect(response.status).not.toBe(403);
    expect(response.statusText).not.toBe('Forbidden');
    expect(await response.json()).not.toEqual({ error: 'Forbidden' });
  });

  it('responds with non 404 NotFound (integration style)', async () => {
    const response = await SELF.fetch('https://example.com', { headers: httpHeadersForSuccess });

    expect(response.status).not.toBe(403);
    expect(response.statusText).not.toBe('Forbidden');
    expect(await response.json()).not.toEqual({ error: 'Forbidden' });
  });
})

describe('searchUsers Api', () => {
  const fakeResponse = {
    "status_code": 200,
    "detail": "OK",
    "next": "",
    "previous": "",
    "results": [
      {
        "id": 7492347239,
        "nickname": "fakefake",
        "profile_url": "http://example.com/fake.png",
        "tier_name": "",
        "description": "dummydummydummy",
        "tag": "fakefake",
        "is_verified": false,
        "is_vip": false,
        "current_live_id": null,
        "follower_count": 50000000000,
        "following_count": 1,
        "is_live": false,
        "is_active": true,
        "badge_style_ids": []
      }
    ]
  }

  beforeAll(() => {
    fetchMock.activate()
    fetchMock.disableNetConnect()
  })

  afterEach(() => {
    fetchMock.assertNoPendingInterceptors()
  })

  afterAll(() => {
    fetchMock.deactivate()
  })

  it('responds with 200 Ok (unit style)', async () => {
    fetchMock
      .get('https://jp-api.spooncast.net')
      .intercept({ path: '/search/user/?keyword=test' })
      .reply(200, fakeResponse)

    const request = new IncomingRequest('http://example.com/search/user/?keyword=test', { headers: httpHeadersForSuccess });
    // Create an empty context to pass to `worker.fetch()`.
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);

    // Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(200);
    expect(response.statusText).toBe('OK');
    expect(await response.json()).toEqual(fakeResponse);
  });

  it('responds with Hello World! (integration style)', async () => {
    fetchMock
      .get('https://jp-api.spooncast.net')
      .intercept({ path: '/search/user/?keyword=test' })
      .reply(200, fakeResponse)

    const response = await SELF.fetch('http://example.com/search/user/?keyword=test', { headers: httpHeadersForSuccess });

    expect(response.status).toBe(200);
    expect(response.statusText).toBe('OK');
    expect(await response.json()).toEqual(fakeResponse);
  });
})

describe('getProfile Api', () => {
  const fakeResponse = {
    "status_code": 200,
    "detail": "Success",
    "results": [
      {
        "id": 7492347239,
        "tag": "test",
        "nickname": "fakefakefake",
        "description": "fakeDescription",
        "top_impressions": [11, 14],
        "profile_url": "http://example.com/fake2.jpg",
        "profile_cover_url": "http://example.com/fake3.jpg",
        "follower_count": 117471,
        "following_count": 0,
        "is_active": true,
        "top_fans": [
          {
            "user": {
              "id": 742985724,
              "nickname": "fakefakefakefake",
              "tag": "fake3",
              "top_impressions": [5, 9],
              "description": "",
              "profile_url": "http://example.com/fake4.jpg",
              "gender": 0,
              "follow_status": 0,
              "follower_count": 85,
              "following_count": 27,
              "is_active": true,
              "is_staff": false,
              "is_vip": false,
              "date_joined": "2018-09-21T13:47:40.506015Z",
              "current_live": null,
              "country": "jp",
              "is_verified": false
            },
            "total_spoon": 4728924
          },
          {
            "user": {
              "id": 579548540,
              "nickname": "dummy",
              "tag": "unknown",
              "top_impressions": [],
              "description": "",
              "profile_url": "http://example.com/fake5.jpg",
              "gender": 0,
              "follow_status": 0,
              "follower_count": 144,
              "following_count": 86,
              "is_active": true,
              "is_staff": false,
              "is_vip": false,
              "date_joined": "2022-01-31T20:01:33.895332Z",
              "current_live": null,
              "country": "jp",
              "is_verified": false
            },
            "total_spoon": 472398245
          },
          {
            "user": {
              "id": 729572489542,
              "nickname": "stub",
              "tag": "stubstub",
              "top_impressions": [14, 3],
              "description": "funnyDescription",
              "profile_url": "http://example.com/fake6.jpg",
              "gender": 0,
              "follow_status": 0,
              "follower_count": 521,
              "following_count": 187,
              "is_active": true,
              "is_staff": false,
              "is_vip": false,
              "date_joined": "2020-11-22T13:23:08.791194Z",
              "current_live": null,
              "country": "jp",
              "is_verified": false
            },
            "total_spoon": 57389574
          },
          {
            "user": {
              "id": 572895724952,
              "nickname": "hfuowunhowv",
              "tag": "gheuogerg",
              "top_impressions": [],
              "description": "",
              "profile_url": "http://example.com/fake7.jpg",
              "gender": 0,
              "follow_status": 0,
              "follower_count": 17,
              "following_count": 6,
              "is_active": true,
              "is_staff": false,
              "is_vip": false,
              "date_joined": "2018-06-21T02:37:08.166236Z",
              "current_live": null,
              "country": "kr",
              "is_verified": false
            },
            "total_spoon": 74248592745
          },
          {
            "user": {
              "id": 579845745,
              "nickname": "hngvnjfuovnv",
              "tag": "nvdfvngg",
              "top_impressions": [11, 9],
              "description": "testtest",
              "profile_url": "http://example.com/fake8.jpg",
              "gender": 1,
              "follow_status": 0,
              "follower_count": 218,
              "following_count": 5,
              "is_active": true,
              "is_staff": false,
              "is_vip": false,
              "date_joined": "2021-02-07T12:20:31.284568Z",
              "current_live": null,
              "country": "jp",
              "is_verified": false
            },
            "total_spoon": 752957249524
          },
          {
            "user": {
              "id": 47293572452,
              "nickname": "74nfjfrf",
              "tag": "fnjognreg8",
              "top_impressions": [6, 14],
              "description": "",
              "profile_url": "http://example.com/fake9.jpg",
              "gender": 0,
              "follow_status": 0,
              "follower_count": 387,
              "following_count": 1043,
              "is_active": true,
              "is_staff": false,
              "is_vip": false,
              "date_joined": "2020-02-02T07:48:59.639489Z",
              "current_live": null,
              "country": "jp",
              "is_verified": false
            },
            "total_spoon": 729574895
          }
        ],
        "follow_status": 0,
        "current_live": null,
        "country": "jp",
        "is_public_like": false,
        "is_public_cast_storage": false,
        "tier": {
          "name": "Original",
          "title": "Original"
        },
        "is_vip": true,
        "is_verified": true,
        "date_joined": "2021-01-22T02:23:17.995509Z",
        "self_introduction": null,
        "is_award_user": false,
        "badge_style_ids": [],
        "vip_grade": null,
        "membership": null
      }
    ]
  }

  beforeAll(() => {
    fetchMock.activate()
    fetchMock.disableNetConnect()
  })

  afterEach(() => {
    fetchMock.assertNoPendingInterceptors()
  })

  afterAll(() => {
    fetchMock.deactivate()
  })

  it('responds with 200 Ok (unit style)', async () => {
    fetchMock
      .get('https://jp-api.spooncast.net')
      .intercept({ path: '/users/7492347239/' })
      .reply(200, fakeResponse)

    const request = new IncomingRequest('http://example.com/users/7492347239', { headers: httpHeadersForSuccess });
    // Create an empty context to pass to `worker.fetch()`.
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);

    // Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(200);
    expect(response.statusText).toBe('OK');
    expect(await response.json()).toEqual(fakeResponse);
  });

  it('responds with Hello World! (integration style)', async () => {
    fetchMock
      .get('https://jp-api.spooncast.net')
      .intercept({ path: '/users/7492347239/' })
      .reply(200, fakeResponse)

    const response = await SELF.fetch('http://example.com/users/7492347239', { headers: httpHeadersForSuccess });

    expect(response.status).toBe(200);
    expect(response.statusText).toBe('OK');
    expect(await response.json()).toEqual(fakeResponse);
  });
})
