import { describe, test, expect } from '@jest/globals'
import _ from 'lodash'
import DummyJsonClient from '../../clients/dummyjson/client'
import '../../utils/custom-matchers'
import { creds } from '../../data/dummy-data'
import { waitFor } from '../../utils/helpers';
import { validateSchema } from '../../utils/schema-validator'
import { dummyJsonSchemaPaths as schemaPaths } from '../../data/constants'

describe('POST /auth/login', () => {
    let client
    beforeEach(async () => {
        client = new DummyJsonClient()
    })

    test('auth with correct credentials returns 200 and tokens', async () => {
        const res = await client.auth.login({ body: creds() })
        expect(res).toHaveStatus(200)
        expect(res.headers['set-cookie']).toEqual(
            expect.arrayContaining([
                expect.stringContaining(`accessToken=${res.data.accessToken}`),
                expect.stringContaining(`refreshToken=${res.data.refreshToken}`),
            ])
        )
        expect(res.headers['set-cookie']).toHaveLength(2)
    })

    test('received JWT is valid', async () => {
        const userCreds = creds()
        const res = await client.auth.login({ body: userCreds })
        expect(res).toHaveStatus(200)
        
        const jwt = res.data.accessToken
        const whoamiRes = await client.auth.getCurrentAuthUser({
            headers: { Authorization: `Bearer ${jwt}` },
        })
        expect(whoamiRes).toHaveStatus(200)
        expect(whoamiRes.data.username).toEqual(userCreds.username)
        expect(whoamiRes.data.password).toEqual(userCreds.password)
    })

    test('auth with incorrect credentials returns 400', async () => {
        const res = await client.auth.login({
            body: creds({ valid: false }),
        })
        expect(res).toHaveStatus(400)
    })

    test.skip('auth token expires after specified time', async () => {
        const res = await client.auth.login({ body: creds() })
        expect(res).toHaveStatus(200)
        
        await waitFor(61 * 1000)    // wait until jwt expires; expiration can't be set lower than 1 min
        const jwt = res.data.accessToken
        const whoamiRes = await client.auth.getCurrentAuthUser({
            headers: { Authorization: `Bearer ${jwt}` },
        })
        expect(whoamiRes).toHaveStatus(401)
    }, 65 * 1000)

    test('expiresInMins negative value returns 400', async () => {
        const res = await client.auth.login({ 
            body: creds({ valid: true, expiresInMins: -1 }),
        })
        expect(res).toHaveStatus(400)
    })

    test('200 schema validation', async () => {
        const res = await client.auth.login({ body: creds() })
        expect(res).toHaveStatus(200)
        const { errors } = validateSchema(schemaPaths.auth.login.POST[200], res.data)
        expect(errors).toBeNull()
    })
})